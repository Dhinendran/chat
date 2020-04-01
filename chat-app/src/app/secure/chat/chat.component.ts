import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/service/chat.service';

export interface Message {
	From_mail: string;
	message: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  message: any;
  users:any;
  selectedmail:any;
  send_data:any;
  messages: Message[] = [];
  selectedname: any;
  Email:any;
  name:any;
  user_msg ={};

  constructor(private chatService: ChatService) {
    const user_details = JSON.parse(localStorage.getItem('user_details'));
    console.log("user",user_details)
    this.Email =user_details['details']['Email']
    this.name = user_details['details']['Name']
    this.user_list()
   }
  sendMessage() {
    this.send_data = {
      'message':this.message,
      'mail': this.selectedmail
    }
    this.chatService.sendMessage(this.send_data);
    this.message = '';
  }
  ngOnInit() {
    this.new_msg()
  }

  user_list(){
    this.chatService
      .getconnected_user()
      .subscribe((data: any) => {
        console.log("users",data)
        for (var i =0; i < data.length; i++)
        if (data[i].email === this.Email) {
            data.splice(i,1);
            break;
        }
        this.users = data
      });
  }

  new_msg() {
    this.chatService
      .getMessages()
      .subscribe((data: any) => {
        this.messages.push(data);
      });
  }

  selectedUser(user): void {
    this.selectedname =- user.name;
    this.selectedmail = user.email;
    console.log(this.selectedmail)
	}
}
