import { Component, ViewChild, ViewEncapsulation, OnInit,Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'answer-modal',
	templateUrl: 'answer-modal.component.html',
	styleUrls: ['./answer-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AnswerComponent implements OnInit{

	innerhtml: string;
	title: string;
	value: boolean;
	constructor(
		private translate: TranslateService,
		public dialogRef: MatDialogRef<AnswerComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		let answer = data.data;
		if (answer.value) {
			this.value = true;
		} else {
			this.value = false;
		}
		this.innerhtml = answer[answer.value];
	}

	ngOnInit() {
		this.translate.get('cdQuiz.popups.answer').subscribe((res: any) => {
	
			if (this.value) {
				this.title = res.right;
			} else {
				this.title = res.wrong;
			}
		});
	}

	onFinish() {
		//mark the tutorial as finished
		this.dialogRef.close();
	}
}
