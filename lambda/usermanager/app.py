import boto3
from boto3.dynamodb.conditions import Key, Attr
from chalice import Chalice, Response, BadRequestError, NotFoundError, AuthResponse
from botocore.exceptions import ClientError
from chalicelib import auth
from chalice import CORSConfig
from datetime import datetime
import random
import string
import json

app = Chalice(app_name='usermanager')

def generate_random_string(str_code):
    alpha = string.ascii_uppercase
    num = string.digits
    unique_id = ''.join(random.choice(alpha + num) for _ in range(str_code))
    return unique_id

#cors configuration
cors_config = CORSConfig(
    allow_origin='*',
    allow_headers=['X-Special-Header','Authorization'],
    max_age=600,
    expose_headers=['X-Special-Header'],
    allow_credentials=True
)

#jwt token decode
@app.authorizer()
def jwt_auth(auth_request):
    token = auth_request.token
    decoded = auth.decode_jwt_token(token)
    return AuthResponse(routes=['*'], principal_id=decoded['cognito:username'])

def get_authorized_username(current_request):
    return current_request.context['authorizer']['principalId']


def make_response(status, msg, code):
    response = {}
    response['status'] = status
    response['message'] = msg
    response['code'] = code
    return response

dynamodb = boto3.resource('dynamodb')
userdetails_table = dynamodb.Table('UserDetail')

@app.route('/')
def index():
    return {'hello': 'world'}

@app.route('/userdetails', methods=['GET','POST'], cors=cors_config, authorizer=jwt_auth)
def userdetail():
    userid = get_authorized_username(app.current_request)
    request = app.current_request
    response = {}
    
    if request.method == 'GET':
        try:
            user_res = userdetails_table.get_item(Key = {'UserID':str(userid)})
            response = make_response('success', user_res ,200)
        except Exception as e:
            response = make_response('failure', e.message ,200)
    if request.method == 'POST':
        user_json = app.current_request.json_body

    return Response(response)

@app.route('/register', methods=['POST'], cors=cors_config)
def register():
    user_as_json = app.current_request.json_body
    name = user_as_json.get('name', '')
    phone_number = user_as_json.get('phone_number', '')
    email = user_as_json.get('email', '')
    user_id = user_as_json.get('user_id', '')
    created_date = str(datetime.now())
    try:
        user_data = { 
        'created_date': created_date,
        'Name': name,
        'Email': email,
        'PhoneNumber': phone_number,
        'UserID': user_id,
        'online_status': False
        }
        res = userdetails_table.put_item(Item=user_data)
        response = make_response('success', "successfully registered" ,200)
    except Exception as e:
        response = make_response('failure', e.message ,200)

    return Response(response)

