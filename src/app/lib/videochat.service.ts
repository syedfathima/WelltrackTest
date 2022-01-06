import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as OT from '@opentok/client';

@Injectable()
export class VideoChatService {

  session: OT.Session;
  token: string;

  constructor() { }

  getOT() {
    return OT;
  }

  initSession(sessionId) {
    this.session = this.getOT().initSession(environment.video.api_key, sessionId);
    return Promise.resolve(this.session);
  }

  getSession(){
    return this.session;
  }

  connect(token) {
    this.token = token;
    return new Promise((resolve, reject) => {
      this.session.connect(this.token, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.session);
        }
      })
    });
  }
}