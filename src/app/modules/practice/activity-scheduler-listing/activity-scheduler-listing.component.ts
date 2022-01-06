import { Component, OnInit, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { LogService } from '../../../lib/log.service';
import { User } from '../../../models/user';
import { UserService } from '../../../lib/user.service';
import { ActivityScheduler } from '../../../models/activity-scheduler'
import { TranslateService } from '@ngx-translate/core';
import { config } from '../../../../environments/all';
import { ModalService } from 'app/lib/modal.service';
import { SchedulerModal } from 'app/components/scheduler-modal/scheduler-modal.component';

import * as _ from 'lodash';

@Component({
	selector: 'app-activity-scheduler-listing',
	templateUrl: './activity-scheduler-listing.component.html',
	styleUrls: ['./activity-scheduler-listing.component.scss']
})
export class ActivitySchedulerListingPage implements OnInit {

	isLoaded: boolean;
	headerText: string;
	backText: string;
	activityschedules: ActivityScheduler[];
	activities1: any[];
	activities2: any[];
	activities3: any[];
	activities4: any[];
	activities1_arr: any[] = [];
	activities2_arr: any[] = [];
	activities3_arr: any[] = [];
	activities4_arr: any[] = [];

	loaded1 = false;
	loaded2 = false;
	loaded3 = false;
	isFrench = false;
	@Input() user: User;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private log: LogService,
		private userService: UserService,
		private translate: TranslateService,
		private modalService: ModalService,
		private router: Router
	) {
		this.isLoaded = false;
		this.user = this.userService.getUser();
	}

	ngOnInit() {
		this.translate.stream('as').subscribe((res: any) => {
			this.headerText = res.title;
			this.backText = res.back;
		});
		this.refresh();
	}

	refresh() {
		this.isLoaded = false;
		this.api.get('practice/activityscheduler/listing', { 'UserID': this.user.id }).subscribe(
			(result: any) => {
				this.activityschedules = ActivityScheduler.initializeArray(result.data);
			},
			(error: any) => {
				this.log.error('Error getting activity schedule. ' + error.message);
				this.isLoaded = true;
			},
			() => {
				this.isLoaded = true;
			}
		);

	}

	loadMore() {


	}

	openAS() {
		this.modalService.showComponent(SchedulerModal, {}).afterClosed().subscribe(result => {
			this.refresh();
		});
	}

	navigate(id: number) {
		this.router.navigateByUrl('/app/practice/activityscheduler/' + id);
	}

	delete(id) {
		this.modalService.showConfirmation("Delete", "Are you sure you want to delete your activity scheduled entry?").afterClosed().subscribe(result => {
			if (result) {
				this.api.delete('practice/' + id).subscribe(
					(result: any) => {
						let index = _.findIndex(this.activityschedules, { id: id });
						this.activityschedules.splice(index, 1);
					},
					(error: any) => {
						this.log.error('Error deleting. ');
					}
				);
			}
		});
	}

}
