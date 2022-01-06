import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

import 'rxjs/Rx';
import { Subject } from 'rxjs';
//import { DeviceService } from './device.service';


@Injectable()
export class AuthService {

	Authenticator = new Subject();
	redirectUrl: string;

	constructor(
		private storage: StorageService
	) {

	}

	authenticate(accessToken, minutes = 60 * 24) {
		this.storage.set('accessToken', accessToken);
		/* expires in ten minutes */
		this.storage.set('isAuthenticated', true, false, minutes);
		this.Authenticator.next(true);
	}

	checkAuthetication() {
		this.Authenticator.next(true);
	}

	logout() {
		//this.deviceService.deregister();
		this.storage.clearLogin();
		this.Authenticator.next(false);
	}

	isAuthenticated(): boolean {
		return this.storage.get('isAuthenticated') ? true : false;
	}
}
