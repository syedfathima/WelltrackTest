import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Renderer2 } from '@angular/core';
import { ActivityScheduler, ActivitySchedulerEvent } from '../../../app/models/activity-scheduler'
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../app/lib/api.service';
import { LogService } from '../../../app/lib/log.service';
import { } from '@angular/common';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { DialogPreset } from 'ngx-modialog/plugins/vex';
import { ModalService } from '../../lib/modal.service';

declare var jQuery: any;
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'scheduler-modal',
	templateUrl: './scheduler-modal.component.html',
	styleUrls: ['./scheduler-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SchedulerModal implements OnInit {
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

	constructor(
		private modalService: ModalService,
		private translate: TranslateService,
		private api: ApiService,
		private log: LogService,
		public dialog: DialogRef<DialogPreset>,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.active = [false, false, false];

		this.translate.stream('as').subscribe((res: any) => {
			this.months = res.month
			this.errorPopups = res.errorPopups;
			this.successPopups = res.successPopups;
		});

		this.activatedRoute.params.subscribe(params => {
			this.id = params['id'];
			if(this.id){
				this.viewMode = 'edit';
			}
			else{
				this.viewMode = 'create';
			}
		});

		if (this.viewMode === 'edit') {
			this.api.get('practice/activityscheduler/' + this.id).subscribe(
				(result: any) => {
					this.log.debug('AS data fetched');
					this.log.debug(result.data);
					this.as = new ActivityScheduler(result.data);
					this.log.debug('Got the activity scheduler row');
					this.log.debug(this.as);
					this.viewMode = 'readonly';
					this.isDisabled = true;
					this.makeReadOnly();
					this.start = moment.parseZone(this.as.start).format();
					this.end = moment.parseZone(this.as.end).format();
					this.startFormatted = moment.parseZone(this.as.start).format('DD MMM YYYY h:mm a');
					//this.endFormatted = moment.parseZone(this.activityscheduler.end).format('hh:mm a');

				},
				(error: any) => {
					this.log.error('Error getting F&A. ' + error.message);
				},
				() => {
					this.isLoaded = true;

				}
			);
		} else {
			this.isLoaded = true;
			this.as = new ActivityScheduler();
			this.log.debug(this.as);
		}
	}


	formatTime() {
		let start = moment.parseZone(this.start);
		let end = moment.parseZone(this.start);

		this.startFormatted = moment.parseZone(this.start).format('DD MMM YYYY hh:mm a');
		this.end = moment.parseZone(this.start).add('30', 'minutes').format();
		this.as.start = new Date(this.start);
		this.as.end = new Date(this.end);
	}

	makeReadOnly() {
		jQuery('#page-activity input').attr('disabled', true);
		jQuery('#page-activity textarea').attr('disabled', true);
		jQuery('#page-activity select').attr('disabled', true);
		jQuery('#page-activity ion-select').attr('disabled', true);
	}


	selectType(type: number) {
		if (this.viewMode !== 'readonly') {
			this.activityType = type;
			this.as.type = type;
			this.next();
		}
	}

	isType(type: number){
		if(this.as.type === type ){
			return true;
		}
		else{
			return false;
		}
	}

	onSubmit() {
		if (!this.start) {
			this.modalService.showAlert(this.errorPopups.error, this.errorPopups.dateTime);
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

		/* let event = [{'title': this.as.title, 'start': this.as.start, 'end': this.as.end, 'category': category, 'id': 0}];
		this.as.setEvents(event); */
		this.as.status = 'complete';
		this.api.post('practice/activityscheduler2', this.as.forApi()).subscribe(
			(data: any) => {
				this.modalService.showAlert(this.successPopups.success, this.successPopups.body);
				this.dialog.close();
			},
			(error: any) => {
				this.modalService.showAlert(this.errorPopups.title, error.message);
				this.dialog.close();
			}
		);
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

		if (this.currentStep === 0 && !this.as.type ) {
			this.modalService.showAlert(this.errorPopups.error, this.errorPopups.activityType);
			return;
		}
		if (!this.as.title && this.currentStep === 1) {
			this.modalService.showAlert(this.errorPopups.error, this.errorPopups.activity);
			return;
		}
		this.currentStep++;
	}

	back() {
		this.currentStep--;
	}



}
