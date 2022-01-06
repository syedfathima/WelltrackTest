import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivityScheduler, ActivitySchedulerEvent } from '../../../../app/models/activity-scheduler'
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../../app/lib/api.service';
import { LogService } from '../../../../app/lib/log.service';
import { ModalService } from 'app/lib/modal.service';
import { StorageService } from 'app/lib/storage.service';
import { UtilityService } from 'app/lib/utility.service';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
declare var jQuery: any;

@Component({
	selector: 'activity-scheduler',
	templateUrl: './activity-scheduler-details.html',
	styleUrls: ['./activity-scheduler-details.scss'],
})
export class ActivitySchedulerDetails implements OnInit, AfterViewInit {
	@ViewChild('timeFormat') timeFormat;
	date: any;
	currentStep = 0;
	activityType = 0;
	activity = '';
	active: boolean[];
	start = '';
	end = '';
	startFormatted = '';
	endFormatted = '';
	months = '';
	id = 0;
	events: any[] = [];
	as: ActivityScheduler;
	errorPopups: any;
	successPopups: any;
	viewMode: string;
	isDisabled = false;
	isLoaded = false;
	first = true;
	last = false;
	isFrench = false;
	backLink: string;
	backText: string;
	title: string;

	constructor(
		private modalService: ModalService,
		private translate: TranslateService,
		private api: ApiService,
		private log: LogService,
		private renderer: Renderer2,
		private storage: StorageService,
		private utilityService: UtilityService,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {
		this.as = new ActivityScheduler();
	}

	ngOnInit() {
		this.backLink = '/app/practice/activityscheduler';
		this.active = [false, false, false];

		this.translate.stream('as').subscribe((res: any) => {
			this.months = res.month
			this.errorPopups = res.errorPopups;
			this.successPopups = res.successPopups;
			this.backText = res.back;
			this.title = res.title;
		});

		this.activatedRoute.params.subscribe(params => {
			this.id = params['id'];
			this.viewMode = 'create';
		});
	}

	ngAfterViewInit() {
		this.isLoaded = true;

	}

	formatTime() {
		this.startFormatted = moment.parseZone(this.start).format('DD MMM YYYY hh:mm a');
		this.end = moment.parseZone(this.start).add('30', 'minutes').format();
		this.as.start = new Date(this.start);
		this.as.end = new Date(this.end);
	}



	selectType(type: number) {
		if (this.viewMode !== 'readonly') {
			this.activityType = type;
			this.as.type = type;
			this.next();
		}
	}

	isType(type: number) {
		if (this.as.type === type) {
			return true;
		}
		else {
			return false;
		}
	}

	onSubmit() {
		if (!this.start) {
			this.modalService.showAlert(this.errorPopups.error, this.errorPopups.dateTime);
			return;
		}

		if (this.utilityService.demoMode()) {
			return;
		}

		let startDate = new Date(this.start);
		let endDate = new Date(this.end);

		this.as.start = startDate;
		this.as.end = endDate;
		let category = '';
		if (this.activityType === 1) {
			category = 'pleasurable'
		} else if (this.activityType === 2) {
			category = 'social'
		} else if (this.activityType === 3) {
			category = 'achievement'
		}

		this.as.status = 'complete';
		this.api.post('practice/activityscheduler2', this.as.forApi()).subscribe(
			(data: any) => {
				this.modalService.showAlert(this.successPopups.success, this.successPopups.body);
				this.goBack();
			},
			(error: any) => {
				this.modalService.showAlert(this.errorPopups.title, error.message);
			}
		);
	}

	goBack() {
		this.router.navigate(['app/practice/activityscheduler']);
	}


	activityChange(event) {
		if (this.viewMode !== 'readonly') {
			this.as.title = event.data.text;
			this.next();
		}
	}

	next() {
		if (this.currentStep === 2) {
			this.formatTime();
		}

		if (this.currentStep === 0 && !this.as.type) {
			this.modalService.showAlert(this.errorPopups.error, this.errorPopups.activityType);
			return;
		}
		if (!this.as.title && this.currentStep === 1) {
			this.modalService.showAlert(this.errorPopups.error, this.errorPopups.activity);
			return;
		}
		if (!this.as.start && this.currentStep === 2) {
			this.modalService.showAlert(this.errorPopups.error, this.errorPopups.dateTime);
			return;
		}
		this.currentStep++;
	}

	back() {
		this.currentStep--;
	}

	onTimeChange() {
		this.next();
	}
}
