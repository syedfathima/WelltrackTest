import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../lib/api.service';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { Subject } from 'rxjs';
import { Event } from '../../../models/event';
import { User } from '../../../models/user';
import { LogService } from '../../../lib/log.service';
import { UserService } from '../../../lib/user.service';
import { CalendarService} from '../../../lib/calendar.service'; 

import * as moment from 'moment'
import * as _ from 'lodash'

@Component({
    selector: 'calendar-professional-component',
    templateUrl: 'calendar-professional.component.html',
    styleUrls: ['./calendar-professional.component.scss'],
})

export class CalendarProfessionalComponent implements OnInit {

    pickedDate: Date;
    events: any;
    textStr: any;
    activeDayIsOpen: boolean = true;
    title: string = '';
    view: string = 'month';
    isOpen = false;
    viewDate: Date = new Date();
    currentDate: Date;
    events$: Array<CalendarEvent<any>>;
    activeEvents: any = [];
    nextWeek = new Date(this.viewDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    refresh: Subject<any> = new Subject();
    @Input() users: User[];
    @Input() type: string = '';
    userIds: Array<number>;
    usersPaired: User[];
    loading: boolean = false;
    @Input() all: boolean = false;
    @Input() activeUser: User;
    @Output() eventsLoaded = new EventEmitter<Object>();

    constructor(
        private api: ApiService,
        private translate: TranslateService,
        private logService: LogService,
        private calendarService: CalendarService
    ) {

        this.calendarService.refresh.subscribe(() => {
            this.fetchEvents(false);
		});

    }

    ngOnInit() {
        this.translate.stream('calendar').subscribe((res: any) => {
            this.textStr = res;
        });
        this.fetchEvents(true);
    }

    ngOnChanges() {
        this.fetchEvents(false);
    }

    fetchEvents(filterDay: boolean): void {
        this.loading = true;
        this.api.get(this.all ? 'calendar/all' : 'calendar/entries',
            {
                UserID: this.activeUser ? this.activeUser.id : null
            }).subscribe(
                (result: any) => {
                    this.loading = false;
                    this.events = Event.initializeArray(result.data);
                    if (filterDay) {
                        this.eventsFilterDay(this.pickedDate);
                    }

                    this.refreshView();
                },
                (error: any) => {
                    this.loading = false;
                    this.logService.error('Error getting calendar events.' + error.message);
                },
                () => {

                }
            );
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
        this.logService.debug(event.day.date);
        this.eventsFilterDay(event.day.date);
        this.scrollToList();
        this.eventsLoaded.emit({ events: this.activeEvents, date: this.pickedDate });
    }

    eventsFilterDay(date: any) {
        this.pickedDate = date;
        let eventStartDate = '';
        for (let i = 0; i < this.events.length; i++) {
            eventStartDate = moment.parseZone(this.events[i].start).format('YYYY MM DD');
            if (eventStartDate == moment.parseZone(date).format('YYYY MM DD')) {
                this.activeEvents.push(this.events[i]);
            }
        }
    }

    scrollToList() {
        setTimeout(() => {
            let element = document.getElementById('above-calendar');
            element.scrollIntoView();
        }, 100);
    }

    fetchUsersPaired() {
        this.api.get('userspaired', {}).subscribe(
            (results: any) => {
                this.usersPaired = User.initializeArray(results.data);
            },
            (error: any) => {
                this.logService.error('Error loading. ' + error.message);
            }
        );
    }
}
