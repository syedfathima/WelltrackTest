import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject, Subject } from 'rxjs'
import { ModalService } from './modal.service';
import { StorageService } from './storage.service';
@Injectable()
export class MessagingService {
    currentMessage =  new Subject();
    fcmToken =  new Subject();
     constructor(private angularFireMessaging: AngularFireMessaging,
        private storage: StorageService,
        private modalService: ModalService) {
        this.angularFireMessaging.messages.subscribe(
            (_messaging: AngularFireMessaging) => {
                this.currentMessage.next(_messaging);
            }
          )
    
    }

    /**
     * Firebase request permission
     */
    requestPermission() {
        this.angularFireMessaging.requestPermission.subscribe(permission=>{
                this.angularFireMessaging.requestToken.subscribe(
                (token) => {
                    setTimeout(() => {
                        this.storage.set('fcmToken',token,true);
                        this.fcmToken.next(token);
                        this.receiveMessage();
                        
                    }, 1000);
                },
                (err) => {
                   this.modalService.showAlert('Error', 'Unable to get permission to notify' + err);
                }
            );
        })
       
    }

    /**
     * Firebase receive message
     */
    receiveMessage() {
        this.angularFireMessaging.messages.subscribe(
            (payload) => { 
                this.currentMessage.next(payload);
            })

            
    }

    /**
     * Firebase Logout
     */
     deleteFcmToken() {
        const token:any = this.storage.get('fcmToken');
        this.angularFireMessaging.deleteToken(token).subscribe(
            (payload) => { 
                
            })


            
    }
}


