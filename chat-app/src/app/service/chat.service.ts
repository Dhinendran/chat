import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private reg_url = environment.api_endpoint + '/register';

  private url = 'http://localhost:3000';
  private socket;
  constructor(protected http: HttpClient) {
    const user_details = JSON.parse(localStorage.getItem('user_details'));
    console.log("user",user_details)
    let Email =user_details['details']['Email']
    let name = user_details['details']['Name']
    this.socket = io(this.url,{ query: { userId: Email,
      Name: name}});
      
   }
   public sendMessage(message) {
  //   this.socket.emit(`message`, {
  //     message: 'hello',
  //     userId: "kefawok499@jetsmails.com"
  //  });
    this.socket.emit('new-message', message);
}

public getMessages = () => {
  return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
          observer.next(message);
      });
  });
}

public getconnected_user = () => {
  return Observable.create((observer) => {
      this.socket.on('connected', (message) => {
          console.log(message)
          observer.next(message);
      });
  });

}

}
