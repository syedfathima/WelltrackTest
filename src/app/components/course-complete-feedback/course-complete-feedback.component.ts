import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { Course } from '../../models/course';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { ModalService } from '../../lib/modal.service';
import { ApiService } from '../../lib/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var window;

@Component({
	selector: 'course-feedback',
	templateUrl: 'course-complete-feedback.component.html'
})

export class CourseCompleteFeedbackComponent implements OnInit {

	user: User;
	ratingRows: any;
	rating: number = -1;
	helpful: boolean;
	courseId: number;
	course: Course;
	showNext: boolean;
	submitted: boolean;
	@Output() ratingChange: EventEmitter<number> = new EventEmitter();

	constructor(
		private userService: UserService,
		private api: ApiService,
		private modalService: ModalService,
		public dialogRef: MatDialogRef<CourseCompleteFeedbackComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.submitted = false;
		this.user = this.userService.getUser();
		this.course = data.data;
	}

	ngOnInit() {
		this.ratingRows = [
			5, 4, 3, 2, 1, 0
		];
	}

	rate(index: number) {
		this.rating = index;
		this.ratingChange.emit(this.rating);
	}

	getActive(index: number) {

		if (index <= this.rating) {
			return true;
		}
		else {
			return false;
		}

	}

	doSave() {

		if (!this.helpful) {
			this.modalService.showAlert('Error', 'Please choose an option.');
			return;
		}

		this.api.post('course/feedbackcourse', {
			helpful: this.helpful,
			courseId: this.course.id
		}).subscribe(
			(result: any) => {
				this.modalService.showAlert('Success', 'Your feedback has been received. Thank you.');
				this.dialogRef.close(true);
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
