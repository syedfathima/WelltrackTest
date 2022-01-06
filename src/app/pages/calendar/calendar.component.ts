import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Event } from '../../models/event';
import { ApiService } from '../../lib/api.service';

import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { Router } from '@angular/router';
import { ModalService } from '../../lib/modal.service';
import { AppointmentInviteComponent } from '../../components/appointment-invite/appointment-invite.component';
import { TranslateService } from '@ngx-translate/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { Subject } from 'rxjs';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { Appointment } from '../../models/appointment';
import { Invite } from '../../components/invite/invite';

import * as moment from 'moment'
import * as _ from 'lodash'

@Component({
	selector: 'page-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss']
})
export class CalendarPage implements OnInit {

	title: string = '';
	view: string = 'month';
	isOpen = false;
	viewDate: Date = new Date();
	currentDate: Date;
	events$: Array<CalendarEvent<any>>;
	activeEvents: any = [];
	nextWeek = new Date(this.viewDate.getTime() + 7 * 24 * 60 * 60 * 1000);
	pickedDate: Date;
	events: any;
	user: User;
	users: User[] = [];
	appointmentslisting: Array<Appointment> = [];
	appointments: Array<Appointment> = [];
	showpro: boolean;
	placeholder: string;
	refresh: Subject<any> = new Subject();
	activeDayIsOpen: boolean = true;
	host: boolean;
	textStr: any;
	inviteOpen: boolean = false;

	constructor(
		private api: ApiService,
		private modalService: ModalService,
		private log: LogService,
		private storage: StorageService,
		private router: Router,
		private translate: TranslateService,
		private userService: UserService
	) {
		this.pickedDate = new Date();
		this.title = 'Calendar';
		this.user = this.userService.getUser();
		this.host = this.user.permissions.videohost;
	}

	ngOnInit() {
		this.translate.stream('calendar').subscribe((res: any) => {
			this.textStr = res;
		});
		this.fetchEvents(true);

	}

	fetchEvents(filterDay: boolean): void {

		this.api.get('calendar/all', { creatorView: true }).subscribe(
			(result: any) => {
				this.events = Event.initializeArray(result.data);
				if (filterDay) {
					this.eventsFilterDay(this.pickedDate);
				}
			},
			(error: any) => {
				this.log.error('Error getting calendar events.' + error.message);
			},
			() => {

			}
		);
		this.refreshView();
	}


	//Refreshes the view
	refreshView(): void {
		this.refresh.next();
	}

	beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
		this.fetchEvents(false);
	}

	dayClicked(event: any): void {
		this.activeEvents = [];

		this.eventsFilterDay(event.day.date);
		this.scrollToList();
	}

	eventsFilterDay(date: any) {
		this.pickedDate = date;
		let eventStartDate = '';
		for (let i = 0; i < this.events.length; i++) {
			eventStartDate = moment.parseZone(this.events[i].start).format('YYYY MM DD');
			if (eventStartDate === moment.parseZone(date).format('YYYY MM DD')) {
				this.activeEvents.push(this.events[i]);
				this.log.debug(this.activeEvents);
			}
		}
	}

	onUpdate(i) {
		let inviteInfo = {
			'appointment': this.events[i]
		};
		this.log.debug(this.appointments[i]);
		this.modalService.showComponent(AppointmentInviteComponent, inviteInfo);
	}


	onDestroy(i) {
		let appointment = this.events[i];

		this.modalService.showConfirmation("Delete", this.textStr.deleteAppointment).afterClosed().subscribe(result => {
			if (result) {
				this.api.delete('appointments/' + appointment['id']).subscribe(
					(results: any) => {
						this.modalService.showAlert('Success', 'The appointment has been deleted');
						this.activeEvents.splice(i, 1);
						this.fetchEvents(false);
					},
					(error: any) => {
						this.modalService.showAlert('Error', error.message);
					}
				);
			}
		});

	}

	scrollToList() {
		setTimeout(() => {
			let element = document.getElementById('event-listing');
			element.scrollIntoView();
		}, 100);
	}

	onAccept(id) {
		this.api.post('appointments/accept/' + id, {}).subscribe(
			(results: any) => {
				let index = _.findIndex(this.activeEvents, { id: id });
				this.activeEvents[index].status = 'approved';
			},
			(error: any) => {
				this.modalService.showAlert('Error', error.message);
			}
		);
	}

	onDecline(id) {
		this.api.post('appointments/decline' + id, {}).subscribe(
			(results: any) => {
				let index = _.findIndex(this.activeEvents, { id: id });
				this.activeEvents[index].status = 'declined';
			},
			(error: any) => {
				this.modalService.showAlert('Error', error.message);
			}
		);
	}

	onToggleInvite() {
		this.inviteOpen = !this.inviteOpen;
	}

	inviteShare() {
		let inviteInfo = {
			'type': 'professional',
			'endpoint': 'userinvite',
			'forceShare': true,
			'orgId': this.user.primaryOrganization.id
		};
		this.modalService.showComponent(Invite, inviteInfo);
	}


}	