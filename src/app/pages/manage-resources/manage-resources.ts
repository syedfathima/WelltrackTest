import { Component, OnInit } from '@angular/core';
import { User } from '../../../app/models/user';
import { Assessment } from '../../../app/models/assessment';
import { Organization } from '../../../app/models/organization';
import { UserService } from '../../../app/lib/user.service';
import { ApiService } from '../../../app/lib/api.service';
import { LogService } from '../../../app/lib/log.service';
import { ModalService } from '../../../app/lib/modal.service';
import { StorageService } from '../../../app/lib/storage.service';
import { ResourcesComponent } from '../../components/resources/resources.component';

declare var window;



export interface PeriodicElement {
	name: string;
	position: number;
	weight: number;
	symbol: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
	{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
	{position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
	{position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
	{position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
	{position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
	{position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
	{position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
	{position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
	{position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
	{position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

@Component({
	selector: 'page-manage-resources',
	templateUrl: 'manage-resources.html',
	styleUrls: ['./manage-resources.scss'],

})
export class ManageResourcesPage implements OnInit {

	user: User;
	from: Date;
	to: Date;
	organization: Organization;
	organizations: Organization[];
	isLoaded: boolean = false;
	role: string = '';
	orgId: any;
	resourceGroups: any;


	constructor(
		private userService: UserService,
		private log: LogService,
		private api: ApiService,
		private modal: ModalService,
		private storage: StorageService
	) {
		this.user = this.userService.getUser();
		this.role = this.user.userType;

		if (this.role == 'orgadmin') {
			if (this.storage.get('orgselect')) {
				this.orgId = this.storage.get('orgselect')
			}
			else {
				this.user.primaryOrganization;
				this.orgId = this.user.primaryOrganization.id;
			}
		}
	
	}

	ngOnInit() {
		/*
		* Get all organizations for selector
		*/
		if (this.role == 'admin') {

			this.api.get('admin/organizations').subscribe(
				(results: any) => {
					this.organizations = Organization.initializeArray(results.data);
					this.isLoaded = true;
				},
				(error: any) => {

					this.log.error('Error loading. ' + error.message);

				}
			);
		}
		else {

			this.api.get('organizations/' + this.orgId).subscribe(
				(result: any) => {
					this.organization = new Organization(result.data, 'view');
					this.log.debug(this.organization);
					this.isLoaded = true;
				},
				(error: any) => {
					this.log.error('Error getting organizations. ' + error.message);
				},
				() => {
				});

			this.api.get('organizations/resources', { 'OrgID': this.orgId }).subscribe(
				(result: any) => {
					this.log.debug('resources');
					this.log.debug(result.data);
					this.resourceGroups = result.data;
					this.isLoaded = true;
				},
				(error: any) => {
					this.log.error('Error getting resources. ' + error.message);
				},
				() => {
				});
		}

	}

	questionDefined(questionAnswer){
		return typeof(questionAnswer) !== undefined; 
	}


}
