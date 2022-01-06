import { Injectable, Inject } from '@angular/core';
import { StorageService } from './storage.service';

import { config } from '../../environments/all';
import { environment } from '../../environments/environment';

import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

declare var window;

@Injectable()
export class LogService {

	public logLevels = {
		trace: 0,
		debug: 1,
		warn: 2,
		critical: 3
	}

	constructor(private storage: StorageService, private angulartics2: Angulartics2GoogleAnalytics) {

	}

	private stringify(msg: any) {
		if (!msg) {
			return '';
		}

		if (typeof msg !== 'string') {
			msg = JSON.stringify(msg, null, 2);
		}

		return msg;
	}

	screen(screenName) {
		this.angulartics2.pageTrack(screenName);

	}

	user(userId: string) {

		this.angulartics2.setUsername(userId);

	}

	trace(msg: any, payload?: any) {
		if (payload) {
			msg += '\n' + this.stringify(payload);
		}

		if (environment.logLevel <= this.logLevels.trace) {
			console.log(this.stringify(msg));
		}
	}

	debug(msg: any, payload?: any) {

		if (payload) {
			msg += '\n' + this.stringify(payload);
		}

		if (environment.logLevel <= this.logLevels.debug) {
			console.log(this.stringify(msg));
		}
	}

	warn(msg: any, payload?: any) {
		if (payload) {
			msg += '\n' + this.stringify(payload);
		}

		if (environment.logLevel <= this.logLevels.warn) {
			console.log(this.stringify(msg));
		}
	}

	critical(msg: any, payload?: any) {
		if (payload) {
			msg += '\n' + this.stringify(payload);
		}

		if (environment.logLevel <= this.logLevels.critical) {
			console.error(this.stringify(msg));
		}
	}

	error(msg: string) {
		this.critical(msg);
		this.angulartics2.eventTrack(msg, { category: 'Error' })

	}

	event(eventName: string, category?: string, data?: any) {
		this.debug('EVENT: ' + eventName, data);
		data = data || {};
		category = category || 'Event';
		this.angulartics2.eventTrack(eventName, { category: category, label: JSON.stringify(data) });

	}
}
