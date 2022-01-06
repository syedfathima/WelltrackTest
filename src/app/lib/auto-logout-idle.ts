import {  Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { StorageService } from './storage.service';
import { ModalService } from './modal.service';
import { UserService } from './user.service';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorPopup } from '../components/alerts/error-popup/error-popup';
const SECONDS_UNTIL_AUTO_LOGOUT = 1200 // in seconds
const CHECK_INTERVAL = 600 // in seconds

@Injectable()
export class AutoLogoutIdle {

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  userData:any;
  idleTimeCountDown = new Subject();
  countDownSource = this.idleTimeCountDown.asObservable();
	dialogRef: any;
  constructor(private idle: Idle, private keepalive: Keepalive,
	private auth: AuthService,
        private router: Router,
        private log: LogService,
        private storage: StorageService,
        private modalService: ModalService,
        private userService: UserService,
        private translate: TranslateService,
		public dialog: MatDialog) {
		this.userData = this.storage.get('user', true);
    
  }

  initialize(){

    // sets an idle timeout of 20 min
		this.idle.setIdle(SECONDS_UNTIL_AUTO_LOGOUT);
		// sets a timeout period of 10 mins. after 20 minutes of inactivity, the user will be considered timed out.
		this.idle.setTimeout(CHECK_INTERVAL);
		// sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
		this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
	
		this.idle.onIdleEnd.subscribe(() =>{
			this.modalService.closeAll();
			
		});
		this.idle.onTimeout.subscribe(() => {
			if(this.auth.isAuthenticated()) {
				this.idle.watch();
				this.modalService.closeAll();
				this.auth.logout();
				this.router.navigate(['/']);
			}
		});

		/**
		 * Idle start
		 */
		this.idle.onIdleStart.subscribe(() => {
			this.userData = this.storage.get('user', true);
			if(this.auth.isAuthenticated()) {
				const dialogConfig = new MatDialogConfig();
				dialogConfig.disableClose = true;
				//translate this 
				const message = `You will be logged out in  ${CHECK_INTERVAL}  seconds!`;
				const title = 'You have been inactive for a while'
				dialogConfig.data = { title,message};
				const dialogRef = this.dialog.open(ErrorPopup, dialogConfig);
				dialogRef.afterClosed().subscribe(result => {
				  
				  });
				  this.dialogRef = dialogRef;
				  return dialogRef.afterClosed();
			
	      } else {
			  this.reset();
		  }
        });


		// Idle Warning
		this.idle.onTimeoutWarning.subscribe(
		  (countdown) =>{  
			if(this.auth.isAuthenticated()) {
				this.dialogRef.componentInstance.message ='You will be logged out in '+(countdown) +' seconds!';
			}
			});
	   
	
		// sets the ping interval to 15 seconds
	 	this.keepalive.interval(15);
	
		this.keepalive.onPing.subscribe(() => (this.lastPing = new Date()));
	
		this.reset();
  }

  reset(){  
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
	this.modalService.closeAll();
  }

  


}