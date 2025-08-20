import json, os
from flask import Flask, request, jsonify,make_response,send_from_directory
import pika
from flask_cors import CORS
import uuid
import redis
from inference import map
from decouple import config
import hashlib
import ssl
import requests, threading
import boto3
app = Flask(__name__)
app.secret_key = '53d77749d3d79597a822a2658d6d526350ea412eee15a947d0591bec9af9277a'
app.config.from_object(__name__)
CORS(app, resources={r"/*"},supports_credentials=True)
app.config['UPLOAD_FOLDER'] = "./upload/"

redis_host = config('REDIS_HOST', default='redis')
redis_port = config('REDIS_PORT', default=6379, cast=int)
redis_db = config('REDIS_DB', default=0, cast=int)
redis_client = redis.StrictRedis(host=redis_host, port=redis_port, db=redis_db)

def setup_rabbitmq_connection():
    rabbitmq_host = config('RABBITMQ_HOST', default='rabbitmq')
    rabbitmq_port = config('RABBITMQ_PORT', default=5672, cast=int)
    rabbitmq_broker_id = config('RABBITMQ_AWS_BROKER', default=None)

    if rabbitmq_broker_id:
        print("Running on AWS!")
        rabbitmq_user = config('RABBITMQ_USER', default='guest')
        rabbitmq_password = config('RABBITMQ_PASS', default='guest')
        region = config('RABBITMQ_REGION', default='rabbitmq')

        ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
        ssl_context.set_ciphers('ECDHE+AESGCM:!ECDSA')

        url = f"amqps://{rabbitmq_user}:{rabbitmq_password}@{rabbitmq_broker_id}.mq.{region}.amazonaws.com:{rabbitmq_port}"
        parameters = pika.URLParameters(url)
        parameters.ssl_options = pika.SSLOptions(context=ssl_context)
        connection = pika.BlockingConnection(parameters)
    else:
        connection = pika.BlockingConnection(pika.ConnectionParameters(rabbitmq_host, rabbitmq_port))

    return connection



def upload_to_s3(media_data,selected_modules):
    s3 = boto3.client('s3')
    BUCKET_NAME = config('BUCKET_NAME', default='none')
    if(BUCKET_NAME == "none"):
        print("ENV BUCKET_NAME required")
        exit(1)
    medias_s3_urlList = {}
    main_obj_name = str(hashlib.md5(media_data.encode()).hexdigest())
    for module in selected_modules:
        # If the object does not exist, upload it
        obj_media_input_path = main_obj_name+"-"+module['media_input_type']
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=obj_media_input_path)
        if 'Contents' in response:
            print(f"Object {obj_media_input_path} already exists in the bucket.")
        else:
            decoded_json_val = map.create_media_version(media_data,module)
            s3.put_object(Body=json.dumps(decoded_json_val), Bucket=BUCKET_NAME, Key=obj_media_input_path)
            print(f"Uploaded object {obj_media_input_path} to the bucket.")
        medias_s3_urlList[module['media_input_type']] = obj_media_input_path
    return medias_s3_urlList


# this creates a new user_id and start processing the media. It returns the userID.
# the user must wait FOR ALL THE SELECTED MODULES TO RETURN
def send_media(media_data,selected_modules):
    connection = setup_rabbitmq_connection()
    channel = connection.channel()
    user_id = str(uuid.uuid4())
    print("queue begin for ",user_id)    
    if(config('DOCKER_ENV', default = 'False') == 'True'):
        medias_s3_urlList = {}
        main_obj_name = str(hashlib.md5(media_data.encode()).hexdigest())
        main_obj_path = app.config['UPLOAD_FOLDER']+main_obj_name
        for module in selected_modules:
                obj_media_inputh_path = main_obj_path+"-"+module['media_input_type']
                if(not os.path.isfile(obj_media_inputh_path)):

                    media_version = map.create_media_version(media_data,module)
                    with open(obj_media_inputh_path, 'w') as file:
                        file.write(json.dumps(media_version))
                else:
                     print(module['media_input_type'] + " Already exists!")
                medias_s3_urlList[module['media_input_type']] = obj_media_inputh_path
    else:
        medias_s3_urlList = upload_to_s3(media_data,selected_modules)
        #medias_s3_urlList is a dict for the name of the media (e.g. equirectangular)
        #that in turn has a dict for each second containing b64 frames


    for module in selected_modules:
        if(config('MOCK_LAMBDA', default = 'False') == 'True'):
            print("IN LAMBDA MOCK!")
            dns_dict = {
                "effectLocalization": "aws-module",
                "fireLocalization": "fire-module",
                "sceneUnderstanding": "scene-module",
                "sunLocalization": "sun-module"
            }
            wake_up_message = {
                    'b64_media_s3_url' : medias_s3_urlList[module['media_input_type']],
                    'user_id': user_id
            }
            data = {
                'rmqMessagesByQueue': {
                    str(module["module_name"]): [
                        {
                            'basicProperties': {
                                'replyTo': 'modules_responses'
                            },
                            'data': json.dumps(wake_up_message)
                        }
                    ]
                }
            }
            url = "http://"+dns_dict[module["module_name"]]+":8080/2015-03-31/functions/function/invocations"
            headers = {"Content-Type": "application/json"}
            def request_task(url, data, headers):
                requests.post(url, headers=headers, data=json.dumps(data))
            def fire_and_forget(url, data, headers):
                threading.Thread(target=request_task, args=(url, data, headers)).start()
            fire_and_forget(url, data=data, headers=headers)
        else: ## AWS
            # Queue to wake up the lambda
            channel.queue_declare(queue=module['module_name'])
            channel.queue_bind(exchange='modules', queue=module['module_name'])
            wake_up_message = {
                    'b64_media_s3_url': medias_s3_urlList[module['media_input_type']],
                    'user_id': user_id
                }
            channel.basic_publish(exchange='modules',
                                routing_key=module['module_name'], 
                                properties = pika.BasicProperties(
                                    reply_to='modules_responses'),
                                    body=json.dumps(wake_up_message))
        redis_key = f'user_responses:{user_id}'
        response_key = f'{redis_key}:{module["module_name"]}'
        redis_client.set(response_key, json.dumps({'status':'initialized','response':None}))
        print(f"Sent media to Module {module['module_name']} for User {user_id}")
    connection.close()


    return {'job_uid': user_id}

def redis_get_all_keys_values(redis_key_pattern):
    response_data = {}
    for key in redis_client.scan_iter(match=redis_key_pattern):
        key = key.decode('utf-8')
        value = redis_client.get(key).decode('utf-8')
        if value:
            try:
                response_data[key] = json.loads(value)
            except json.JSONDecodeError:
                response_data[key] = value  # Store the raw string in case of decoding error
    return response_data

@app.route('/api', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if(config('DOCKER_ENV', default = 'False') == 'True'):
    @app.route('/api/get_files_from_upload_folder', methods=['GET'])
    def get_file():
        filename = request.args.get('filename')
        if filename is None:
            return jsonify({'error': 'No filename provided'})
        filename = os.path.basename(filename) 
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            return jsonify({'error': 'Server error: upload folder does not exist'})
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'})
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)


@app.route('/api/get_modules_status', methods=['GET'])
def get_modules_status():
    args = request.args
    user_id = args.get("user_id")
    redis_data = redis_get_all_keys_values(f'user_responses:{user_id}:*')
    trimmed_data = {}
    #keep the last part only
    for key, value in redis_data.items():
        trimmed_key = key.split(':')[-1]
        trimmed_data[trimmed_key] = value
    return trimmed_data


@app.route('/api/upload_video', methods=['POST','OPTIONS'])
def upload_video():

    if request.method == 'OPTIONS':
        # Handle preflight request
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    print("starting Map")
    data = json.loads(request.data, strict=False)

    if data is None or data['video'] is None:
      print("No valid request body, video missing!")
      return jsonify({'error': 'No valid request body, json missing!'})  

    #TODO: verificar se o usuario selecionou modulos que estao ativos
    user_id = data.get('user_id')
    selected_modules = data.get('modules', [])
    if(not selected_modules):
        print("No modules selected")
        return jsonify({'error': 'No modules selected!'})
    # IGNORE MODULES REGISTRATION. WE WILL PIVOT DO AWS LAMBDA. THUS EACH MODULE WILL SPIN UP BY REQUEST
    #available_modules = redis_get_all_keys_values(f'available_modules:*')
    available_modules  = {
        'effectLocalization': {'module_name': 'effectLocalization', 'media_input_type': 'equirectangular'},
        'fireLocalization' : {'module_name':'fireLocalization', 'media_input_type': 'equirectangular'},
        'sunLocalization' : {'module_name':'sunLocalization', 'media_input_type': 'equirectangular'},
        'sceneUnderstanding' : {'module_name':'sceneUnderstanding', 'media_input_type': 'equirectangular'}}
    filtered_modules = [module for module in available_modules.values() if module['module_name'] in selected_modules]
    filtered_modules_names = [name['module_name'] for name in filtered_modules]
    invalid_modules = [module for module in selected_modules if module not in filtered_modules_names]
    if invalid_modules:
        return jsonify({'error': f'Invalid module names: {", ".join(invalid_modules)}'})
    video_data = data['video']
    return jsonify(send_media(video_data,filtered_modules))


@app.route('/api/labels_2_sensory_effects', methods=['POST'])
def labels_2_sensory_effects():

    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    print("starting labels2effects")

    data = json.loads(request.data, strict=False)

    if data is None or data['labels2effectDict'] is None or data['labels'] is None:
      print("No valid request body, json missing!")
      return jsonify({'error': 'No valid request body, json missing!'})  
    
    output = map.doLabels2Effects(data['labels'],data['labels2effectDict'],data['select-filter-combine-preset'])

    return output