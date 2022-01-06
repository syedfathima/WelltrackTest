import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Assessment } from '../../models/assessment';
import { Organization } from '../../models/organization';
import { UserService } from '../../lib/user.service';
import { ApiService } from '../../lib/api.service';
import { LogService } from '../../lib/log.service';
import { ModalService } from '../../lib/modal.service';
import { ResourcesComponent } from '../../components/resources/resources.component';

declare var window;
import * as _ from 'lodash';

@Component({
	selector: 'page-corecontributors',
	templateUrl: 'corecontributors.html',
	styleUrls: ['./corecontributors.scss'],

})
export class CoreContributorsPage implements OnInit {

	user: User;
	resources: string;
	organization: Organization;
	assessment: Assessment;
	isLoaded: boolean = false;
	loadedCount: number = 0;
	highestLevel: number;
	stepMapping: any = [[]];
	currentLevelMap: any;
	enabledRanks: Array<number>;
	titleStr: string;

	constructor(
		private userService: UserService,
		private log: LogService,
		private api: ApiService,
		private modalService: ModalService
	) {
		this.user = this.userService.getUser();
		this.enabledRanks = [];
	}

	ngOnInit() {
		if (this.user.primaryOrganization) {
			this.api.get('organizations/' + this.user.primaryOrganization.id).subscribe(
				(result: any) => {
					this.organization = new Organization(result.data, 'view');
					this.loadedCount++
					this.api.get('assessments/lastassessment', { Type: 'resilience' }).subscribe(
						(result: any) => {
							this.assessment = new Assessment(result.data);
							this.loadedCount++
			
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

						
						},
						(error: any) => {
							this.log.error('Error getting assessment. ' + error.message);
							this.loadedCount++
						},
						() => {

						});
				},
				(error: any) => {
					this.log.error('Error getting organization. ' + error.message);
					this.loadedCount++
				},
				() => {

				});
		}
	}

	onGoTo(i) {
		let resourceSet = this.organization.resourceSet[i]; 
		this.modalService.showComponent(ResourcesComponent, resourceSet);
	}

}
