import { UtilityService } from '../lib/utility.service';
import * as moment from 'moment'

import * as _ from 'lodash';

export class ActivityScheduler {
	id: number;
	userId: number;
	status: string;
	created: Date;
	updated: Date;
	type: number;
	title: string;
	start: Date;
	end: Date;
	activity: string;
	date: string;
	pleasurable: string;
	social: string;
	achievement: string;
	pleasurableCustom: string;
	socialCustom: string;
	achievementCustom: string;
	events: ActivitySchedulerEvent[];
	event: ActivitySchedulerEvent;
	eventsStr: string;


	constructor(data?: any) {
		if (!data || !data.ID || !data.Title || !data.Start || !data.End) {
			return;
		}
		this.id = data.ID || data.id;
		this.status = data.Status || data.status;
		this.type = data.Type || data.type;
		if(!this.type){
			this.type = 1; 
		}
		this.created = UtilityService.convertToDate(data.Created || data.created);
		this.updated = UtilityService.convertToDate(data.Updated || data.updated);
		this.userId = data.UserID || data.userId;
		this.title = data.Title;
	
		this.start =  UtilityService.convertToDate(data.Start);
		this.end =  UtilityService.convertToDate(data.End);
	}

	public static initializeArray(objects: any): ActivityScheduler[] {
		let results: ActivityScheduler[] = [];

		for (let i = 0; i < objects.length; i++) {
			if (!objects[i] || !objects[i].ID || !objects[i].Title || !objects[i].Start || !objects[i].End) {
				continue; 
			}
			let as = new ActivityScheduler(objects[i]);
			results.push(as);
		}

		return results;
	}


	public setEvents(events: any) {
		//reset
		this.events = [];

		if (events.length > 0) {
			for (let i = 0; i < events.length; i++) {
				this.events.push(new ActivitySchedulerEvent(events[i]));
			}
			this.event = new ActivitySchedulerEvent(events[0]);
		}
	}

	public convertActivityTypeArr(str: string): any {
		if (str) {
			let selected: string[] = str.split(',');
			return selected;
		}
		else {
			return [];
		}

	}

	public convertActivityTypeStr(activity: Array<string>): string {
		if (activity) {
			return activity.join(',');
		}
		else {
			return '';
		}
	}

	public convertEvents(events: ActivitySchedulerEvent[]): string {
		let selected: string[] = [];

		if (events.length) {
			for (let i = 0; i < events.length; i++) {
				if (!_.some(selected, (el) => _.includes(events[i].title, el))) {
					if (events[i].title && events[i].id) {
						selected.push(events[i].title);
					}
				}
			}
			return selected.join(', ');
		} else {
			return 'No events yet';
		}

	}

	public forApi() {
		let returnObj = {
			'Title': this.title,
			'Status': this.status,
			'Start': this.start, 
			'End': this.end, 
			'Type': this.type, 
			'Created': this.created,
			'Updated': this.updated
		}
		return returnObj;
	}

	public forCompleted() {
		let results = [];
		for (let i = 0; i < this.events.length; i++) {
			results.push(this.events[i].forCompleted());
		}
		return results;
	}

	public getActivityList() {
		let results1 = [];
		let results2 = [];
		let results3 = [];
		for (let i = 0; i < this.events.length; i++) {
			let event = this.events[i].getActivtyList();
			if (event.category === 'pleasurable') {
				results1.push(event);
			} else if (event.category === 'social') {
				results2.push(event);
			} else if (event.category === 'achievement') {
				results3.push(event);
			}
		}
		return {
			'pleasurable': results1,
			'social': results2,
			'achievement': results3
		};
	}

}

export class ActivitySchedulerEvent {
	id: number;
	title: string;
	start: Date;
	end: Date;
	category: string;


	constructor(data: any) {

		this.id = data.ID || data.id;
		this.title = data.Title || data.title;
		this.start = data.Start || data.start;
		this.end = data.End || data.end;
		this.category = data.Category || data.category;

	}

	public static forApi(events: ActivitySchedulerEvent[]) {
		let results = [];

		for (let i = 0; i < events.length; i++) {
			let event = events[i];

			results.push({
				ID: event.id,
				Title: event.title,
				Start: event.start,
				End: event.end,
				Category: event.category
			});
		}

		return results;
	}

	public forCompleted() {
		let color = '#B8B7AF'
		if (this.category === 'pleasurable') {
			color = '#F6DB72';
		}
		if (this.category === 'social') {
			color = '#B9EB9E';
		}
		if (this.category === 'achievement') {
			color = '#80C7DC';
		}

		let result = {
			title: this.title,
			color: color,
			category: this.category,
			start: moment(this.start).toDate().toISOString(),
			end: moment(this.end).toDate().toISOString(),
			textColor: '#85847E'
		}
	
		return result;
	}

	public getActivtyList() {
		let result = {
			text: this.title,
			isSelected: true,
			category: this.category
		}
		return result;
	}
}
