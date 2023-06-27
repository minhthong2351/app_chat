import { Component, OnInit } from '@angular/core';
import {Message, WebsocketService} from "../services/websocket.service";
import {Subject} from "rxjs";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
const CHAT_URL = "ws://140.238.54.136:8080/chat/chat";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [WebsocketService]
})
export class LoginComponent {
  mes = '';
  status = '';
  user = '';
  pass = '';
  constructor(private WebsocketService: WebsocketService, private router: Router) {
    // @ts-ignore
    WebsocketService.login.subscribe(msg => {
      // @ts-ignore
      this.mes = WebsocketService.logindata.mes;
      console.log(WebsocketService.logindata);
      console.log(WebsocketService.logindata.status);
      console.log(WebsocketService.listUser.data);
      if(WebsocketService.logindata.status == "success"){
        this.router.navigate(['/chat']);
        // @ts-ignore
        sessionStorage.setItem("user",this.user);
        sessionStorage.setItem("pass",this.pass);
      }
    });
  }

  sendMsg() {
    let msg = {
      action: 'onchat',
      data: {
        event: "LOGIN",
        data: {
          user: this.user,
          pass: this.pass
        }
      }
    };
    this.WebsocketService.login.next(msg);
  }
}
