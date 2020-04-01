import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { CognitoCallback, CognitoUtil, LoggedInCallback } from "./cognito.service";
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import * as STS from "aws-sdk/clients/sts";
import { UsermanageService } from './usermanage.service';
export * from 'aws-sdk/global'
@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
    data: any;

    constructor(public cognitoUtil: CognitoUtil, private userdetails: UsermanageService) {
    }

  private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession) => {

      console.log("In authenticateUser onSuccess callback");
      const usertoken = session.getIdToken().getJwtToken();
      localStorage.setItem('user_token', usertoken);
      const accesstoken = session.getIdToken();
      localStorage.setItem('currentUser', JSON.stringify({ token: usertoken }));
      AWS.config.credentials = this.cognitoUtil.buildCognitoCreds(session.getIdToken().getJwtToken());
      let clientParams: any = {};
      if (environment.sts_endpoint) {
          clientParams.endpoint = environment.sts_endpoint;
      }
      let sts = new STS(clientParams);
      sts.getCallerIdentity(function (err, data) {
          console.log("UserLoginService: Successfully set the AWS credentials");
          callback.cognitoCallback(null, session);
      });
      this.userdetails.getuser_details()
      .subscribe(data => {
        if (data['status']== "success") {
        this.data = data['message']["Item"];
        console.log("data",this.data)
        localStorage.setItem('user_details', JSON.stringify({ details: this.data }));
        }
        else{
          alert(data['message'])
        }
        console.log(this.data);
      });

  }

  private onLoginError = (callback: CognitoCallback, err) => {
      callback.cognitoCallback(err.message, null);
  }


  authenticate(username: string, password: string, callback: CognitoCallback) {
      console.log("UserLoginService: starting the authentication");

      let authenticationData = {
          Username: username,
          Password: password,
      };
      let authenticationDetails = new AuthenticationDetails(authenticationData);

      let userData = {
          Username: username,
          Pool: this.cognitoUtil.getUserPool()
      };

      console.log("UserLoginService: Params set...Authenticating the user");
      let cognitoUser = new CognitoUser(userData);
      console.log("UserLoginService: config is " + AWS.config);
      cognitoUser.authenticateUser(authenticationDetails, {
          newPasswordRequired: (userAttributes, requiredAttributes) => callback.cognitoCallback(`User needs to set password.`, null),
          onSuccess: result => this.onLoginSuccess(callback, result),
          onFailure: err => this.onLoginError(callback, err),
          mfaRequired: (challengeName, challengeParameters) => {
              callback.handleMFAStep(challengeName, challengeParameters, (confirmationCode: string) => {
                  cognitoUser.sendMFACode(confirmationCode, {
                      onSuccess: result => this.onLoginSuccess(callback, result),
                      onFailure: err => this.onLoginError(callback, err)
                  });
              });
          }
      });
  }

  forgotPassword(username: string, callback: CognitoCallback) {
      let userData = {
          Username: username,
          Pool: this.cognitoUtil.getUserPool()
      };

      let cognitoUser = new CognitoUser(userData);

      cognitoUser.forgotPassword({
          onSuccess: function () {

          },
          onFailure: function (err) {
              callback.cognitoCallback(err.message, null);
          },
          inputVerificationCode() {
              callback.cognitoCallback(null, null);
          }
      });
  }

  confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
      let userData = {
          Username: email,
          Pool: this.cognitoUtil.getUserPool()
      };

      let cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmPassword(verificationCode, password, {
          onSuccess: function () {
              callback.cognitoCallback(null, null);
          },
          onFailure: function (err) {
              callback.cognitoCallback(err.message, null);
          }
      });
  }

  logout() {
      console.log("UserLoginService: Logging out");
      localStorage.removeItem('user_token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('user_details');
      this.cognitoUtil.getCurrentUser().signOut();
  }

  isAuthenticated(callback: LoggedInCallback) {
      if (callback == null)
          throw("UserLoginService: Callback in isAuthenticated() cannot be null");

      let cognitoUser = this.cognitoUtil.getCurrentUser();

      if (cognitoUser != null) {
          cognitoUser.getSession(function (err, session) {
              if (err) {
                  console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
                  callback.isLoggedIn(err, false);
              }
              else {
                  console.log("UserLoginService: Session is " + session.isValid());
                  callback.isLoggedIn(err, session.isValid());
              }
          });
      } else {
          console.log("UserLoginService: can't retrieve the current user");
          callback.isLoggedIn("Can't retrieve the CurrentUser", false);
      }
  }
}

