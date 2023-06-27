import {Injectable, OnDestroy} from "@angular/core";
import { Component, OnInit } from '@angular/core';
import {Message, WebsocketService} from "../services/websocket.service";
import {Router} from "@angular/router";
import {LoginComponent} from "../login/login.component";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [WebsocketService],
})
export class ChatComponent  implements OnInit{
  message='';
  messageSend='';
  userMess = '';
  suser = {
    name : '',
    actionTime : ''
  };
  mes = '';
  joinmes = '';
  searchMes = '';
  status = '';
  user = '';
  pass = '';
  roomName = '';
  roomJoin = '';
  searchName ='';
  listUser = [{
    name: '',
    type :'',
    actionTime:''
  }
  ];
  messageBox = [
      {
        id:'',
        mes: '',
        name: '',
        to :'',
        type:''
      }
  ];

  // @ts-ignore
  ShowDarkModel="";

  constructor(public WebsocketService: WebsocketService, private router: Router) {

  }
  ngOnInit(): void {
    // @ts-ignore
    this.user = sessionStorage.getItem('user');
    // @ts-ignore
    this.pass = sessionStorage.getItem('pass');
    if(this.user != null){
      setTimeout(() => {
        this.getListUser();
      },500)
    }
    if(this.user != null){
      setTimeout(() => {
        this.createBoxMess();
      },700)
    }
  }
  getListUser(){
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
    let msg1 = {
      action: "onchat",
      data: {
        event: "GET_USER_LIST"
      }
    };
    this.WebsocketService.getlist.next(msg);
    this.WebsocketService.getlist.next(msg1);
    this.WebsocketService.getlist.subscribe(msg => {
      // @ts-ignore
      this.listUser=this.WebsocketService.listUser.data
      console.log(this.WebsocketService.listUser.data);
      console.log(this.listUser);
    });
  }
  sendOut(){
    let msg2 = {
      action: "onchat",
      data: {
        event: "LOGOUT"
      }
    };
    this.WebsocketService.logout.next(msg2);
    this.WebsocketService.logout.subscribe(msg => {
      console.log(this.WebsocketService.logoutdata.status)
      // @ts-ignore
      if(this.WebsocketService.logoutdata.status == "success"){
        // @ts-ignore
        this.user =sessionStorage.removeItem('user');
        // @ts-ignore
        this.pass =sessionStorage.removeItem('pass');
        // @ts-ignore
        this.router.navigate(['/login']);
        //
        this.WebsocketService.disconnect();
        //
        console.log("disconnect server")
      }
    });
  }
  sendCreateRoom(){
    let msg3 = {
      action: "onchat",
      data: {
        event: "CREATE_ROOM",
        data: {
          name: this.roomName
        }
      }
    };
    this.WebsocketService.createRoom.next(msg3);
    this.WebsocketService.createRoom.subscribe(msg => {
      this.mes = this.WebsocketService.createRoomdata.mes;
      console.log(this.WebsocketService.createRoomdata.mes)
      if(this.WebsocketService.createRoomdata.status == "success"){
        this.mes = "Bạn đã tạo Room thành công !!!"
        this.getListUser();
      } else {
        this.mes = "Tạo Room thất bại !!!"
      }
    });
  }
  sendJoinRoom(){
    let msg6 = {
      action: "onchat",
      data: {
        event: "JOIN_ROOM",
        data: {
          name: this.roomJoin
        }
      }
    };
    this.WebsocketService.joinRoom.next(msg6);
    this.WebsocketService.joinRoom.subscribe(msg => {
      this.joinmes = this.WebsocketService.joinRoomdata.status;
      console.log(this.WebsocketService.joinRoomdata.status)
      if(this.WebsocketService.joinRoomdata.status == "success"){
        this.joinmes = "Bạn đã tham gia vào Room thành công !!!"
        this.getListUser();
      } else {
        this.joinmes = "Room không tồn tại hoặc bạn đã tham gia rồi !!!"
      }
    });
  }
  sendSearch(){
    let msg4 = {
      action: "onchat",
      data: {
        event: "CHECK_USER",
        data: {
          user: this.searchName
        }
      }
    };
    this.WebsocketService.search.next(msg4);
    this.WebsocketService.search.subscribe(msg => {
      console.log(this.WebsocketService.searchdata.data.status)
      // @ts-ignore
      if(this.WebsocketService.searchdata.data.status == true){
        for(let luser of this.listUser){
          if(luser.name == this.searchName){
            this.suser = luser;
            this.searchMes = '';
            console.log(this.suser)
          }
        }
      }else{
        this.searchMes = "Không tìm thấy"
      }
    });
  }
  getListMess(){
    // @ts-ignore
    let msg5 = {
      action: "onchat",
      data: {
        event: "GET_ROOM_CHAT_MES",
        data: {
          name: this.userMess,
          page:1
        }
      }
    };
    // this.WebsocketService.getListMess.next(msg5);
    // this.WebsocketService.getListMess.subscribe(msg => {
    //   console.log(this.WebsocketService.listMess)
    // });
  }
  close(){
    this.suser = {
      name : '',
      actionTime : ''
    }
  }
  createBoxMess(){
    // @ts-ignore
    this.user = sessionStorage.getItem('user');
    let message = {
      action: "onchat",
      data: {
        event: "SEND_CHAT",
        data: {
          type: "people",
          to: this.user,
          mes: 'start'
        }
      }
    };
    // @ts-ignore
    this.WebsocketService.messages.next(message);
    // @ts-ignore
    this.messageBox.push(message.data.data);
    this.WebsocketService.messages.subscribe(msg => {
      console.log(this.WebsocketService.messData)

      // @ts-ignore
      this.messageBox.push(this.WebsocketService.messData.data);
    });
    // @ts-ignore
    console.log(this.messageBox);
  }
  sendMsg(sendForm:NgForm) {
    // @ts-ignore
    this.user = sessionStorage.getItem('user');
    let message = {
      action: "onchat",
      data: {
        event: "SEND_CHAT",
        data: {
          type: "people",
          name:this.userMess,
          to: this.userMess,
          mes: this.messageSend
        }
      }
    };
    // @ts-ignore
    this.WebsocketService.messages.next(message);
    // @ts-ignore
    this.messageBox.push(message.data.data);
    this.WebsocketService.messages.subscribe(msg => {
      console.log(this.WebsocketService.messData)

      // @ts-ignore
      this.messageBox.push(this.WebsocketService.messData.data);
    });
    // @ts-ignore
    console.log(this.messageBox);
    sendForm.controls.messageSend.reset()
  }
}
