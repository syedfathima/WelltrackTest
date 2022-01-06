import { Component, OnInit, ElementRef, ViewChildren, Input, AfterViewInit, Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../lib/api.service';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { Subject } from 'rxjs';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { LogService } from '../../lib/log.service';
import { UserService } from '../../lib/user.service';

import * as moment from 'moment'
import * as _ from 'lodash'

@Component({
    selector: 'calendar-component',
    templateUrl: 'calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
})

export class CalendarComponent implements OnInit {

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
    @Input() all: boolean = false;
    @Input() user: User; 
    @Input() type: string = ''; 
    userIds: Array<number>;
    usersPaired: User[];
 
    constructor(
        private api: ApiService,
        private translate: TranslateService,
        private logService: LogService,
        private userService: UserService
    ) {

        this.user = this.userService.getUser();


    }

    ngOnInit() {
        this.translate.stream('calendar').subscribe((res: any) => {
            this.textStr = res;
        });
        this.fetchEvents(true);


    }

    fetchEvents(filterDay: boolean): void {
        let url;
        if (this.all) {
            url = 'calendar/all';
        }
        else {
            url = 'calendar/entries';
        }
        this.api.get(url,
            {
                Type: this.user.userType
            }).subscribe(
                (result: any) => {
                    this.events = Event.initializeArray(result.data);
                    if (filterDay) {
                        this.eventsFilterDay(this.pickedDate);
                    }
                },
                (error: any) => {
                    this.logService.error('Error getting calendar events.' + error.message);
                },
                () => {

                }
            );

        if (this.user.userType == 'professional' || this.user.userType == 'orgadmin') {
            this.fetchUsersPaired();
        }
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
        this.logService.debug(event.day.date);
        this.eventsFilterDay(event.day.date);
        this.scrollToList();
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
            let element = document.getElementById('event-listing');
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
