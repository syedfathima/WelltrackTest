import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as jQuery from 'jquery';
import * as _ from 'lodash';

import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { User } from '../../../models/user';
import {Message } from '../../../models/message';
import { UserService } from '../../../lib/user.service';
import { LogService } from '../../../lib/log.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'messaging-thread',
	templateUrl: './messaging-thread.component.html',
	styleUrls: ['./messaging-thread.component.scss']
})
export class MessagingThreadComponent implements OnInit {

	@Output() backToListing = new EventEmitter<any>();
	@Input() messages: Message[];
	@Input() user: User;
	message: string; 
	maxDate: string; 

	constructor(
		private api: ApiService,
		private userService: UserService,
		private log: LogService,
		private storage: StorageService) {
	}

	ngOnInit() {

	}

	onGoBack() {
		this.backToListing.emit();
	}

	onMessageSend() {
		if (!this.message) {
			return;
		}
		this.api.post('messages/create', { recipient_id: 46435, content: this.message }).subscribe(
			(data: any) => {
				this.messages.push(data);
			},
			(error: any) => {

			}
		);
	}

}
