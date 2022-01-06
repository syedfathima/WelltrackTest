import { Component, OnInit, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';

import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { User } from '../../../models/user';
import { Message } from '../../../models/message';
import { UserService } from '../../../lib/user.service';
import { LogService } from '../../../lib/log.service';
import { Router } from '@angular/router';
import { Observable ,  Subscription } from 'rxjs';

@Component({
	selector: 'messaging-listing',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './messaging-listing.component.html',
	styleUrls: ['./messaging-listing.scss']
})

export class MessagingListingComponent implements OnInit {
	intervalSubscription: Subscription;
	@Input() headerText: string;
	@Input() user: User;
	@Input() active: boolean;
	messages: Message[];
	isLoaded: boolean = false;

	tabs: any;
	message: string;
	showUserListing: boolean = false;
	pollingData: any;
	interval: number = 10000;
	maxDate: any;
	view: string = 'listing';
	users: User[];
	recipient_id: number;
	creator_id: number;
	simpleObservable = new Observable((observer) => { });
	badgeCount: number;
	toggleClass = '';

	constructor(
		private api: ApiService,
		private userService: UserService,
		private log: LogService,
		private storage: StorageService,
		private router: Router) {

		this.tabs = { 'notifications': true, 'messages': true };
		this.router.events.subscribe(event => {
			if (event.constructor.name === 'NavigationStart') {
				this.active = false;
				this.goToTop();
			}
		});
	}

	ngOnInit() {
		this.load();
		this.intervalSubscription = Observable.interval(this.interval).subscribe(x => {
			this.load();
		});
		this.recipient_id = this.user.id;
	}

	sequenceSubscriber() {

	}

	ngOnDestroy() {
		this.intervalSubscription.unsubscribe();
	}

	load() {
		this.api.post('messages', { 'recipient_id': this.recipient_id, 'creator_id': this.creator_id, 'DateTime': this.maxDate }).subscribe(
			(result: any) => {
				if (!this.messages) {
					this.messages = Message.initializeArray(result.data);
				}
				else {
					let latestMessages = Message.initializeArray(result.data);
					for (let i = 0; i < latestMessages.length; i++) {
						let message = new Message(latestMessages[i]);
						this.messages.push(message);
					}
				}
				this.getCount();
				this.getLatestDate();
			},
			(error: any) => {
				this.log.error('Error getting messages.' + error.message);
			},
			() => {
				this.isLoaded = true;
			}
		);
	}

	findCount() {

	}

	onToggle() {
		this.active = !this.active;
		if (this.active) {
			this.toggleClass = 'toggle-open';
			this.goToBottom();
		} else {
			this.toggleClass = '';
			this.goToTop();
		}
	}

	onClose() {
		this.active = false;
	}

	onToggleListing() {
		this.showUserListing = !this.showUserListing;
	}

	onMessageSend() {
		if (!this.message) {
			return;
		}
		this.api.post('messages/create', { sender_id: 1000, creator_id: this.creator_id, content: this.message }).subscribe(
			(data: any) => {
				this.messages.push(data);
				this.getCount();
			},
			(error: any) => {

			}
		);
	}

	toggleTab(tab) {
		this.tabs[tab] = !this.tabs[tab];
	}

	selectUser() {
		this.showUserListing = false;
	}

	getLatestDate() {
		var maxItem = _.maxBy(this.messages, function (el) {
			return new Date(el.created).getTime();
		});
		this.maxDate = maxItem.created;

	}

	filterMessages() {

	}

	onChangeListing(event) {

		this.view = 'details';
		this.recipient_id = event.recipient_id;
		this.creator_id = event.creator_id;
		this.api.post('messages', { recipient_id: this.recipient_id, creator_id: this.creator_id }).subscribe(
			(result: any) => {
				this.messages = Message.initializeArray(result.data);
				this.getLatestDate();
				this.getCount();

			},
			(error: any) => {
				this.log.error('Error getting messages.' + error.message);
			},
			() => {
				this.isLoaded = true;
			}
		);
	}

	backToListing() {
		this.view = 'listing';
		this.maxDate = null;
		this.recipient_id = this.user.id;
		this.creator_id = null;
		this.messages = null;
		this.load();
		this.goToBottom();
	}

	getCount() {
		this.badgeCount = this.messages.length;
	}

	goToBottom() {
		let height = 0;
		jQuery('.message').each(function (i, value) {
			height += jQuery(this).height();
		});
		jQuery('#messaging-listing .inner').animate({ scrollTop: height }, 500);

	}

	goToTop() {
		jQuery('#messaging-listing .inner').animate({ scrollTop: 0 }, 0);
	}

}
