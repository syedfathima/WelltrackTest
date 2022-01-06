import { Component, OnInit, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { Moodcheck } from '../../models/moodcheck';
import { Activity } from '../../models/activity';
import { UserService } from '../../lib/user.service';
import { ModalService } from '../../lib/modal.service';
import { FunAchievement } from '../../models/fun-achievement';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

@Component({
	selector: 'fun-achievement-listing',
	templateUrl: './fun-achievement-listing.component.html',
	styleUrls: ['./fun-achievement-listing.component.scss']
})
export class FunAchievementListingComponent implements OnInit {

	funachievements: Array<FunAchievement> = [];
	isLoaded: boolean;
	headerText: string;
	backText: string;
	currentUser: User;
	@Input() user: User;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private log: LogService,
		private userService: UserService,
		private translate: TranslateService,
		private modalService: ModalService
	) {
		this.isLoaded = false;
		this.currentUser = this.userService.getUser();
	}

	ngOnInit() {
		this.translate.stream('fa').subscribe((res: any) => {
			this.headerText = res.title;
			this.backText = res.back;
		});

		if (!this.user) {
			this.user = this.currentUser;
		}

		this.api.get('theory/funachievement/listing', { 'UserID': this.user.id }).subscribe(
			(result: any) => {
				this.funachievements = FunAchievement.initializeArray(result.data);
			},
			(error: any) => {
				this.log.error('Error getting F&As. ' + error.message);
				this.isLoaded = true;
			},
			() => {
				this.isLoaded = true;
			}
		);
	}

	loadMore() {


	}

	delete(id) {
		this.modalService.showConfirmation("Delete", "Are you sure you want to delete the fun and achievement entry?").afterClosed().subscribe(result => {
			if (result) {
				this.api.delete('practice/' + id).subscribe(
					(result: any) => {
						let index = _.findIndex(this.funachievements, { id: id });
						this.funachievements.splice(index, 1);
					},
					(error: any) => {
						this.log.error('Error deleting. ');
					}
				);
			}
		}
		);
	}

}
