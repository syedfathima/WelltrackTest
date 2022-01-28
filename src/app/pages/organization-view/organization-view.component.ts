import { Component, OnInit, OnDestroy, OnChanges, } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { Organization } from '../../models/organization';
import { ModalService } from '../../lib/modal.service';
import { Invite } from '../../components/invite/invite';
import { AccessCodeComponent } from '../../components/admin/access-code/access-code.component';
import { OrganizationAdminEditComponent } from '../../components/admin/organization-admin-edit/organization-admin-edit.component';
import { CreateDemoUser } from '../../components/admin/create-demo-user/create-demo-user.component';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

@Component({
	selector: 'page-organization-view.component',
	templateUrl: 'organization-view.component.html',
	styleUrls: ['./organization-view.component.scss']
})
export class OrganizationViewPage implements OnInit, OnDestroy {
	id: number;
	user: User;
	organization: Organization = <any>{};
	logoPath: string = '';
	popups: any[];
	isAdmin = false;
	default: any;
	placeholders: any;
	paramsSub: any;
	activeTab: string;
	tabs = ['stats', 'activity', 'members', 'accesscodes', 'challenges'];
	tabIndex: number;
	users: User[];
	professionals: User[];
	jointprofessionals: User[];
	executives: User[];
	executiveprofessionals: User[];
	accesscodes: Array<Object>;
	invites: Array<Object>;
	isloaded: boolean = false;
	isloadedCount: number = 0;
	callCount: number = 8;
	accesscodelink: string = '';
	subdomainlink: string = '';
	isLoading:boolean = false;
	isActivityTabEnabled: boolean = false;
	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private modalService: ModalService,
		private log: LogService,
		private userService: UserService,
		private translate: TranslateService,
		private activatedRoute: ActivatedRoute
	) {
		this.user = this.userService.getUser();
		this.activeTab = 'stats';
	}

	ngOnInit() {
		this.isLoading = true;
		this.translate.stream('organizationInfo').subscribe((res: any) => {
			this.default = res.default;
			this.placeholders = res.placeholders;
			this.popups = res.popups;
		});

		this.activatedRoute.params.subscribe((params: Params) => {
			this.id = parseInt(params['id'], 10);
			this.storage.set('orgId', this.id, false);
		});

		this.api.get('organizations/' + this.id).subscribe(
			(result: any) => {
				this.organization = new Organization(result.data);
				if (this.organization.logo) {
					this.logoPath = this.organization.id + '/logos/' + this.organization.logo;
				}
				if (this.organization.subdomain) {
					this.subdomainlink = 'https://' + this.organization.subdomain + '.welltrack.com/register';
				}
				else {
					this.subdomainlink = 'https://app.welltrack.com/register';
				}

				this.id = this.organization.id;
				this.isLoading = true;
			},
			(error: any) => {
				this.log.error('Error getting organizations. ' + error.message);
				this.isLoading = false;
			},
			() => {
				this.isLoading = false;
			});
	}

	

	onFetch(tabId) {
		if(tabId === 'members') {
			this.isLoading = true;
			this.api.get('admin/usersfromorg', { 'OrgID': this.id, 'Type': 1 }).subscribe(
				(result: any) => {
					this.users = User.initializeArray(result.data);
				},
				(error: any) => {
					this.log.error('Error getting users. ' + error.message);
				},
				() => {
	
				});
	
			this.api.get('admin/usersfromorg', { 'OrgID': this.id, 'Type': 2 }).subscribe(
				(result: any) => {
					this.professionals = User.initializeArray(result.data);
				},
				(error: any) => {
					this.log.error('Error getting users. ' + error.message);
				},
				() => {
				});
	
			this.api.get('admin/usersfromorg', { 'OrgID': this.id, 'Type': 3 }).subscribe(
				(result: any) => {
					this.executives = User.initializeArray(result.data);
				},
				(error: any) => {
					this.log.error('Error getting users. ' + error.message);
				},
				() => {
				});
	
			this.api.get('admin/usersfromorg', { 'OrgID': this.id, 'Type': 4 }).subscribe(
				(result: any) => {
					this.executiveprofessionals = User.initializeArray(result.data);
				},
				(error: any) => {
					this.log.error('Error getting users. ' + error.message);
				},
				() => {
				});
	
			this.api.get('admin/usersfromorg', { 'OrgID': this.id, 'Type': 5 }).subscribe(
				(result: any) => {
					this.jointprofessionals = User.initializeArray(result.data);
				},
				(error: any) => {
					this.log.error('Error getting users. ' + error.message);
				},
				() => {
				});

			this.api.get('admin/invites', { 'OrgID': this.id }).subscribe(
				(result: any) => {
					this.invites = result.data;
					this.isloaded = true;
				},
				(error: any) => {
					this.log.error('Error getting users. ' + error.message);
					this.isloadedCount++;
				},
				() => {
					this.isloadedCount++;
				});
				this.isLoading = false;
		}

		if(tabId === 'accesscodes') {
		   this.api.get('admin/accesscodes', { 'OrgID': this.id }).subscribe(
				(result: any) => {
					this.accesscodes = result.data;

					if (this.accesscodes[0]) {
						this.accesscodelink = 'https://app.welltrack.com/?accesscode=' + this.accesscodes[0]['Code'];
					}
				},
				(error: any) => {
					this.log.error('Error getting users. ' + error.message);
					this.isloadedCount++;
				},
				() => {
					this.isloadedCount++;
				});
		}

		if(tabId === 'activity') {
			this.isActivityTabEnabled = true;
		}
	}


	ngOnDestroy() {
		if (this.paramsSub) {
			//this.paramsSub.unsubscribe();
		}
	}

	isTabActive(tabId) {
		return (tabId === this.activeTab);
	}

	onChangeTab(tabId) {
		this.tabIndex = _.indexOf(this.tabs, tabId);
		this.activeTab = tabId;
		this.onFetch(tabId)
	}

	createAccessCode() {
		this.modalService.setCloseOnClickAway(false);
		this.modalService.showComponent(AccessCodeComponent, this.organization);
	}

	onDeleteAccessCode(i) {
		this.modalService.showConfirmation("Delete", 'Are you sure you want to remove this access code').afterClosed().subscribe(result => {
			if (result) {
				let code = this.accesscodes[i];
				this.api.delete('admin/deleteaccesscode/' + code['ID']).subscribe(
					(result: any) => {
						this.accesscodes.splice(i, 1);
					},
					(error: any) => {
						this.log.error('Error getting users. ' + error.message);
					},
					() => {


					});
			}
		});
	}

	getInvites(){
		this.api.get('admin/invites', { 'OrgID': this.id }).subscribe(
			(result: any) => {
				this.invites = result.data;
				this.isloaded = true;
			},
			(error: any) => {
				this.log.error('Error getting users. ' + error.message);
				this.isloadedCount++;
			});
	}

	showInvite(inviteType: string) {
		let inviteInfo;
		let orgId
		if (this.id) {
			orgId = this.id;
		}
		else {
			orgId = this.storage.get('orgId')
		}

		if (inviteType == 'executiveprofessional') {
			inviteInfo = {
				'type': 'admin',
				'endpoint': 'adminexecutiveprofessional',
				'orgId': orgId
			};
		}
		else if (inviteType == 'executive') {
			inviteInfo = {
				'type': 'admin',
				'endpoint': 'adminexecutive',
				'orgId': orgId
			};
		}
		else if (inviteType == 'professional') {
			inviteInfo = {
				'type': 'admin',
				'endpoint': 'adminprofessional',
				'orgId': orgId
			};
		}
		else if (inviteType == 'jointprofessional') {
			inviteInfo = {
				'type': 'admin',
				'endpoint': 'adminjointprofessional',
				'orgId': orgId
			};
		}
		else if (inviteType == 'user') {
			inviteInfo = {
				'type': 'admin',
				'endpoint': 'userinvite',
				'orgId': orgId
			};
		}
		const modal = this.modalService.showComponent(Invite, inviteInfo);

		modal.beforeClosed().subscribe((data:any) => {
			this.getInvites();
		});

	}

	editOrganization() {
		this.modalService.setCloseonClick(false);
		this.modalService.showComponent(OrganizationAdminEditComponent, this.organization.id);
	}

	doRemoveInvite(id) {
		this.api.delete('admin/deleteinvite/' + id).subscribe(
			(data: any) => {
				this.modalService.showAlert('Success', 'Invite has been deleted');
				let index = this.invites.findIndex((invite: any) => { return invite.ID == id; });
				this.invites.splice(index, 1);
			},
			(error: any) => {
				this.modalService.showAlert('Error', 'Something went wrong. Please try again');
			}
		);
	}

	doResend(id) {
		this.api.post('admin/resendinvite', { ID: id }).subscribe(
			(data: any) => {
				this.modalService.showAlert('Success', 'Invite has been resent');
			},
			(error: any) => {
				this.modalService.showAlert('Error', 'Something went wrong. Please try again');
			}
		);
	}

	createDemoUser(){
		this.modalService.setCloseonClick(false);
		this.modalService.showComponent(CreateDemoUser, this.organization);
	}

}
