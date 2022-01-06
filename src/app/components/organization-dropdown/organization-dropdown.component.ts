import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { Organization } from '../../models/organization';
import { ApiService } from '../../lib/api.service';
import { AuthService } from '../../lib/auth.service';
import { LogService } from '../../lib/log.service';
import { StorageService } from '../../lib/storage.service';
import { Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
	selector: 'organization-dropdown',
	templateUrl: 'organization-dropdown.component.html',
	styleUrls: ['./organization-dropdown.component.scss']
})
export class OrganizationDropdown {
	selected: number;
	displayed: boolean = false;
	user: User;
	organizations: Organization[] = [];
	isloaded = false;

	constructor(
		private storage: StorageService,
		private auth: AuthService,
		private api: ApiService,
		private log: LogService,
		private userService: UserService,
		private router: Router
	) {
		this.selected = 0;
		this.displayed = false;
		this.user = this.userService.getUser();
	}

	ngOnInit() {

		if (this.user.userType == 'orgadmin' || this.user.userType == 'professional') {
			this.api.get('organizations/children', { includeParent: true}).subscribe(
				(result: any) => {
					this.organizations = Organization.initializeArray(result.data);
					this.log.debug(this.organizations);
					this.isloaded = true;
					if(this.storage.get('orgselect')){
						let index =  _.findIndex(this.organizations, { id:  +this.storage.get('orgselect')});
						if(index !== -1){
							this.selected = index;
						}
						else{
							this.storage.set('orgselect', null, false);
						}
					}
				},
				(error: any) => {
					this.log.error('Error getting organizations. ' + error.message);
					if(this.storage.get('orgselect')){
						this.storage.set('orgselect', null, false);
						window.location.reload();
					}
				},
				() => {


				});
		}

	}

	select(value: number, orgId: number) {
		this.selected = value;
		this.storage.set('orgselect', orgId, false);
		window.location.reload();
	}

	display() {
		this.displayed = !this.displayed;
	}
}
