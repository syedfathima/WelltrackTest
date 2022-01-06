import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { Router } from '@angular/router';
import { ModalService } from '../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { Assessment } from '../../models/assessment';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { AssessmentResilienceAlert } from '../assessment-resilience-alert/assessment-resilience-alert';
import { AssessmentCoreContributorAlert }  from '../assessment-core-contributor-alert/assessment-core-contributor-alert';

import * as _ from 'lodash';

@Component({
	selector: 'resilience-listing',
	templateUrl: 'resilience-listing.component.html',
	styleUrls: ['./resilience-listing.component.scss']
})
export class ResilienceListingComponent implements OnInit {

	title: string;
	back: string;
	alerts: string;
	loggedInUser: User;
	@Input() user: User;
	@Input() assessments: Assessment[];
	showPtsd: boolean = false;

	constructor(private api: ApiService,
		private log: LogService,
		private storage: StorageService,
		private translate: TranslateService,
		private modalService: ModalService,
		private userService: UserService
	) {
		this.loggedInUser = this.userService.getUser();
	}

	ngOnInit() {
		this.translate.stream('das').subscribe((res: any) => {
			this.title = res.title;
			this.back = res.back;
		});

	}

	showAlerts(i) {
		let assessment = this.assessments[i];
		this.modalService.showComponent(AssessmentResilienceAlert, assessment);
	}

	showCoreContributors(i){
		let assessment = this.assessments[i];
		this.modalService.showComponent(AssessmentCoreContributorAlert, assessment);
	}

	delete(userQuizId) {
		this.modalService.showConfirmation("Delete", "Are you sure you want to delete your assessment?").afterClosed().subscribe(result => {
			if (result) {
				this.api.delete('assessment/' + userQuizId).subscribe(
					(result: any) => {
						let index = _.findIndex(this.assessments, { userQuizId: userQuizId });
						this.assessments.splice(index, 1);
					},
					(error: any) => {
						this.log.error('Error deleting.');
					}
				);
			}
		});
	}
}
