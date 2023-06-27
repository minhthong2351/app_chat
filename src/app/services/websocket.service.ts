import { Injectable } from "@angular/core";
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


const CHAT_URL = "ws://140.238.54.136:8080/chat/chat";

export interface Message {
}

@Injectable({
  providedIn:'root'
})
export class WebsocketService {
  private subject: AnonymousSubject<MessageEvent> | undefined;
  public login: Subject<Message>;
  public regis: Subject<Message>;
  public getlist: Subject<Message>;
  public logout: Subject<Message>;
  public createRoom: Subject<Message>;
  public joinRoom: Subject<Message>;
  public sendMessage:Subject<Message>;
  public search:Subject<Message>;
  public getListMess:Subject<Message>;
  public messages: Subject<Message>;
  public chatMessageData = {
    mes: '',
    event : '',
    data: [{

    }]
  };
  public regisdata = {
    mes: '',
    status: '',
    data: ''
  };
  public logindata = {
    mes: '',
    status: '',
  };
  public listUser = {
    mes: '',
    event : '',
    status : '',
    data: [{

    }]
  }
  public logoutdata = {
    data: '',
    status: ''
  };
  public createRoomdata = {
    event: '',
    status: '',
    mes : '',
    data: {
      id: '',
      name: '',
      own: '',
      userList: [],
      chatData: []
    }
  };
  public joinRoomdata = {
    event: '',
    status: '',
    data: {
      id: '',
      name: '',
      own: '',
      userList: [],
      chatData: []
    }
  };
  public searchdata = {
    event: '',
    status: '',
    data:{
      status: ''
    }
  };
  public listMess = {
    event: "",
    status: "",
    data: {
      id: '',
      name: "",
      own: "",
      userList: [
        {
          id: '',
          name: ""
        }
      ],
      chatData: [
        {
          id: '',
          name: "",
          type: '',
          to: "",
          mes: "",
          createAt: ""
        }
      ]
    }
  };
  public messData = {
    event : '',
    status : '',
    data: [{
      id:'',
      name: '',
      type:'',
      to :'',
      mes: ''
    }]
  };
  constructor() {
    this.login = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          this.logindata = JSON.parse(response.data)
          return this.logindata;
        }
      )
    );
    this.regis = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          this.regisdata = JSON.parse(response.data)
          return this.regisdata;
        }
      )
    );
    this.getlist = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          this.listUser = JSON.parse(response.data)
          return this.listUser;
        }
      )
    );
    this.logout = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          this.logoutdata = JSON.parse(response.data)
          return this.logoutdata;
        }
      )
    );
    this.createRoom = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          this.createRoomdata = JSON.parse(response.data)
          return this.createRoomdata;
        }
      )
    );
    this.joinRoom = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          this.joinRoomdata = JSON.parse(response.data)
          return this.joinRoomdata;
        }
      )
    );
    this.search = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          this.searchdata = JSON.parse(response.data)
          return this.searchdata;
        }
      )
    );
    this.getListMess = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          this.listMess = JSON.parse(response.data)
          return this.listMess;
        }
      )
    );
    this.sendMessage = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          this.chatMessageData = JSON.parse(response.data)
          return this.chatMessageData;
        }
      )
    );
    this.messages = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          this.messData = JSON.parse(response.data)
          return this.messData;
        }
      )
    );

  }
  public connect(url: string): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }
  public create(url: string | URL): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      error: null,
      complete: null,
      next: (data: Object) => {
        console.log('Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    // @ts-ignore
    return new AnonymousSubject<MessageEvent>(observer,
      observable);
  }
  public disconnect(){
    let ws = new WebSocket(CHAT_URL);
    ws.close();
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
      console.log("disconnect server")
    }
  }
}
