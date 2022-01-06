import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { User } from '../../models/user';
import { Assessment } from '../../models/assessment';
import { UserService } from '../../lib/user.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../lib/api.service';

import * as _ from 'lodash';
import { Organization } from 'app/models/organization';

@Component({
	selector: 'assessment-core-contributor-alert',
	templateUrl: 'assessment-core-contributor-alert.html',
	styleUrls: ['./assessment-core-contributor-alert.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AssessmentCoreContributorAlert implements OnInit {
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
	organization: Organization;

	finish: boolean;
	buttonText: string;
	quizType: string;
	alert: boolean;
	enabledRanks: Array<number>;
	titleStr: string;
	show: boolean;
	cdkScrollable
	constructor(
		public dialogRef: MatDialogRef<AssessmentCoreContributorAlert>,
		private userService: UserService,
		private apiService: ApiService,
		private translate: TranslateService,
		private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.show = false;
		this.user = this.userService.getUser();
		this.assessment = data.data;

		this.enabledRanks = [];

		if (this.user.primaryOrganization && this.user.primaryOrganization.enableResources) {
			this.enableResources = this.user.primaryOrganization.enableResources;
		}
	}

	ngOnInit() {
		this.apiService.get('organizations/' + this.user.primaryOrganization.id).subscribe(
			(result: any) => {
				this.organization = new Organization(result.data, 'view');
				if (this.organization) {
			
					let ranks = [
						{ 'rank': 1, 'value': this.assessment.rank1, 'enable': false },
						{ 'rank': 2, 'value': this.assessment.rank2, 'enable': false },
						{ 'rank': 3, 'value': this.assessment.rank3, 'enable': false },
						{ 'rank': 4, 'value': this.assessment.rank4, 'enable': false },
						{ 'rank': 5, 'value': this.assessment.rank5, 'enable': false },
						{ 'rank': 6, 'value': this.assessment.rank6, 'enable': false }
					];
					
					ranks = _.orderBy(ranks, ['value'], ['desc']);
					let titles = [];
			
					for (let rank of ranks.slice(0, 3)) {
						this.enabledRanks.push(rank.rank);
						titles.push(this.organization.resourceSet[rank.rank - 1].title);
						this.titleStr = titles.slice(0, titles.length - 1).join(', ') + ' and, ' + titles[titles.length - 1];
					}
				
				}
				this.show = true;
			}
		);
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
