import { Component, OnInit } from '@angular/core';
import { User } from '../../../app/models/user';
import { Assessment } from '../../../app/models/assessment';
import { Organization } from '../../../app/models/organization';
import { UserService } from '../../../app/lib/user.service';
import { ApiService } from '../../../app/lib/api.service';
import { LogService } from '../../../app/lib/log.service';
import { ModalService } from '../../../app/lib/modal.service';
import { ResourcesComponent } from '../../components/resources/resources.component';
import { ResourcesEditModal } from '../../components/resources-edit-modal/resources-edit-modal.component';

declare var window;

@Component({
	selector: 'page-resources',
	templateUrl: 'resources.html',
	styleUrls: ['./resources.scss'],

})
export class ResourcesPage implements OnInit {

	images: Array<string> = ['education', 'financial', 'stop-violence', 'stormhead', 'health', 'safety', 'emergency' ];
	user: User;
	resources: string;
	organization: Organization;
	assessment: Assessment;
	isLoaded: boolean = false;
	loadedCount: number = 0;
	loaded: boolean;
	ptsd: boolean = false;
	highestLevel: number;
	stepMapping: any = [[]];
	currentLevelMap: any;
	assessmentsExists: boolean = false;

	constructor(
		private userService: UserService,
		private log: LogService,
		private api: ApiService,
		private modalService: ModalService
	) {
		this.loaded = false;
		this.user = this.userService.getUser();

	}

	ngOnInit() {
		this.api.get('organizations/' + this.user.primaryOrganization.id).subscribe(
			(result: any) => {
				if(!result.data.resourceSet){
					result.data.resourceSet = [];
				}
				this.organization = new Organization(result.data, 'view');
				this.loadedCount++
				this.api.get('assessments/lastassessment', {Type: 'resilience'}).subscribe(
					(result: any) => {
						this.assessment = new Assessment(result.data);
						this.loadedCount++;
						this.loaded = true;
					},
					(error: any) => {
						this.log.error('Error getting assessment. ' + error.message);
						this.assessmentsExists = false;
						this.loadedCount++;
						this.loaded = true;
					},
					() => {

					});
			},
			(error: any) => {
				this.log.error('Error getting organization. ' + error.message);
				this.loadedCount++;
				this.loaded = true;
			},
			() => {

			});


	}

	onGoTo(i) {
		let resourceSet = this.organization.resourceSet[i];
		this.modalService.showComponent(ResourcesComponent, resourceSet);
	}

	onEdit() {
		this.modalService.setCloseOnClickAway(false);
		const modal = this.modalService.showComponent(ResourcesEditModal, this.organization.id);
	}

}
