import * as moment from 'moment'

export class Appointment {

	id: number;
	participant: string;
	title: string;
	start: Date;
	end: Date;
	guid: string;
	description: string;
	sessionId: string;
	token: string; 

	public static initializeArray(objects: any): Appointment[] {

		let results: Appointment[] = [];
		for (let i = 0; i < objects.length; i++) {
			let obj = new Appointment(objects[i]);
			results.push(obj);
		}

		return results;     
	}

	constructor(data: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.description = data.Description || data.Description;
			this.start = data.start || data.Start;
			this.end = data.end || data.End;
			this.guid = data.GUID || data.guid || data.Guid;
			this.title = data.title || data.Title;
			this.sessionId = data.sessionId || data.SessionID; 
			this.token = data.token || data.Token; 
		}
	}
}
