import {Injectable} from "@angular/core";
import {Callback, CognitoUtil} from "./cognito.service";
import * as AWS from "aws-sdk/global";

@Injectable({
  providedIn: 'root'
})
export class AwsUtil {
  public static firstLogin: boolean = false;
  public static runningInit: boolean = false;

  constructor(public cognitoUtil: CognitoUtil) {
      AWS.config.region = CognitoUtil._REGION;
  }


  initAwsService(callback: Callback, isLoggedIn: boolean, idToken: string) {

      if (AwsUtil.runningInit) {
          console.log("AwsUtil: Aborting running initAwsService()...it's running already.");
          if (callback != null) {
              callback.callback();
              callback.callbackWithParam(null);
          }
          return;
      }


      console.log("AwsUtil: Running initAwsService()");
      AwsUtil.runningInit = true;


      let mythis = this;
      if (isLoggedIn)
          mythis.setupAWS(isLoggedIn, callback, idToken);

  }


  /**
   * Sets up the AWS global params
   *
   * @param isLoggedIn
   * @param callback
   */
  setupAWS(isLoggedIn: boolean, callback: Callback, idToken: string): void {
      console.log("AwsUtil: in setupAWS()");
      if (isLoggedIn) {
          console.log("AwsUtil: User is logged in");
          this.addCognitoCredentials(idToken);

          console.log("AwsUtil: Retrieving the id token");

      }
      else {
          console.log("AwsUtil: User is not logged in");
      }

      if (callback != null) {
          callback.callback();
          callback.callbackWithParam(null);
      }

      AwsUtil.runningInit = false;
  }

  addCognitoCredentials(idTokenJwt: string): void {
      let creds = this.cognitoUtil.buildCognitoCreds(idTokenJwt);

      AWS.config.credentials = creds;

      creds.get(function (err) {
          if (!err) {
              if (AwsUtil.firstLogin) {
                  // save the login info to DDB
                  this.ddb.writeLogEntry("login");
                  AwsUtil.firstLogin = false;
              }
          }
      });
  }

  static getCognitoParametersForIdConsolidation(idTokenJwt: string): {} {
      console.log("AwsUtil: enter getCognitoParametersForIdConsolidation()");
      let url = 'cognito-idp.' + CognitoUtil._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID;
      let logins: Array<string> = [];
      logins[url] = idTokenJwt;
      let params = {
          IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID, /* required */
          Logins: logins
      };

      return params;
  }

}
