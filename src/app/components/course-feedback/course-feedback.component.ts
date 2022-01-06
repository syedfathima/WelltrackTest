import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { LogService } from '../../lib/log.service';
import { ModalService } from '../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../lib/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var window;

@Component({
	selector: 'course-feedback',
	templateUrl: 'course-feedback.component.html',
	styleUrls: ['./course-feedback.component.scss']
})

export class CourseFeedbackComponent implements OnInit {

	user: User;
	ratingRows: any;
	rating: number = -1;
	helpful: boolean;
	courseId: number;
	video: any;
	showNext: boolean;
	submitted: boolean;
	showSuccess: boolean;

	constructor(
		private userService: UserService,
		private log: LogService,
		private modalService: ModalService,
		private translate: TranslateService,
		private api: ApiService,
		public dialogRef: MatDialogRef<CourseFeedbackComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.user = this.userService.getUser();
		this.video = data.data.video;
		this.showNext = data.data.showNext;
		this.showSuccess = data.data.showSuccess;

		if (this.showSuccess === undefined) {
			this.showSuccess = true;
		}
	}

	ngOnInit() {

		this.ratingRows = [
			5, 4, 3, 2, 1, 0
		];
	}

	doSave() {

		if (!this.helpful) {
			this.modalService.showAlert('Error', 'Please fill out all required fields');
			return;
		}

		this.api.post('course/feedback', {
			helpful: this.helpful,
			courseMenuId: this.video.id
		}).subscribe(
			(result: any) => {
				this.dialogRef.close(true);
				if (this.showSuccess) {
					this.modalService.showAlert('Success', 'The information has been saved. Thank you.');
				}
			},
			(error: any) => {
				this.modalService.showAlert('Error', 'There was an error saving the information. Please try again later');
			},
			() => {

			});
	}
	onClose() {
		this.dialogRef.close(true);
	}

}
