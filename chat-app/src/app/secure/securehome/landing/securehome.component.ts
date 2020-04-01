import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import { UserLoginService } from 'src/app/service/user-login.service';
import { LoggedInCallback } from 'src/app/service/cognito.service';


@Component({
  selector: 'app-securehome',
  templateUrl: './securehome.component.html',
  styleUrls: ['./securehome.component.css']
})
export class SecurehomeComponent implements OnInit, LoggedInCallback {

  constructor(public router: Router, public userService: UserLoginService) {
      this.userService.isAuthenticated(this);
      console.log("SecureHomeComponent: constructor");
  }

  ngOnInit() {

  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
      if (!isLoggedIn) {
          this.router.navigate(['/home/login']);
      }
  }

}

