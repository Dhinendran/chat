import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {LoginComponent} from "./public/auth/login/login.component";
import {NewPasswordComponent} from "./public/auth/newpassword/newpassword.component";
import { SecurehomeComponent } from './secure/securehome/landing/securehome.component';
import { ProfileComponent } from './secure/profile/profile.component';
import { ResendCodeComponent } from './public/auth/resend/resend.component';
import { RegisterComponent } from './public/auth/register/register.component';
import { HomeComponent, HomeLandingComponent } from './public/home/home.component';
import { ForgotPasswordStep1Component, ForgotPassword2Component } from './public/auth/forgotpassword/forgotpassword.component';
import { RegistrationConfirmationComponent, LogoutComponent } from './public/auth/confirmregistration/confirmregistration.component';
import { ChatComponent } from './secure/chat/chat.component';

const homeRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {path: 'login', component: LoginComponent},
            {path: 'register', component: RegisterComponent},
            {path: 'confirmRegistration/:username', component: RegistrationConfirmationComponent},
            {path: 'resendCode', component: ResendCodeComponent},
            {path: 'forgotPassword/:email', component: ForgotPassword2Component},
            {path: 'forgotPassword', component: ForgotPasswordStep1Component},
            {path: 'newPassword', component: NewPasswordComponent},
            {path: '', component: HomeLandingComponent}
        ]
    },
];

const secureHomeRoutes: Routes = [
    {

        path: '',
        redirectTo: '/securehome',
        pathMatch: 'full'
    },
    {
        path: 'securehome', component: SecurehomeComponent, children: [
        {path: 'logout', component: LogoutComponent},
        {path: 'myprofile', component: ProfileComponent},
        {path:'chat', component:ChatComponent},
        {path: '', component: ProfileComponent}]
    }
];

export const appRoutes: Routes =[
    {
        path: '',
        children: [
            ...homeRoutes,
            ...secureHomeRoutes,
            {
                path: '',
                component: HomeComponent
            }
        ]
    },


];

