import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ApiService } from '../../../lib/api.service';
import { User } from '../../../models/user';
import { Event } from '../../../models/event';
import { LogService } from '../../../lib/log.service';
import { UserService } from '../../../lib/user.service';
import { CalendarService } from '../../../lib/calendar.service';
import { ModalService } from '../../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { AppointmentInviteModalComponent } from '../../appointment-invite-modal/appointment-invite-modal.component';
import * as _ from 'lodash';

@Component({
	selector: 'event-listing-component',
	templateUrl: 'event-listing.component.html',
	styleUrls: ['./event-listing.component.scss'],
})


export class EventListingComponent implements OnInit {

	@Input() pickedDate: any;
	@Input() activeEvents: Event[];
	@Output() eventsChange = new EventEmitter<Object>();
	calendarStrings: any;

	user: User;

	constructor(
		private api: ApiService,
		private translate: TranslateService,
		private logService: LogService,
		private userService: UserService,
		private calendarService: CalendarService,
		private modalService: ModalService
	) {
		this.user = this.userService.getUser();
	}

	ngOnInit() {
		this.logService.debug('Active events initial fetch');
		this.logService.debug(this.activeEvents);
		this.translate.stream('calendar').subscribe((res: any) => {
			this.calendarStrings = res;
		});
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

	removeScheduledEvent(id) {
		this.api.delete('calendar/removescheduled/' + id).subscribe(
			(results: any) => {
				let index = _.findIndex(this.activeEvents, { id: id });
				this.activeEvents.splice(index, 1);
				this.calendarService.triggerRefresh();
				this.modalService.showAlert('Success', 'Your scheduled event has been successfully removed.');
			},
			(error: any) => {
				this.modalService.showAlert('Error', error.message);
			}
		);
	}

	onAppointmentUpdate(i) {
		this.modalService.showComponent(AppointmentInviteModalComponent, this.activeEvents[i]);
	}

	onAppointmentDestroy(i) {
		let appointment = this.activeEvents[i];
		this.logService.debug(this.calendarStrings);
		this.modalService.showConfirmation('Delete', this.calendarStrings.deleteAppointment).afterClosed().subscribe(result => {
			if (result) {
				this.api.delete('appointments/' + appointment['id']).subscribe(
					(results: any) => {
						this.modalService.showAlert('Success', 'The appointment has been deleted');
						this.activeEvents.splice(i, 1);
						this.calendarService.triggerRefresh();
					},
					(error: any) => {
						this.modalService.showAlert('Error', error.message);
					}
				);
			}
		});
	}

	onAppointmentAccept(id) {
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

	onAppointmentDecline(id) {
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

}
