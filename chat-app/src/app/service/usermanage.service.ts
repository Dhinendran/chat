import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsermanageService {
  private reg_url = environment.api_endpoint + '/register';
  private userdetails_url = environment.api_endpoint + '/userdetails';

  constructor(protected http:HttpClient) { }

  RegistrationUser(user): Observable<any> {
    const data = {name: user.name, phone_number: user.phone_number, 
                    email: user.email, user_id: user.user_id};
    const userdata = JSON.stringify(data);
    return this.http.post(this.reg_url, userdata, { headers: { 'Content-Type': 'application/json' } })
  }
  getuser_details() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    return this.http.get(this.userdetails_url, {headers: {'Content-Type': 'application/json',
    'Authorization': token}});
  }
}
