import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {WebsocketService} from "../services/websocket.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [WebsocketService]
})
export class RegisterComponent{
  mesCom = '';
  data = '';
  mes = '';
  status = '';
  user = '';
  pass = '';
  repass = '';
  constructor(private WebsocketService: WebsocketService, private router: Router) {
    // @ts-ignore
    WebsocketService.regis.subscribe(msg => {
      // @ts-ignore
      this.mes = WebsocketService.regisdata.mes;
      console.log(WebsocketService.regisdata);
      console.log(WebsocketService.regisdata.status);
      if(WebsocketService.regisdata.status === "success"){
        this.mesCom =  WebsocketService.regisdata.data;
      }
    });
  }

  sendMsg() {
    if(this.pass === this.repass){
      let msg = {
        action: 'onchat',
        data: {
          event: "REGISTER",
          data: {
            user: this.user,
            pass: this.pass
          }
        }
      };
      // @ts-ignore
      this.WebsocketService.regis.next(msg);
    } else {
      this.mes = "ReEnterPassword different Password";
    }
  }
}
