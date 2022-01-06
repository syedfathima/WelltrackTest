
import { UtilityService } from '../lib/utility.service';
import * as moment from 'moment'
import { User } from '../models/user';
import { Moodcheck } from '../models/moodcheck';
import { Assessment } from '../models/assessment';
import { FunAchievement } from '../models/fun-achievement';
import { ActivityScheduler } from '../models/activity-scheduler';
import { ThoughtDiary } from './thought-diary';

const colors: any = {

	moodcheck: {
		primary: '#FE8C00',
		secondary: '#FFFFFF'
	},
	zenroom: {
		primary: '#FE8C00',
		secondary: '#FFFFFF'
	},
	thoughtdiary: {
		primary: '#8FD3F4',
		secondary: '#FFFFFF'
	},
	funachievement: {
		primary: '#FE8C00',
		secondary: '#FFFFFF'
	},
	appointment: {
		primary: '#1e90ff',
		secondary: '#FFFFFF'
	},
	assessment: {
		primary: '#0ba360',
		secondary: '#FFFFFF'
	},
	activityscheduler: {
		primary: '#9B189E',
		secondary: '#FFFFFF'
	},
	anxiety: {
		primary: '#456C98',
		secondary: '#FFFFFF'
	},
	depression: {
		primary: '#BA4D82',
		secondary: '#FFFFFF'
	},
	scheduled: {
		primary: '#FF2B00',
		secondary: '#FFFFFF'
	}

};

export class Event {
	id: number;
	date: Date;
	start: Date;
	end: Date;
	startDate: Date;
	endDate: Date;
	title: string;
	name: string;
	userName: string;
	type: string;
	typeName: string;
	color: Object;
	cssClass: string;
	eventClass: string;
	description: string;
	creatorId: number;
	status: string;
	participants: Participant[];
	creator: User;
	data: any;
	scheduled: boolean;
	zoomPersonalMeetingUrl: string;

	constructor(data?: any) {
		if (data) {

			this.id = data.id;
			this.title = data.title;
			this.name = data.name;
			this.userName = data.userName; 
			this.type = data.type;
			this.typeName = data.typeName;
			this.start = UtilityService.convertToDate(data.start);
			this.startDate = UtilityService.convertToDate(data.start);
			//this.endDate = UtilityService.convertToDate(data.end);
			this.color = colors[data.type];
			this.description = data.description;
			this.creatorId = data.creatorId;
			this.status = data.status;
			this.cssClass = data.cssClass;
		

			if (this.type === 'appointment') {
				this.end = UtilityService.convertToDate(data.end);
				this.creator = new User(data.creator);
				this.participants = Participant.initializeArray(data.participants);
				//this.participants = 
			} else if (this.type === 'moodcheck') {
				this.data = new Moodcheck(data.data);
			} else if (this.type === 'assessment') {
				this.data = new Assessment(data.data);
			} else if (this.type === 'thoughtdiary') {
				this.data = new ThoughtDiary(data.data);
			} else if (this.type === 'funachievement') {
				this.data = new FunAchievement(data.data);
			} else if (this.type === 'activityscheduler') {
				this.data = new ActivityScheduler(data.data);
			} else if (this.type === 'scheduled') {
				this.creator = new User(data.creator);

			} else {

			}
			this.scheduled = data.scheduled;
		}
	}

	public static initializeArray(objects: any): Event[] {

		let results: Event[] = [];

		for (let i = 0; i < objects.length; i++) {
			let obj = new Event(objects[i]);
			results.push(obj);
		}

		return results;
	}

}

export class Participant {
	id: number;
	fullName: string;
	email: string;
	status: string;

	constructor(data?: any) {
		this.id = data.ID || data.id;
		this.fullName = data.Name || data.name;
		this.email = data.Email || data.email;
		this.status = data.Status || data.status;
	}

	public static initializeArray(objects: any): Participant[] {
		let results: Participant[] = [];

		for (let i = 0; i < objects.length; i++) {
			let user = new User(objects[i]);
			let obj = { 'name': user.fullName, 'email': user.email, 'id': user.id, 'status': objects[i].Status };
			results.push(new Participant(obj));
		}

		return results;
	}

}