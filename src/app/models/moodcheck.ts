
import { config } from '../../environments/all';
import { UtilityService } from '../lib/utility.service';

export class Moodcheck {

	id: number;
	userId: number;
	people: string;
	place: string;
	activity: string;
	moods: string[];
	notes: string;
	value: number;
	emotion: string;
	created: Date;

	public static initializeArray(objects: any): Moodcheck[] {
		let results: Moodcheck[] = [];

		for (let i = 0; i < objects.length; i++) {
			let mc = new Moodcheck(objects[i]);
			results.push(mc);
		}

		return results;
	}

	constructor(data?: any) {
		this.moods = [];
		if (data) {
			this.initialize(data);
		}
	}

	public initialize(data: any) {
		
		this.moods = [];

		this.id = data.ID || data.id;
		this.people = data.People || data.people;
		this.place = data.Place || data.place;
		this.activity = data.Activity || data.activity;
		this.notes = data.Notes || data.notes;
		this.value = data.Value || data.value || 0;
		this.emotion = data.ValueText||data.valueText;
		this.userId = data.UserID || data.userID;

		//moods
		let moods = data.Moods || data.moods;

		moods.forEach(element => {
			if (typeof element === 'string') {
				this.moods.push(element);
				return;
			}

			if (element.Mood) {
				this.moods.push(element.Mood);
			}
		});

		//date
		this.created = UtilityService.convertToDate(data.Created || data.created);
	}

	public forApi() {
		return {
			Value: this.value, //convert in app value to match the server format
			Moods: this.moods,
			Activity: this.activity,
			People: this.people,
			Place: this.place,
			Notes: this.notes
		}
	}
}
