import pika
import json
import redis
from decouple import config
import ssl
redis_host = config('REDIS_HOST', default='redis')
redis_port = config('REDIS_PORT', default=6379, cast=int)
redis_db = config('REDIS_DB', default=0, cast=int)
redis_client = redis.StrictRedis(host=redis_host, port=redis_port, db=redis_db)


rabbitmq_host = config('RABBITMQ_HOST', default='rabbitmq')
rabbitmq_port = config('RABBITMQ_PORT', default=5672, cast=int)
print(rabbitmq_host,rabbitmq_port)
rabbitmq_broker_id = config('RABBITMQ_AWS_BROKER', default=None)

# SSL Context for TLS configuration of Amazon MQ for RabbitMQ
if(rabbitmq_broker_id):
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
channel = connection.channel()
channel.exchange_declare(exchange='modules', exchange_type='direct')
channel.queue_declare(queue='register_module')
channel.queue_bind(exchange='modules', queue='register_module')
channel.queue_declare(queue='unregister_module')
channel.queue_bind(exchange='modules', queue='unregister_module')
channel.queue_declare(queue='modules_responses')
channel.queue_bind(exchange='modules', queue='modules_responses')
channel.queue_declare(queue='crashed_modules')
channel.queue_bind(exchange='modules', queue='crashed_modules')


def crashed_module(ch, method, properties, body):
    module_data = json.loads(body)
    module_id = module_data.get('module_id')
    user_id = module_data.get('user_id')
    module_name = module_data.get('module_name')
    error_resp = module_data.get('response')
    status = module_data.get('status')
    redis_key = f'registered_modules:{module_name}:{module_id}'
    redis_client.set(redis_key,json.dumps({'status':'crashed'}))
    #redis_client.expire(redis_key, 60)
    print(f"Module {module_name}:{module_id} Crashed!")
    redis_key = f'user_responses:{user_id}:{module_name}'
    redis_client.set(redis_key, json.dumps({'response': error_resp,'status':status}))
    redis_client.expire(redis_key, 180) # 3 minutes to delete the key


def unregister_module(ch, method, properties, body):
    module_data = json.loads(body)
    module_id = module_data.get('module_id')
    module_name = module_data.get('module_name')
   
    redis_key = f'registered_modules:{module_name}:{module_id}'
    redis_client.delete(redis_key)
    print(f"Module {module_id}:{module_name} unregistered.")

    keys = redis_client.keys(f'registered_modules:{module_name}:*')
    if not keys:
        redis_client.delete(f'registered_modules:{module_name}')
        redis_client.delete(f'available_modules:{module_name}')
        print(f"No more modules of this type, deleted key: {module_name}")

def register_module(ch, method, properties, body):
    module_data = json.loads(body)
    module_id = module_data.get('module_id')
    module_name = module_data.get('module_name')
    media_input_type = module_data.get('media_input_type')
    depends_on = module_data.get('depends_on')

    if module_id is None or media_input_type is None:
        print("Invalid module registration request. Module ID and media_input_type function are required.")
        return
    
    # this will overwrite the registry. Its assumed to be a idempotent operation in map.py
    registry = {'module_name':module_name,
        'media_input_type':media_input_type,
        'depends_on':depends_on}

    redis_key = f'available_modules:{module_name}'
    redis_client.set(redis_key,json.dumps(registry))

    redis_key = f'registered_modules:{module_name}:{module_id}'
    redis_client.set(redis_key,json.dumps({'status':'active'}))
    print(f"Module {module_name}:{module_id} registered.")

def handle_module_response(ch, method, properties, body):
    response_data = json.loads(body)
    user_id = response_data.get('user_id')
    module_name = response_data.get('module_name')
    module_id = response_data.get('module_id')
    response = response_data.get('response')
    status = response_data.get('status')
    if user_id is None:
        print("Invalid module response. User ID is required.")
        return

    # Define a Redis key for user-specific responses
    redis_key = f'user_responses:{user_id}'
    response_key = f'{redis_key}:{module_name}'
    redis_client.set(response_key, json.dumps({'response': response,'status':status, 'module_id':module_id}))
    redis_client.expire(response_key, 180)
    print(f"Module response (status: {status}) saved for User {user_id}. {module_name}/{module_id}")

# RabbitMQ consumer setup
channel.basic_consume(queue='register_module', on_message_callback=register_module, auto_ack=True)
channel.basic_consume(queue='unregister_module', on_message_callback=unregister_module, auto_ack=True)
channel.basic_consume(queue='crashed_modules', on_message_callback=crashed_module, auto_ack=True)
channel.basic_consume(queue='modules_responses', on_message_callback=handle_module_response, auto_ack=True)

print('Waiting for module responses. To exit press CTRL+C')
channel.start_consuming()