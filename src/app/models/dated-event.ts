export class DatedEvent {
	id: number;
	orgID: number;
	orgName: string;
	title: string;
	description: string;
	link: string;
	image: string;
	video: string;
	dateTime: any;
	active: boolean;

	constructor(data?: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.orgID = data.OrgID || data.orgID;
			this.orgName = data.OrgName || data.orgName;
			this.title = data.Title || data.title;
			this.description = data.Description || data.description;
			this.link = data.Link || data.link;
			this.image = data.Image || data.image;
			this.video = data.Video || data.video;
			this.dateTime = data.DateTime || data.dateTime;
			this.active = data.Active || data.active;
		}
	}

	public static initializeArray(objects: any): DatedEvent[] {
		let results: DatedEvent[] = [];
		for (let i = 0; i < objects.length; i++) {
			let obj = new DatedEvent(objects[i][0]);
			results.push(obj);
		}

		return results;
	}

	static forApi(event: DatedEvent) {
		return {
			data: {
				ID: event.id,
				OrgID: event.orgID,
				OrgName: event.orgName,
				Title: event.title,
				Description: event.description,
				Link: event.link,
				Image: event.image,
				Video: event.video,
				DateTime: event.dateTime,
				Active: event.active,
			},
		};
	}
}
