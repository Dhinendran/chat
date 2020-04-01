import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProfileComponent } from './secure/profile/profile.component';
import { LogoutComponent, RegistrationConfirmationComponent } from './public/auth/confirmregistration/confirmregistration.component';
import { LoginComponent } from './public/auth/login/login.component';
import { MfaComponent } from './public/auth/mfa/mfa.component';
import { RegisterComponent } from './public/auth/register/register.component';
import { SecurehomeComponent } from './secure/securehome/landing/securehome.component';
import { NewPasswordComponent } from './public/auth/newpassword/newpassword.component';
import { UserParametersService } from './service/user-parameters.service';
import { UserLoginService } from './service/user-login.service';
import { UserRegistrationService } from './service/user-registration.service';
import { AwsUtil } from './service/aws.service';
import { CognitoUtil } from './service/cognito.service';
import { ResendCodeComponent } from './public/auth/resend/resend.component';
import { ForgotPasswordStep1Component, ForgotPassword2Component } from './public/auth/forgotpassword/forgotpassword.component';
import { HomeComponent, HomeLandingComponent } from './public/home/home.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app-routing.module';
import { ChatComponent } from './secure/chat/chat.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    SecurehomeComponent,
    ProfileComponent,
    LoginComponent,
    MfaComponent,
    NewPasswordComponent,
    RegisterComponent,
    HomeLandingComponent,
    HomeComponent,
    NewPasswordComponent,
    LogoutComponent,
    RegistrationConfirmationComponent,
    ResendCodeComponent,
    ForgotPasswordStep1Component,
    ForgotPassword2Component,
    RegisterComponent,
    ProfileComponent,
    AppComponent,
    HomeComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),

  ],
  providers: [
    CognitoUtil,
        AwsUtil,
        UserRegistrationService,
        UserLoginService,
        UserParametersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
