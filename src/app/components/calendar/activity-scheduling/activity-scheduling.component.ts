import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../lib/api.service';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { Event } from '../../../models/event';
import { User } from '../../../models/user';
import { LogService } from '../../../lib/log.service';
import { UserService } from '../../../lib/user.service';
import { CalendarService } from '../../../lib/calendar.service';

import * as moment from 'moment'
import * as _ from 'lodash';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'activity-scheduling-component',
    templateUrl: 'activity-scheduling.component.html',
    styleUrls: ['./activity-scheduling.component.scss'],
})

export class ActivitySchedulingComponent implements OnInit {

    user: User;
    @Input() activeUser: User;
    loading: boolean = false;
    @Input() type: string = '';
    mode: string;


    scheduledActivityRows$: Array<CalendarEvent<any>>;
    eventTypes: Array<{ type: string, name: string, start: Date, startDate: Date }> = Array(
        { type: 'appointment', name: 'Video Appointment', start: null, startDate: null },
        { type: 'moodcheck', name: 'MoodCheck', start: null, startDate: null },
        { type: 'assessment', name: 'Assessment', start: null, startDate: null },
        { type: 'depression', name: 'Depression course', start: null, startDate: null },
        { type: 'anxiety', name: 'Anxiety course', start: null, startDate: null },
        { type: 'zenroom', name: 'Zen Room', start: null, startDate: null },
        { type: 'activityscheduler', name: 'Activity Scheduler', start: null, startDate: null },
        { type: 'thoughtdiary', name: 'Thought Diary', start: null, startDate: null },
        { type: 'funachievement', name: 'Fun Achievement', start: null, startDate: null },
        { type: 'quiz', name: 'Cognitive Distortions quiz', start: null, startDate: null }
    );

    courseTypes: Array<{ type: string, name: string }> = [
        { type: 'depression', name: 'Depression' },
        { type: 'anxiety', name: 'Anxiety' }
    ];

    eventSelected: string = 'moodcheck';
    courseSelected: string = 'depression';
    date: any;
    time: any;
    events: any = [];

    constructor(
        private api: ApiService,
        private translate: TranslateService,
        private logService: LogService,
        private userService: UserService,
        private calendarService: CalendarService
    ) {
        this.mode = "singleSave";
        this.user = this.userService.getUser();

        this.calendarService.inviteClose.subscribe(() => {
           this.eventSelected = 'moodcheck';
		});
    }

    ngOnInit() {
        this.date = new Date();
        this.date.setDate(this.date.getDate() + 1);

        this.calendarService.refresh.subscribe(() => {
          
		});

    }

    addEvent() {
        let eventType = _.find(this.eventTypes, { 'type': this.eventSelected });
        let newEventType = _.cloneDeep(eventType);

        if (this.eventSelected === 'course') {
            let courseType = _.find(this.courseTypes, { 'type': this.courseSelected });
            newEventType.name = eventType.name + ' - ' + courseType.name;
            newEventType.type = courseType.type;
        }
        this.logService.debug('Date:');
        this.logService.debug( this.date);
        newEventType.start = this.date;
        let newEvent = new Event(newEventType);
        this.events.push(newEvent);
        /* Meant to be a queue system of multiple events
        * has since been changed to a single event create
        */
        this.onSaveEvents();
    }

    onRemoveEvent(i) {
        this.events.splice(i, 1);
    }

    onSaveEvents() {
        this.loading = true;

        this.api.post('calendar/schedule', {
            events: this.events,
            CreatorUserID: this.user.id,
            UserID: this.activeUser.id
        }).subscribe(
            (data: any) => {
                this.loading = false;
                this.events = [];
                this.calendarService.triggerRefresh();
            },
            (error: any) => {
                this.loading = false;
            }, () => {
                this.events = [];
                this.loading = false;
            }
        );
    }

}

