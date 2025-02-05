import {Component} from "@angular/core";
import {CognitoCallback} from "../../../service/cognito.service";
import {Router} from "@angular/router";
import { UserRegistrationService } from 'src/app/service/user-registration.service';

@Component({
  selector: 'app-resend',
  templateUrl: './resend.component.html',
  styleUrls: ['./resend.component.css']
})
export class ResendCodeComponent implements CognitoCallback {

  email: string;
  errorMessage: string;

  constructor(public registrationService: UserRegistrationService, public router: Router) {

  }

  resendCode() {
      this.registrationService.resendCode(this.email, this);
  }

  cognitoCallback(error: any, result: any) {
      if (error != null) {
          this.errorMessage = "Something went wrong...please try again";
      } else {
          this.router.navigate(['/home/confirmRegistration', this.email]);
      }
  }
}