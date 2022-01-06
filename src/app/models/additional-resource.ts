export class AdditionalResource {
	id: number;
	title: string;
	description: string;
	logo: string;
	logoUpload: any = '';
	link: string;

	constructor(data: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.title = data.Title || data.title;
			this.description = data.Description || data.description;
			this.logo = data.Logo || data.logo;
			this.link = data.Link || data.link;
		}
	}

	public static initializeArray(objects: any): AdditionalResource[] {
		const results: AdditionalResource[] = [];

		for (let i = 0; i < objects.length; i++) {
			let obj = new AdditionalResource(objects[i]);
			results.push(obj);
		}
		return results;
	}
}
