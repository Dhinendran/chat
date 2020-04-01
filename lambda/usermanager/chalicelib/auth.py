from __future__ import print_function
from jwt.algorithms import RSAAlgorithm
import jwt
import json
import urllib
import boto3
from jwt.exceptions import ExpiredSignatureError
from datetime import datetime


region = 'us-east-1'
userpoolId = 'us-east-1_LZE06f2kC'
appClientId = '2s539gl9fksa6ll3pm39qqobim'
keysUrl = 'https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json'.format(region, userpoolId)

IDENTITY_POOL_ID = 'us-east-1:77aaab07-11f0-45ca-adad-f99bdec6a681'
websiteurl = 'http://localhost:4200/'
date = str(datetime.now())


class SignatureException(Exception):
    pass

def decode_jwt_token(token):
    bearerToken = token
    # response = urllib.urlopen(keysUrl)
    response = urllib.request.urlopen(keysUrl)
    keys = json.loads(response.read())['keys']

    jwtToken = bearerToken.split(' ')[-1]
    header = jwt.get_unverified_header(jwtToken)
    kid = header['kid']

    jwkValue = findJwkValue(keys, kid)
    publicKey = RSAAlgorithm.from_jwk(json.dumps(jwkValue))

    decoded = decodeJwtToken(jwtToken, publicKey)
    # print('Decoded token: ' + json.dumps(decoded))
    # principalId = decoded['cognito:username']
    return decoded

def findJwkValue(keys, kid):
    for key in keys:
        if key['kid'] == kid:
            return key

def decodeJwtToken(token, publicKey):
    try:
        try:
            decoded=jwt.decode(token, publicKey, algorithms=['RS256'], audience=appClientId)
            return decoded
        except:
            # decoded=jwt.decode(token, publicKey, algorithms=['RS256'], audience=appClientId1)
            return decoded
    except ExpiredSignatureError as e:
        raise SignatureException