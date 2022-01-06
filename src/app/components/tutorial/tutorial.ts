import { Component, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { StorageService } from '../../lib/storage.service';
import { AuthService } from '../../lib/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
	selector: 'page-tutorial',
	templateUrl: 'tutorial.html',
	styleUrls: ['./tutorial.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TutorialPage {
	tutorial: string;
	showClose: boolean = true;

	constructor(
		public storage: StorageService,
		private router: Router,
		public auth: AuthService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<TutorialPage>, ) {
		this.tutorial = data.data || 'welcome';
	}

	onFinish() {
		//mark the tutorial as finished
		if (this.tutorial === 'assessment' || this.tutorial === 'practice') {
			this.storage.setReminder('reminder-' + this.tutorial, 10);
			this.dialogRef.close();
		} else {
			this.storage.setFlag('finished-tutorial-' + this.tutorial);
			this.dialogRef.close();
		}
	}

	onStartAssessment() {
		this.storage.setReminder('reminder-' + this.tutorial, 10);
		this.dialogRef.close();
		if (this.tutorial === 'assessmentforce') {
			this.router.navigate(['/app/assessments/das/new'], { queryParams: { forced: 1 } });
		} else {
			this.router.navigate(['/app/assessments/das/new']);
		}
	}

	onStartResilienceAssessment(){
		this.storage.setReminder('reminder-' + this.tutorial, 10);
		this.dialogRef.close();
		this.router.navigate(['/app/assessments/resilience/new'], { queryParams: { forced: 1 } });
	}

	onPractice() {
		this.storage.setReminder('reminder-' + this.tutorial, 10);
		this.dialogRef.close();
		this.router.navigate(['/app/practice']);
	}
}
