import {
	Component,
	ViewChild,
	ViewEncapsulation,
	OnInit,
	Input,
	Inject,
} from "@angular/core";
import {
	FormGroup,
	FormBuilder,
	FormArray,
	Validators,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../../lib/api.service";
import { LogService } from "../../../lib/log.service";
import { ModalService } from "../../../lib/modal.service";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course, Chapter, Video, Attachment } from "../../../models/course";

@Component({
	selector: "app-course-admin-edit",
	templateUrl: "./course-admin-edit.component.html",
	styleUrls: ["./course-admin-edit.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class CourseAdminEditComponent implements OnInit {
	courseEditForm: FormGroup;
	courseListingId: number;
	courseKey: string;
	title: string;
	mode: string;
	course: Course;
	isLoaded: boolean = false;
	config: any;
	panelState:Array<boolean>;
	submitButtonPressed: boolean = false;
	errors:string = "";

	constructor(
		private translate: TranslateService,
		private formBuilder: FormBuilder,
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
		public dialogRef: MatDialogRef<CourseAdminEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.courseListingId = data.data;
		this.panelState = [];

		if (this.courseListingId) {
			this.title = "Edit this Course";
			this.mode = "update";
		} else {
			this.title = "Create a Course";
			this.course = new Course({});
			this.mode = "create";
			this.isLoaded = true;
		}

		this.createCourseEditForm(new Course({}));

		this.config = {
			toolbar: [
				{ name: 'formatting', items: ['PasteFromWord'] },
				{ name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-'] },
				{ name: 'links', items: ['Link', 'Unlink'] },
				{ name: 'paragraph', items: ['NumberedList', 'BulletedList'] }
			]
		};
	}

	get f() {
		return this.courseEditForm.controls;
	}

	createCourseEditForm(data: any){
		this.courseEditForm = this.formBuilder.group({
			id: [data.id || null],
			label: [data.label || "", [Validators.required]],
			key: [data.key || ""],
			description: [data.description || ""],
			length: [data.length || ""],
			isCompleted: [data.isCompleted || false],
			default: [data.default || false],
			chapters: this.formBuilder.array([]),
		});

		data.chapters?.forEach((chapter: any) => {
			this.addCourseItem(chapter);
		});
	}

	get chapters() {
		return this.courseEditForm.get("chapters") as FormArray;
	}

	getChapterFormGroup(index: number): FormGroup {
		const chaptersForm = this.courseEditForm.get("chapters") as FormArray;
		const formGroup = chaptersForm.controls[index] as FormGroup;
		return formGroup;
	}


	getVideosList(i: number){
		const chapterList = this.courseEditForm.get('chapters') as FormArray;
		const videosList = chapterList.at(i).get("videos") as FormArray;
		return videosList;
	}

	getVideoFormGroup(i: number, r:number): FormGroup {
		const chapterList = this.courseEditForm.get('chapters') as FormArray;
		const videosList = chapterList.at(i).get("videos") as FormArray;
		const formGroup = videosList.controls[r] as FormGroup;
		return formGroup;
	}


	getAttachmentList(i: number, r:number){
		const chapterList = this.courseEditForm.get('chapters') as FormArray;
		const videosList = chapterList.at(i).get("videos") as FormArray;
		const attachmentList = videosList.at(r).get("attachments") as FormArray;
		return attachmentList;
	}

	ngOnInit() {
		if (this.courseListingId) {
			this.api
				.get("course/courselisting/" + this.courseListingId)
				.subscribe(
					(result: any) => {
						const key = Object.keys(result.data)[0];
						this.course = new Course(result.data[key]);
						this.isLoaded = true;
						// this.organization = new Organization(result.data, 'full');
						this.createCourseEditForm(this.course);

					},
					(error: any) => {
						this.log.error(
							"Error getting organizations. " + error.message
						);
					}
				);
		}
	}

	changeVideoUploadListener($event, i: number, j: number): void {
		this.readFile($event.target, i, j, null, "mediaUpload", 'mpeg|mpg|mp4|mkv');
	}

	changeVideoImageUploadListener($event, i: number, j: number): void {
		this.readFile($event.target, i, j, null, "imageUpload", 'gif|jpg|jpeg|png');
	}

	changeCaptionUploadListener($event, i: number, j: number): void {
		this.readFile($event.target, i, j, null, "captionFileUpload", 'vtt');
	}

	changeAudioUploadListener($event, i: number, j: number): void {
		this.readFile($event.target, i, j, null, "audioFileUpload", 'mp3');
	}

	changeAttachmentUploadListener($event, i: number, j: number, r: number): void {
		// console.log(i);
		// console.log(j);
		// console.log(r);
		this.readFile($event.target, i, j, r, "attachments", 'pdf');
	}

	readFile(
		inputValue: any,
		i: number,
		j: number,
		r: number,
		keyFileName: string,
		allowedTypes: string = "gif|jpg|jpeg|png|mpeg|mpg|mp4|mkv|vtt|mp3|pdf"
	): void {
		var file: File = inputValue.files[0];
		inputValue.files[0];
		let fileName = inputValue.files[0].name;
		var reader: FileReader = new FileReader();
		const extPattern = new RegExp(`\.(${allowedTypes})$`, "i");

		if (extPattern.test(fileName)) {
			reader.onloadend = (e) => {
				if (r !== null) {
					// this.course.chapters[i].videos[j][`${keyFileName}`][r]['fileUpload'] = reader.result;
					// this.course.chapters[i].videos[j][`${keyFileName}`][r]['fileFilename'] = fileName;

					const chapterList = this.courseEditForm.get('chapters') as FormArray;
					const videosList = chapterList.at(i).get("videos") as FormArray;
					const attachmentList = videosList.at(j).get(`${keyFileName}`) as FormArray;
					const uploadItem = attachmentList.at(r) as FormGroup;

					uploadItem.patchValue({
						attachment: reader.result,
						filePath: fileName,
					});
				}
				else {
					const chapterList = this.courseEditForm.get('chapters') as FormArray;
					const videosList = chapterList.at(i).get("videos") as FormArray;
					const uploadItem = videosList.at(j).get(`${keyFileName}`) as FormGroup;

					uploadItem.patchValue({
						fileUpload: reader.result,
						fileFilename: fileName,
					});
					// this.course.chapters[i].videos[j][`${keyFileName}`]['fileUpload'] = reader.result;
					// this.course.chapters[i].videos[j][`${keyFileName}`]['fileFilename'] = fileName;
				}
			};
		} else {
			this.modalService.showAlert(
				"Error",
				`The extension is invalid. Valid extension(s) are: ${allowedTypes}`
			);
			inputValue.value = "";
		}

		reader.readAsDataURL(file);
	}

	doSave() {
		this.course = new Course(this.courseEditForm.value);

		this.submitButtonPressed = true;

		if(!this.courseEditForm.valid){
			return;
		}

		this.errors = "";

		if (
			!this.course.chapters ||
			this.course.chapters.length === 0
		) {
			this.errors = "The course needs atleast one chapter";
			return;
		} else {
			let j = 1;
			this.course.chapters.forEach((chapter) => {
				// if (!chapter.name) {
				// 	errors += `Chapter name ${j} missing<br>`;
				// 	return;
				// }

				if (!chapter.videos || chapter.videos.length === 0) {
					this.errors = "The chapter needs at least one video lesson";
					return;
				} else {
					var i = 1;
					chapter.videos.forEach((video) => {
						if (!video.label) {
							this.errors = `Video title ${i} missing`;
							return;
						}

						if (!video.label && !video.audioFile) {
							this.errors +=
								`Either a video file or an audio file for entry ${i} is mandatory`;
							return;
						}
						i++;
					});
					j++;
				}
			});
		}

		if (this.errors) {
			// errors = "The following errors were found:<br>" + errors;
			// this.modalService.showAlert("Error", errors);
			return;
		}
		this.log.debug('course ouput');
		this.log.debug(Course.forAPI(this.course));
		if (this.mode === "update") {
			this.api
				.put(
					"course/courselisting/" + this.courseListingId,
					Course.forAPI(this.course),
					true
				)
				.subscribe(
					(data: any) => {
						this.modalService.showAlert(
							"Success",
							"Course has been updated"
						);
						this.dialogRef.close(this.course);
					},
					(error: any) => {
						this.modalService.showAlert(
							"Error",
							"Something went wrong. " + error.message
						);
					}
				);
		} else {
			this.api
				.post(
					"course/courselisting",
					Course.forAPI(this.course),
					true
				)
				.subscribe(
					(data: any) => {
						this.modalService.showAlert(
							"Success",
							"Course has been created"
						);
						this.dialogRef.close();
					},
					(error: any) => {
						this.modalService.showAlert(
							"Error",
							"Something went wrong. " + error.message
						);
					}
				);
		}
	}

	addCourseItem(data: any) {
		this.course.chapters.push(new Chapter({}));

		const chapterList = this.courseEditForm.get('chapters') as FormArray;
		chapterList.push(this.createChapterList(data));

		if(data.videos){
			data.videos.forEach((video: any) => {
				this.addVideo(chapterList.length - 1, video);
			});
		}
	}

	createChapterList(data: any): FormGroup {
		return this.formBuilder.group({
				id: [data.id || null],
				name: [data.name || "", [Validators.required]],
				description: [data.description || ""],
				label: [data.label || ""],
				length: [data.length || ""],
				order: [data.order || 0],
				isActive: [data.isActive || 0],
				code: [data.code || ""],
				videos: this.formBuilder.array([]),
			});
	}

	onRemoveCourseItem(i: number, data:any) {
		this.course.chapters.splice(i, 1);
		const chapterList = this.courseEditForm.get('chapters') as FormArray;
		chapterList.removeAt(i);
	}

	addVideo(i: number, data:any) {
		// this.course.chapters[i].videos.push(new Video({}));

		const chapterList = this.courseEditForm.get('chapters') as FormArray;
		const videosList = chapterList.at(i).get("videos") as FormArray;
		videosList.push(this.createVideoList(data));
	}

	createVideoList(data:any){
		const videoList = this.formBuilder.group({
			id: [data.id || null],
			label: [data.label || "", [Validators.required]],
			length: [data.length || ""],
			image: [data.image || ""],
			media: [data.media || ""],
			captionFile: [data.captionFile || ""],
			audioFile: [data.audioFile || ""],
			forceVideo: [data.forceVideo || ""],
			description: [data.description || ""],
			isCompleted: [data.isCompleted || false],
			attachments: this.formBuilder.array([]),
			imageUpload: this.createFileUpload({}),
			mediaUpload: this.createFileUpload({}),
			captionFileUpload: this.createFileUpload({}),
			audioFileUpload: this.createFileUpload({}),
		});

		const attachmentList = videoList.controls.attachments as FormArray;

		if(data && data.attachments){
			data.attachments.forEach((attachment: any) => {
				attachmentList.push(this.createAttachment(attachment));
			});
		}
		return videoList;
	}

	createAttachment(data: any){
		return this.formBuilder.group({
			id: [data.id || null],
			title: [data.title || ""],
			attachment: [data.attachment || ""],
			fileUpload: [data.fileUpload || ""],
			fileFilename: [data.fileFilename || ""],
			filePath: [data.filePath || ""],
			fileFullPath: [data.fileFullPath || ""],
		});
	}

	removeVideo(i: number, j: number) {
		this.course.chapters[i].videos.splice(j, 1);
	}

	addVideoAttachment(i: number, j: number, data: any) {
		// this.course.chapters[i].videos[j].attachments.push(new Attachment({}));

		const chapterList = this.courseEditForm.get('chapters') as FormArray;
		const videosList = chapterList.at(i).get("videos") as FormArray;
		const attachmentList = videosList.at(j).get("attachments") as FormArray;
		attachmentList.push(this.createAttachment(data));
	}

	createFileUpload(data: any){
		return this.formBuilder.group({
			fileUpload: [data.fileUpload || null],
			fileFilename: [data.fileFilename || ""],
		});
	}

	onClose() {
		this.dialogRef.close();
	}


}
