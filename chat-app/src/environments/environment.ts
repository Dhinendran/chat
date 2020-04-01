export const environment = {
  production: false,

  region: 'us-east-1',

  identityPoolId: 'us-east-1:77aaab07-11f0-45ca-adad-f99bdec6a681',
  userPoolId: 'us-east-1_LZE06f2kC',
  clientId: '2s539gl9fksa6ll3pm39qqobim',

  rekognitionBucket: 'rekognition-pics',
  albumName: "usercontent",
  bucketRegion: 'us-east-1',

  ddbTableName: 'Userdetails',

  cognito_idp_endpoint: '',
  cognito_identity_endpoint: '',
  sts_endpoint: '',
  dynamodb_endpoint: '',
  s3_endpoint: '',
  // api_endpoint:'http://127.0.0.1:8000'
  api_endpoint:'https://9m53peb1ij.execute-api.us-east-1.amazonaws.com/api'

};

