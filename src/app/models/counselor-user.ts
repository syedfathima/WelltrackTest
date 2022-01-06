
export class CounselorUser {

	id: number;
	name: string;
	isPaired: boolean;
	confirmed: boolean;
	email: string;
	avatarUrl: string;
	zoomPersonalMeetingUrl: string; 

	public static initializeArray(objects: any): CounselorUser[] {

		let results: CounselorUser[] = [];

		for (let i = 0; i < objects.length; i++) {
			let obj = new CounselorUser(objects[i][0]);

			results.push(obj);
		}

		return results;
	}

	constructor(data: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.name = data.Name || data.name;
			this.isPaired = data.IsPaired || data.isPaired || false;
			this.email = data.Email || data.email;
			this.avatarUrl = data.Avatar || data.avatarUrl;
			this.confirmed = data.Confirmed || data.confirmed || false;
			this.name = this.name.trim();
			this.zoomPersonalMeetingUrl = data.zoomPersonalMeetingUrl;
		}
	}

	public static forApi(counselors: CounselorUser[]) {
		return {
			'Counselors': JSON.stringify(counselors)
		}
	}
}
