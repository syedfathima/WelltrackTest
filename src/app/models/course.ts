import { ThrowStmt } from "@angular/compiler";

export class Course {
	id: number;
	key: string;
	label: string;
	description:string;
	isCompleted: boolean;
	created: Date;
	length: string;
	default: boolean;
	chapters: Chapter[] = [];

	public static initializeArray(objects: any): Course[] {
		let results: Course[] = [];
		for (let i = 0; i < objects.length; i++) {
			let obj = new Course(objects[i][0]);
			results.push(obj);
		}

		return results;
	}

	constructor(data: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.label = data.label || data.Label;
			this.key = data.key || data.Key;
			this.length = data.length || data.Length;
			this.description = data.Description || data.description;
			this.default = data.Default || data.default;
			this.isCompleted = data.IsCompleted || data.iscompleted || false;
			this.created = data.createdOnUtc || data.CreatedOnUtc;
		}
		this.initializeChapters(data.chapters || data.Chapters || []);
	}

	public initializeChapters(chapters?: any) {

		if (chapters) {
			for (let i = 0; i < chapters.length; i++) {
				this.chapters.push(new Chapter(chapters[i]));
			}
		}
		else {
			for (let i = 0; i < 1; i++) {
				this.chapters.push(new Chapter());
			}
		}
	}

	public static forAPI(course: Course) {
		return {
			ID: course.id,
			Label: course.label,
			Key: course.key,
			Description: course.description,
			DefaultCourse: course.default,
			Length: course.length,
			Chapters: course.chapters
		};
	}

	public static forAPIFormData(course: Course) {
		// 	return {
		// 		ID: course.id,
		// 		Label: course.label,
		// 		Key: course.key,
		// 		Length: course.length,
		// 		CourseListing: course.courseListing
		// 	};

		const formData: FormData = new FormData();
		course.id && formData.append("id", course.id.toString());
		formData.append("key", course.key);
		formData.append("label", course.label);
		formData.append("length", course.length);

		course.chapters.forEach((courseItem) => {
			formData.append("courseListing[]", JSON.stringify(courseItem));
		});

		return formData;
	}
}

export class Chapter {
	id: number;
	name: string;
	label: string;
	length: string;
	order: number;
	isActive: number;
	code: string;
	description: string;
	videos: Video[] = [];

	constructor(data?: any) {
		if (data) {
			this.id = data.id || data.ID;
			this.name = data.name || data.Name;
			this.label = data.label || data.Label;
			this.length = data.length || data.Length;
			this.order = data.order || data.Order;
			this.isActive = data.isActive || data.IsActive;
			this.code = data.code || data.Code;
			this.description = data.description || data.Description;

		}
		this.initializeVideos(data.videos || data.Videos || []);
	}

	public initializeVideos(videos?: any) {

		if (videos) {
			for (let i = 0; i < videos.length; i++) {
				this.videos.push(new Video(videos[i]));
			}
		}
		else {
			for (let i = 0; i < 1; i++) {
				this.videos.push(new Video());
			}
		}

	}
}

export class Video {
	id: number;
	label: string;
	length: string;
	image: string;
	imageUpload: fileUpload;
	media: string;
	mediaUpload: fileUpload;
	captionFile: string;
	captionFileUpload: fileUpload;
	audioFile: string;
	audioFileUpload: fileUpload;
	forceVideo: number;
	isCompleted: boolean;
	description:string;
	attachments: Attachment[] = [];

	constructor(data?: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.label = data.Label || data.label;
			this.length = data.Length || data.length;
			this.image = data.Image || data.image;
			this.media = data.Media || data.media;
			this.captionFile = data.CaptionFile|| data.captionFile;
			this.audioFile = data.AudioFile|| data.audioFile;
			this.forceVideo = data.ForceVideo || data.forceVideo;
			this.description = data.description || data.Description;
			this.isCompleted = data.IsCompleted;
			this.imageUpload = new fileUpload(data.ImageUpload || data.imageUpload);
			this.mediaUpload = new fileUpload(data.MediaUpload || data.mediaUpload);
			this.captionFileUpload = new fileUpload(data.CaptionFileUpload || data.captionFileUpload);
			this.audioFileUpload = new fileUpload(data.AudioFileUpload || data.audioFileUpload);
		}
		else {
			this.imageUpload = new fileUpload({});
			this.mediaUpload = new fileUpload({});
			this.captionFileUpload = new fileUpload({});
			this.audioFileUpload = new fileUpload({});
		}
		this.initializeAttachments(data.Attachments || data.attachments || []);
	}

	public initializeAttachments(attachments?: any) {

		if (attachments) {
			for (let i = 0; i < attachments.length; i++) {
				this.attachments.push(new Attachment(attachments[i]));
			}
		}
		else {
			for (let i = 0; i < 1; i++) {
				this.attachments.push(new Attachment());
			}
		}

	}
}

export class Attachment {
	id: number;
	title: string;
	attachment: string;
	fileUpload: string;
	fileFilename: string;
	filePath: string;
	fileFullPath:string;

	constructor(data?: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.title = data.Title || data.title;
			this.attachment = data.Attachment || data.attachment;
			this.filePath = data.FilePath || data.filePath;
			this.fileFullPath = data.FileFullPath || data.FileFullPath;
		}
	}
}

export class fileUpload{
	fileUpload: string;
	fileFilename: string;

	constructor(data: any) {
		if(data) {
			this.fileUpload = data.FileUpload || data.fileUpload;
			this.fileFilename = data.fileFilename || data.fileFilename;
		}
	}
}
