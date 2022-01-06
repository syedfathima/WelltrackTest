import {
    Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../lib/api.service';
import { UserService } from '../../lib/user.service';
import { CalendarEvent, CalendarMonthViewDay, CalendarDateFormatter } from 'angular-calendar';
import { Subject } from 'rxjs';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { LogService } from '../../lib/log.service';
import { MiniCalendarDateFormatter } from './mini.calendar.date.formatter';

import * as moment from 'moment'
import * as _ from 'lodash'

@Component({
    selector: 'mini-calendar-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'mini.calendar.component.html',
    styleUrls: ['./mini.calendar.component.scss'],
    providers: [
        {
            provide: CalendarDateFormatter,
            useClass: MiniCalendarDateFormatter
        }
    ]
})

export class MiniCalendarComponent implements OnInit {

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
    eventCss = '';
    loaded: boolean = false;   
    @Input() all: boolean = false;
    @Input() activeUser: User; 
    @Output() eventsLoaded = new EventEmitter<Object>();

    constructor(
        private api: ApiService,
        private translate: TranslateService,
        private logService: LogService
    ) {
        this.eventCss = 'event-no-scroll';
    }

    ngOnInit() {
        this.translate.stream('calendar').subscribe((res: any) => {
            this.textStr = res;
        });
        this.fetchEvents(true);
    }

    ngOnChanges(){
        this.fetchEvents(false);
    }

    fetchEvents(filterDay: boolean): void {
        this.api.get('calendar/all',
            {
                UserID:  this.activeUser ? this.activeUser.id: null
            }).subscribe(
                (result: any) => {
                    this.events = Event.initializeArray(result.data);
                    if (filterDay) {
                        this.eventsFilterDay(this.pickedDate);
                    }
                    this.refreshView();
                    this.loaded = true; 
                },
                (error: any) => {
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
        this.eventCss = this.activeEvents.length > 3 ? 'event-with-scroll' : 'event-no-scroll'
    }

    dayClicked(event: any): void {
        this.activeEvents = [];
        this.logService.debug(event.day.date);
        this.eventsFilterDay(event.day.date);
        this.eventCss = this.activeEvents.length > 3 ? 'event-with-scroll' : 'event-no-scroll'
        this.eventsLoaded.emit({events: this.activeEvents, date: this.pickedDate}); 
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

}
