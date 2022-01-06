import { Component, ViewChild, ViewEncapsulation, OnInit, Output, Input, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../lib/api.service';
import { ModalService } from '../../lib/modal.service';
import { LogService } from '../../lib/log.service';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { Event } from '../../models/event';
import { StorageService } from '../../lib/storage.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment'

@Component({
	selector: 'appointment-invite-modal',
	templateUrl: 'appointment-invite-modal.component.html',
	styleUrls: ['./appointment-invite-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})


export class AppointmentInviteModalComponent implements OnInit {

	@Output() reloadEvents = new EventEmitter<any>();
	@Output() closeInvite = new EventEmitter<any>();
	@Input() hideSubmit: boolean;
	@Input() invitee: User;
	inviter: User;
	users: User[];
	currentDate: Date;
	innerhtml: string;
	title: string;
	value: boolean;
	isLoaded: boolean = true;
	hours: Array<string> = ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00']
	durations: Array<Object> = [
		{ 'label': '15 min', 'value': '15' },
		{ 'label': '30 min', 'value': '30' },
		{ 'label': '45 min', 'value': '45' },
		{ 'label': '60 min', 'value': '60' },
		{ 'label': '120 min', 'value': '120' }];

	id: number = null;
	description = '';
	participant: number = -1;
	start: string;
	end: string;
	popup: any;
	pm = false;
	duration: number = -1;
	min: Date; 
	placeholder: string;
	orgId: any;
	event: Event;
	hour: number = 0;
	minutes: number = 0;
	ampm: string;
	closed: boolean = true;
	datetime: string;
	appointmentStart: Date;

	constructor(
		public dialogRef: MatDialogRef<AppointmentInviteModalComponent>,
		private modalService: ModalService,
		private api: ApiService,
		private logService: LogService,
		private router: Router,
		private translate: TranslateService,
		private storage: StorageService,
		private userService: UserService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.translate.stream('calendar').subscribe((res: any) => {
			this.placeholder = res.desc;
			this.popup = res.popups
		});

		this.inviter = this.userService.getUser();

		if (this.storage.get('orgselect')) {
			this.orgId = this.storage.get('orgselect')
		} else {
			this.orgId = this.inviter.primaryOrganization.id;
		}
		this.logService.debug('fetched event from modal');
		this.logService.debug(data.data);
		if (data.data) {
			this.event = data.data;
		}

		if (this.event) {
			this.id = this.event.id;
			this.title = this.event.title;
			this.description = this.event.description;
			this.currentDate = this.event.start;
			let startTime = moment.parseZone(this.event.start);
			let endTime = moment.parseZone(this.event.end);
			this.duration = moment.duration(endTime.diff(startTime)).asMinutes();
			this.datetime = startTime.format();
			if (this.event.participants) {
				this.participant = this.event.participants[0].id;
			}

		} else {
			this.participant = -1;
			this.currentDate = new Date();
			this.currentDate.setDate(this.currentDate.getDate() + 1);
		}
		this.min = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 6, 0);
	}

	ngOnInit() {
		//If no invitee is specified, get all paired users
		if (!this.invitee) {
			this.api.get('userspaired').subscribe(
				(results: any) => {
					this.users = User.initializeArray(results.data);
				},
				(error: any) => {

					this.modalService.showAlert(this.popup.error, error.message);
					this.logService.error('Error registering. ' + error.message);
				}
			);
		}
	}

	onClose() {
		this.closeInvite.emit();
	}

	onCreate() {

		if (this.participant === -1 && !this.invitee) {
			this.modalService.showAlert(this.popup.oops, this.popup.blank);
			return;
		}

		if (this.title === '' || this.duration === -1) {
			this.modalService.showAlert(this.popup.oops, this.popup.blank);
			return;
		}

		let obj = this.formatData();

		this.api.post('appointments', {
			AppointmentID: this.id,
			Title: this.title,
			Duration: this.duration,
			Message: this.description,
			Participant: this.invitee ? this.invitee.id : this.participant,
			OrgID: this.orgId,
			Start: obj.start,
			End: obj.end
		}).subscribe(
			(results: any) => {
				this.modalService.showAlert(this.popup.success, 'The appointment has been scheduled and an invite to the user has been sent.');
				this.onClose();
				this.reloadEvents.emit(true);
				this.closeInvite.emit(true);

				this.init();
			},
			(error: any) => {

				this.modalService.showAlert(this.popup.error, error.message);
				this.logService.error('Error registering. ' + error.message);
			}
		);
	}

	formatData() {
		let start = moment.parseZone(this.datetime).format('YYYY-MM-DD HH:mm');
		let end = moment.parseZone(this.datetime).add(this.duration, 'minutes').format('YYYY-MM-DD HH:mm');
		return { 'start': start, 'end': end };
	}

	onPrev() {
		this.currentDate = new Date(moment.parseZone(this.currentDate).subtract('1', 'day').format("YYYY-MM-DDTHH:mm:ssZ"));
		this.datetime = moment.parseZone(this.currentDate).format();
	}

	onNext() {
		this.currentDate = new Date(moment.parseZone(this.currentDate).add('1', 'day').format("YYYY-MM-DDTHH:mm:ssZ"));
		this.datetime = moment.parseZone(this.currentDate).format();
	}

	validateHour() {
		if (this.hour > 24) {
			this.hour = 24;
			this.minutes = 0;
		}
		if (this.hour < 0) {
			this.hour = 0;
		}
	}

	validateMinutes() {
		if (this.minutes > 60) {
			this.minutes = 60;
		}
		if (this.minutes < 0) {
			this.minutes = 0;
		}

		if (this.hour === 24 && this.minutes > 0) {
			this.minutes = 0;
		}
	}

	init() {
		this.title = '';
		this.currentDate = new Date;
		this.currentDate.setDate(this.currentDate.getDate() + 1);
	}

	changecalled() {
		this.currentDate = new Date(this.datetime);
	}

	close() {
		this.dialogRef.close();
	}


}
