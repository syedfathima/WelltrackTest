import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { User } from '../../models/user';
import { Assessment } from '../../models/assessment';
import { UserService } from '../../lib/user.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'page-assessment-alert',
	templateUrl: 'assessment-alert.html',
	styleUrls: ['./assessment-alert.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AssessmentAlert implements OnInit {
	type: string;
	message: string;
	email: string;
	success = false;
	share = true;
	user: User;
	assessment: Assessment;
	stresstitle: string;
	depressiontitle: string;
	anxietytitle: string;
	anxietylevel: number;
	depressionlevel: number;
	stresslevel: number;
	intrusive: number;
	avoidance: number;
	hyperarousal: number;
	ptsd: number;
	ptsdalert: boolean = false;
	ptsdtitle: string;
	ptsdbody: string;
	ptsdlevels: any;
	finish: boolean;
	showdas: boolean;
	enableResources: boolean = false;

	depressiondescription = 'Your depression level is ';
	anxietydescription = 'Your anxiety level is ';
	stressdescription = 'Your stress level is ';
	buttonText: string;
	quizType: string;
	cdkScrollable
	constructor(
		public dialogRef: MatDialogRef<AssessmentAlert>,
		private userService: UserService,
		private translate: TranslateService,
		private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.user = this.userService.getUser();
		this.assessment = data.data;
		this.translate.stream('das.result.ptsd.levels').subscribe((res: any) => {
			this.ptsdlevels = res;
		});

		if (this.user.primaryOrganization && this.user.primaryOrganization.enableResources) {
			this.enableResources = this.user.primaryOrganization.enableResources;
		}
	}

	ngOnInit() {
		this.quizType = this.assessment.type;
		if (this.quizType === 'ptsd') {
			this.finish = false;
			this.showdas = true;
			if (this.assessment.intrusive >= 1 && this.assessment.avoidance >= 3 && this.assessment.hyperarousal >= 2) {
				this.ptsdalert = true;
				this.ptsdtitle = this.ptsdlevels.hightitle;
				this.ptsdbody = this.ptsdlevels.highbody;
			} else {
				this.ptsdtitle = this.ptsdlevels.lowtitle;
				this.ptsdbody = this.ptsdlevels.lowbody;
			}
		} else {
			this.finish = true;
			this.showdas = true;
		}
		this.depressiontitle = this.assessment.depressionlevellabel;
		this.depressionlevel = this.assessment.depressionlevel;
		this.anxietytitle = this.assessment.anxietylevellabel;
		this.anxietylevel = this.assessment.anxietylevel;
		this.stresstitle = this.assessment.stresslevellabel;
		this.stresslevel = this.assessment.stresslevel;
		this.intrusive = this.assessment.intrusive
	}

	goNext() {
		this.showdas = false;
		this.finish = true;
	}

	close() {

		if (this.router.url.search('user-details') !== -1) {
			this.dialogRef.close();
			this.success = false;
		} else if (this.quizType === 'ptsd') {
			this.dialogRef.close();
			this.success = false;
			this.router.navigateByUrl('/app/resources');
		} else {
			this.dialogRef.close();
			this.success = false;
			this.router.navigateByUrl('/app/assessments/das/listing');
		}
	}

	goResources() {
		this.dialogRef.close();
		this.router.navigateByUrl('/app/resources');
	}
}
