import { LocalStorageService } from 'angular-2-local-storage';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { UtilityService } from './utility.service';
import { environment } from '../../environments/environment';


@Injectable()
export class StorageService {
	constructor(
		private cookie: CookieService,
		private storage: LocalStorageService,
		private utility: UtilityService
	) {

	}


	get(key: string, useLocal?: boolean) {
		useLocal = useLocal || false;
		if (useLocal) {
			return this.storage.get(key);
		} else {
			return this.cookie.getObject(key);
		}
	}

	set(key: string, value: any, useLocal?: boolean, minutesToExpire = 60 * 24 * 100) {
		useLocal = useLocal || false;
		if (useLocal) {
			return this.storage.set(key, value);
		} else {
			let expiry = new Date();
			expiry.setMinutes(expiry.getMinutes() + minutesToExpire);
			const subDomain = UtilityService.getSubdomain();

			if (subDomain && subDomain === 'canada') {
				//sso authorization is the only case where cookie values need to jump
				//between several subdomains.
				//This condition is specifically for that use case but will be expanded
				//with other integrations
				this.cookie.putObject(key, value, { secure: environment.production, expires: expiry, domain: '.' + environment.domain });
			}
			else {
				this.cookie.putObject(key, value, { secure: environment.production, expires: expiry });
			}
			return true;
		}
	}

	checkFlag(flag: string) {
		let flags = this.storage.get('flags') || {};

		return flags[flag];
	}


	setFlag(flag: string) {
		//get existing flags

		let flags = this.storage.get('flags') || {};
		flags[flag] = true;
		this.storage.set('flags', flags);

		return flags[flag];
	}

	checkReminder(reminder: string) {

		const reminderStr:string = this.storage.get(reminder) || null;
		const decodedFlag = JSON.parse(reminderStr);
		const now = new Date();
		if(decodedFlag){
			if(now.getTime() > decodedFlag.expiry){
				return false;
			}
		}
		this.storage.remove(reminder);
		return true;
	}

	setReminder(reminder: string, daysToExpire = 100) {

		const now = new Date()

		// `item` is an object which contains the original value
		// as well as the time when it's supposed to expire
		now.setDate(now.getDate() + daysToExpire);
		const item = {
			value: true,
			expiry: now.getTime(),
		}
		localStorage.setItem(reminder, JSON.stringify(item))
	}

	clearAllCookies() {
		this.cookie.removeAll();
		this.cookie.removeAll({ domain: '/' });
	}

	clearLogin() {
		this.storage.remove('user');
		this.storage.remove('isAuthenticated');
		this.storage.remove('accessToken');
		this.cookie.remove('isAuthenticated');
		this.cookie.remove('accessToken');
		this.cookie.remove('user');
	}

	resetFlags() {
		this.storage.remove('flags');
	}
}
