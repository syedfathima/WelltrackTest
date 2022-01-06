import * as moment from 'moment'

export class Config {

	id: number;
	participant: string;
	title: string;
	start: Date;
	end: Date;
	guid: string;
	description: string;
	sessionId: string;
	token: string; 

	

	constructor(data: any) {
		if (data) {
		}
	}
}
