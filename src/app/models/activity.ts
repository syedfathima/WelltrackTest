import { UtilityService } from '../lib/utility.service';

export class Activity {

	id: number;
	email: string;
	userId: number;
	userName: string;
	organizationName: string;
	message: string;
	created: Date;

	public static initializeArray(objects: any): Activity[] {

		let results: Activity[] = [];
		for (let i = 0; i < objects.length; i++) {
			let obj = new Activity(objects[i]);
			results.push(obj);
		}

		return results;
	}

	constructor(data: any) {
		if (data) {
			this.message = data.Message || data.message;
			this.created =  UtilityService.convertToDate(data.CreatedOnUtc || data.createdOnUtc);
			this.id = data.ID || data.id;
			this.userId = data.UserID || data.userId;
			this.userName = data.userName;
			this.email = data.email;
			this.organizationName = data.organizationName;
			this.email = data.Email || data.email;
		}
	}
}
