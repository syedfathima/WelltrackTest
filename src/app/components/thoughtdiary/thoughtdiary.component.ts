import { Component, OnInit, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { ModalService } from '../../lib/modal.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { Moodcheck } from '../../models/moodcheck';
import { Activity } from '../../models/activity';
import { UserService } from '../../lib/user.service';
import { ThoughtDiary } from '../../models/thought-diary';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

@Component({
	selector: 'thought-diary-listing',
	templateUrl: 'thoughtdiary.component.html',
	styleUrls: ['./thoughtdiary.component.scss'],
})
export class ThoughtDiaryListingComponent implements OnInit {
	diaries: Array<ThoughtDiary> = [];
	isLoaded: boolean;
	backLink: string;
	title: string;
	back: string;
	currentUser: User; 
	@Input() user: User;
	@Input() showIncomplete: boolean = true;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private log: LogService,
		private userService: UserService,
		private modalService: ModalService,
		private translate: TranslateService
	) {
		this.currentUser = this.userService.getUser();
		this.isLoaded = false;
		this.backLink = '/app/practice';
		this.translate.stream('thoughtDiary').subscribe((res: any) => {
			this.title = res.title;
			this.back = res.back;
		});
	}

	ngOnInit() {

		this.refreshContent();
	}

	refreshContent() {
		if (!this.user) {
			this.user = this.currentUser;
		}

		this.api.get('theory/thoughtdiary/listing', { 'UserID': this.user.id }).subscribe(
			(result: any) => {
				this.diaries = ThoughtDiary.initializeArray(result.data);
			},
			(error: any) => {
				this.log.error('Error getting thought diaries. ' + error.message);
				this.isLoaded = true;
			},
			() => {
				this.isLoaded = true;
			}
		);
	}

	delete(id) {
		this.modalService.showConfirmation("Delete", "Are you sure you want to delete your thought diary entry?").afterClosed().subscribe(result => {
			if (result) {
				this.api.delete('practice/' + id).subscribe(
					(result: any) => {
						let index = _.findIndex(this.diaries, { id: id });
						this.diaries.splice(index, 1);
					},
					(error: any) => {
						this.log.error('Error deleting. ');
					}
				);
			}
		});
	}

}
