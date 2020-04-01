import {Component} from "@angular/core";
import {Router} from "@angular/router";
import { UserRegistrationService } from 'src/app/service/user-registration.service';
import {CognitoCallback} from "../../../service/cognito.service";
import { ChatService } from 'src/app/service/chat.service';
import { UsermanageService } from 'src/app/service/usermanage.service';

export class RegistrationUser {
    name: string;
    email: string;
    phone_number: string;
    password: string;
    user_id: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class  RegisterComponent implements CognitoCallback {
  registrationUser: RegistrationUser;
  router: Router;
  errorMessage: string;

  constructor(public userRegistration: UserRegistrationService, router: Router,
        public usermanage: UsermanageService) {
      this.router = router;
      this.onInit();
  }

  onInit() {
      this.registrationUser = new RegistrationUser();
      this.errorMessage = null;
  }

  onRegister() {
      this.errorMessage = null;
      this.userRegistration.register(this.registrationUser, this, this.usermanage);
  }

  cognitoCallback(message: string, result: any) {
      if (message != null) { //error
          this.errorMessage = message;
          console.log("result: " + this.errorMessage);
      } else { //success
          //move to the next step
          console.log("redirecting");
          this.router.navigate(['/home/confirmRegistration', result.user.username]);
      }
  }
}
