import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Chart, ChartData, ChartConfiguration } from 'chart.js';

import * as jQuery from 'jquery';
import * as _ from 'lodash';

import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { User } from '../../../models/user';
import { Message } from '../../../models/message';
import { UserService } from '../../../lib/user.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { MoodcheckModalComponent } from '../../../components/moodcheck-modal/moodcheck-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
	selector: 'message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

	@Input() message: Message;
	@Input() user: User;
	@Input() threadLink: boolean;
	@Output() threadLoad = new EventEmitter<object>();

	constructor(
		private api: ApiService,
		private userService: UserService,
		private modalService: ModalService,
		private log: LogService,
		private storage: StorageService) {

	}

	ngOnInit() {


	}

	ngOnDestroy() {

	}


	onClick() {
		this.threadLoad.emit({ recipient_id: this.message.recipient.id, creator_id: this.message.creator.id });
	}

	displayMoodcheck(){
		this.modalService.showComponent(MoodcheckModalComponent, {});
	}

}
