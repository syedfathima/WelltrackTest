import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { User } from '../../models/user';
import { Assessment } from '../../models/assessment';
import { UserService } from '../../lib/user.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'assessment-resilience-alert',
	templateUrl: 'assessment-resilience-alert.html',
	styleUrls: ['./assessment-resilience-alert.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AssessmentResilienceAlert implements OnInit {
	type: string;
	message: string;
	email: string;
	success = false;
	share = true;
	user: User;
	assessment: Assessment;
	enableResources: boolean;
	resiliencyLevel: string;
	resiliencyDescription: string;

	finish: boolean;
	buttonText: string;
	quizType: string;
	alert: boolean; 
	cdkScrollable
	constructor(
		public dialogRef: MatDialogRef<AssessmentResilienceAlert>,
		private userService: UserService,
		private translate: TranslateService,
		private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.user = this.userService.getUser();
		this.assessment = data.data;

		this.translate.get('resilience').subscribe((res: any) => {
			if (this.assessment.score / 6 <= 2.99) {
				this.resiliencyLevel = res.alert.titles.reactive;
				this.resiliencyDescription = res.alert.descriptions.reactive;
				this.alert = true; 
			} else if (this.assessment.score / 6 <= 4.30) {
				this.resiliencyLevel = res.alert.titles.inthemoment;
				this.resiliencyDescription = res.alert.descriptions.inthemoment;
				this.alert = false; 
			} else if (this.assessment.score / 6 <= 5.00) {
				this.resiliencyLevel = res.alert.titles.proactive;
				this.resiliencyDescription = res.alert.descriptions.proactive;
				this.alert = false; 
			} else {
				this.resiliencyLevel = res.alert.titles.reactive;
				this.resiliencyDescription = res.alert.descriptions.reactive;
				this.alert = true; 
			}
		});

		if (this.user.primaryOrganization && this.user.primaryOrganization.enableResources) {
			this.enableResources = this.user.primaryOrganization.enableResources;
		}
	}

	ngOnInit() {
		this.quizType = this.assessment.type;
		this.finish = true;
	}

	close() {
		if (this.router.url.search('listing') !== -1) {
			this.dialogRef.close();
		} else {
			this.dialogRef.close();
			this.router.navigateByUrl('/app/corecontributors');
		}
	}

	goResources() {
		this.dialogRef.close();
		this.router.navigateByUrl('/app/corecontributors');
	}
}
