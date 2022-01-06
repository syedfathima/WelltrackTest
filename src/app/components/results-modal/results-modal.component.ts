import { Component, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { StorageService } from '../../lib/storage.service';
import { AuthService } from '../../lib/auth.service';

import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
	selector: 'page-results',
	templateUrl: 'results-modal.component.html',
	styleUrls: ['./results-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ResultsComponent {
	score: number;

	constructor(
		public storage: StorageService,
		public auth: AuthService,
		private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any,
   		public dialogRef: MatDialogRef<ResultsComponent>,
	) {
		//using closeClassName to pass data in and out of the modal. kind of a hack.
		this.score = data.data;

	}

	onFinish() {
		//mark the tutorial as finished
		this.dialogRef.close();
		this.router.navigate(['/app/practice']);
	}
}
