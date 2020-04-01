import {Component, OnInit} from "@angular/core";

declare let AWS: any;
declare let AWSCognito: any;


@Component({
  selector: 'app-landing',
  templateUrl: './landinghome.html'
})
export class HomeLandingComponent {
  constructor() {
      console.log("HomeLandingComponent constructor");
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor() {
      console.log("HomeComponent constructor");
  }

  ngOnInit() {

  }
}


