import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { User } from '../models/user';
import { ApiService } from '../lib/api.service';

import 'rxjs/Rx';
import { Subject } from 'rxjs';

@Injectable()
export class UserService {

	watcher = new Subject();

	constructor(
		private storage: StorageService,
		private api: ApiService
	) {

	}

	reloadUser() {
		this.api.get('users/me').subscribe(
			(result: any) => {
				let newuser = new User(result.data);
				this.storage.set('user', newuser, true);
				this.watcher.next(newuser);
				return newuser;
			},
		);
	}

	getUser(): User {
		let storedUser = this.storage.get('user', true);
		if(storedUser){
			let user = new User(storedUser);
			return user;
		}
		else{
			return null; 
		}
	}

	setUser(user: User) {
		//update first and last name
		if (user.fullName) {
			let name = user.fullName.split(/\s+/);
			user.firstName = name.slice(0, -1).join(' ');
			user.lastName = name.pop();
		}
		this.storage.set('user', null); //invalidate cookie user
		this.storage.set('user', user, true);
		this.watcher.next(user);
		return;
	}
}
