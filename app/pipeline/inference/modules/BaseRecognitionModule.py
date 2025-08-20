import pika
import json,os
import uuid
import traceback
import signal
import ssl
from decouple import config
import boto3
import time
from types import SimpleNamespace
import base64
import requests

def print_keys(dic):
    for key, value in dic.items():
        print(key)
        if isinstance(value, dict):
            print_keys(value)

class BaseRecognitionModule:
    def __init__(self, module_name, media_input_type, depends_on=[]):
        self.module_name = module_name
        self.connection = self.setup_rabbitmq_connection()
        self.channel = self.connection.channel()
        self.module_id = str(uuid.uuid4())
        self.consumer_tag = ''
        self.user_id = 0
        self.module_details = {
            'module_id': self.module_id,
            'module_name': self.module_name,
            'media_input_type': media_input_type,
            'depends_on': depends_on
        }
        self.register_module()
        signal.signal(signal.SIGTERM, self.handle_sigterm)

    def setup_rabbitmq_connection(self):
        rabbitmq_host = config('RABBITMQ_HOST', default='rabbitmq')
        rabbitmq_port = config('RABBITMQ_PORT', default=5671, cast=int)
        rabbitmq_broker_id = config('RABBITMQ_AWS_BROKER', default=None)
        rabbitmq_user = config('RABBITMQ_USER', default='guest')
        rabbitmq_password = config('RABBITMQ_PASS', default='guest')
        region = config('RABBITMQ_REGION', default='rabbitmq')

        if rabbitmq_broker_id:
            print("Running on AWS!")

            ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
            ssl_context.set_ciphers('ECDHE+AESGCM:!ECDSA')

            url = f"amqps://{rabbitmq_user}:{rabbitmq_password}@{rabbitmq_broker_id}.mq.{region}.amazonaws.com:{rabbitmq_port}"
            parameters = pika.URLParameters(url)
            parameters.ssl_options = pika.SSLOptions(context=ssl_context)
            parameters.heartbeat = 0
            connection = pika.BlockingConnection(parameters)
        else:
            print("Running on Local Docker!")
            connection = pika.BlockingConnection(pika.ConnectionParameters(rabbitmq_host, rabbitmq_port))

        return connection


    def handle_sigterm(self, signum, frame):
        print(f"Received SIGTERM signal. Cleaning up and exiting gracefully...")
        self.unregister_module()
        exit(0) 
    def register_module(self):
        if(config('DOCKER_ENV', default = 'False') == 'True'):
            self.channel.queue_declare(queue=self.module_name)
            self.channel.queue_bind(exchange='modules', queue=self.module_name)
        
        self.channel.basic_publish(exchange='modules', routing_key='register_module', body=json.dumps(self.module_details))
        print(f'Module {self.module_id} ({self.module_name}) registered successfully.')
    def unregister_module(self):
        self.channel.basic_publish(exchange='modules', routing_key='unregister_module', body=json.dumps(self.module_details))
        print(f'Module {self.module_id} ({self.module_name}) unregistered successfully.')
    def send_partial_result(self,value):
        self.reply_to
        self.user_id 
        # we are sending periodic heathbeats to keep the main connection alive.
        self.connection.process_data_events(time_limit=0)

        tmpconn = self.setup_rabbitmq_connection()
        channel = tmpconn.channel()
        message = {
                'status': f'{value}',
                'user_id': self.user_id ,
                'module_name': self.module_name,
                'module_id': self.module_id,
        }
        channel.basic_publish(exchange='modules',
                            routing_key=self.reply_to,
                            body=json.dumps(message))
        tmpconn.close()
    def download_from_s3(self, bucket_name, obj_name):
        s3_client = boto3.client('s3')
        try:
            s3_response_object = s3_client.get_object(Bucket=bucket_name, Key=obj_name)
            object_content = s3_response_object['Body'].read()
            return object_content
        except:
            return None
    def module_request_callback(self, ch, reply_to, body):
        request_data = json.loads(body)
        print(f" {self.module_name}:{self.module_id} Response for user {request_data['user_id']}")
        self.reply_to = reply_to
        self.user_id = request_data['user_id']
        message = {
                'status': 'running',
                'user_id': request_data['user_id'],
                'module_name': self.module_name,
                'module_id': self.module_id,
        }
        ch.basic_publish(exchange='modules',
                            routing_key=self.reply_to,
                            body=json.dumps(message))
        try:
            if(config('DOCKER_ENV', default = 'False') == 'True'):
                response = requests.get('http://web-server:80/api/get_files_from_upload_folder?filename='+str(request_data['b64_media_s3_url']))
                if response.status_code == 200:
                    b64media = response.content
                else:
                    raise Exception(f'Error: {response.status_code}')
            else:
                BUCKET_NAME = config('BUCKET_NAME', default='none')
                if(BUCKET_NAME == "none"):
                    print("ENV BUCKET_NAME required")
                    exit(1)
                b64media = self.download_from_s3(BUCKET_NAME,request_data['b64_media_s3_url'])
            pre_processed_media = self.pre_process(json.loads(b64media))
            response = self.inference(pre_processed_media)
            ##
            print(f"Finished response")
            message = {
                'response': response,
                'status': '100',
                'user_id': request_data['user_id'],
                'module_name': self.module_name,
                'module_id': self.module_id,
            }
            ch.basic_publish(exchange='modules',
                            routing_key=self.reply_to,
                            body=json.dumps(message))
        except KeyboardInterrupt:
            print('Interrupted by user')
            self.unregister_module()
            self.channel.close()
            self.connection.close()
            print('Connection closed.')
        except Exception as e:
            print(f"Error processing the message: {e}")
            print(traceback.format_exc())
            message = {
                'response': str(e),
                'status': 'error',
                'user_id': request_data['user_id'],
                'module_name': self.module_name,
                'module_id': self.module_id,
            }
            ch.basic_publish(exchange='modules',
                            routing_key='crashed_modules',
                            body=json.dumps(message))
    def pre_process(self, mediaList): #TBI
        pass 
    def inference(self, mediaList): #TBI
        pass
    def labels2effects(self, labels, effect_dict): #TBI
        pass
    
    def start_consuming(self):
        try:
            print(f'[*] Waiting for messages for module {self.module_name}/{self.module_id}')
            last_log_time = time.time()

            while True:
                method_frame, header_frame, body = self.channel.basic_get(queue=self.module_name, auto_ack=True)
                if method_frame:
                    print("Got message")
                    self.module_request_callback(
                        self.channel,
                        header_frame.reply_to,
                        body
                    )
                else:
                    # No message received, print a log every 30 seconds
                    current_time = time.time()
                    if current_time - last_log_time >= 30:
                        print("Waiting for messages...")
                        last_log_time = current_time
        except KeyboardInterrupt:
            print('Interrupted')
            self.unregister_module()
        finally:
            self.channel.close()
            self.connection.close()
            print('Connection closed.')

    # LAMBDA
    def consume_once(self,evt):
        queue_resp = evt['rmqMessagesByQueue'][list(evt['rmqMessagesByQueue'])[0]][0]
        body = queue_resp['data']
        try:
            json.loads(body)
        except:
            decoded_bytes = base64.b64decode(body)
            body = decoded_bytes.decode('utf-8')
        # We are going on a tangent here. AWS Labmda only allows for 6mb payloads. We have bigger than this.
        # So we are LISTENING on a queue to start our lambda function.
        # This queue send the url of the s3 obj
        print("Got message")
        self.module_request_callback(
            self.channel,
            queue_resp['basicProperties']['replyTo'],
            body
        )
        self.unregister_module()
        self.channel.close()
        self.connection.close()
        print('Connection closed.')