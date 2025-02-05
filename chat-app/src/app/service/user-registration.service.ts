import {Inject, Injectable} from "@angular/core";
import {CognitoCallback, CognitoUtil} from "./cognito.service";
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute} from "amazon-cognito-identity-js";
import {NewPasswordUser} from "../public/auth/newpassword/newpassword.component";
import * as AWS from "aws-sdk/global";
import { RegistrationUser } from '../public/auth/register/register.component';
import { ChatService } from './chat.service';
import { UsermanageService } from './usermanage.service';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  constructor(@Inject(CognitoUtil) public cognitoUtil: CognitoUtil) {

  }

  register(user: RegistrationUser, callback: CognitoCallback, usermanage:UsermanageService): void {
      console.log("UserRegistrationService: user is " + user);

      let attributeList = [];

      let dataEmail = {
          Name: 'email',
          Value: user.email
      };
      let dataNickname = {
          Name: 'name',
          Value: user.name
      };
      attributeList.push(new CognitoUserAttribute(dataEmail));
      attributeList.push(new CognitoUserAttribute(dataNickname));
      attributeList.push(new CognitoUserAttribute({
          Name: 'phone_number',
          Value: user.phone_number
      }));

      this.cognitoUtil.getUserPool().signUp(user.email, user.password, attributeList, null, function (err, result) {
          if (err) {
              callback.cognitoCallback(err.message, null);
          } else {
            const userID = result['userSub'];
            user.user_id = userID;
            usermanage.RegistrationUser(user).subscribe(
              data => {
                  if (data['status'] === 'success') {
                    callback.cognitoCallback(null, result);
              } else if (data['status'] === 'failure') {
                callback.cognitoCallback(data['message'], null);
              }
            }
          );
        }
      });

  }

  confirmRegistration(username: string, confirmationCode: string, callback: CognitoCallback): void {

      let userData = {
          Username: username,
          Pool: this.cognitoUtil.getUserPool()
      };

      let cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
          if (err) {
              callback.cognitoCallback(err.message, null);
          } else {
              callback.cognitoCallback(null, result);
          }
      });
  }

  resendCode(username: string, callback: CognitoCallback): void {
      let userData = {
          Username: username,
          Pool: this.cognitoUtil.getUserPool()
      };

      let cognitoUser = new CognitoUser(userData);

      cognitoUser.resendConfirmationCode(function (err, result) {
          if (err) {
              callback.cognitoCallback(err.message, null);
          } else {
              callback.cognitoCallback(null, result);
          }
      });
  }

  newPassword(newPasswordUser: NewPasswordUser, callback: CognitoCallback): void {
      console.log(newPasswordUser);
      // Get these details and call
      //cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
      let authenticationData = {
          Username: newPasswordUser.username,
          Password: newPasswordUser.existingPassword,
      };
      let authenticationDetails = new AuthenticationDetails(authenticationData);

      let userData = {
          Username: newPasswordUser.username,
          Pool: this.cognitoUtil.getUserPool()
      };

      console.log("UserLoginService: Params set...Authenticating the user");
      let cognitoUser = new CognitoUser(userData);
      console.log("UserLoginService: config is " + AWS.config);
      cognitoUser.authenticateUser(authenticationDetails, {
          newPasswordRequired: function (userAttributes, requiredAttributes) {
              // User was signed up by an admin and must provide new
              // password and required attributes, if any, to complete
              // authentication.

              // the api doesn't accept this field back
              delete userAttributes.email_verified;
              cognitoUser.completeNewPasswordChallenge(newPasswordUser.password, requiredAttributes, {
                  onSuccess: function (result) {
                      callback.cognitoCallback(null, userAttributes);
                  },
                  onFailure: function (err) {
                      callback.cognitoCallback(err, null);
                  }
              });
          },
          onSuccess: function (result) {
              callback.cognitoCallback(null, result);
          },
          onFailure: function (err) {
              callback.cognitoCallback(err, null);
          }
      });
  }
}
