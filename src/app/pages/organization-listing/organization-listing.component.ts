import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { FileService } from '../../lib/file.service';
import { LogService } from '../../lib/log.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { Organization } from '../../models/organization';
import { ModalService } from '../../lib/modal.service';
import { Invite } from '../../components/invite/invite';
import { OrgAuthComponent } from '../../components/admin/org-auth/org-auth.component';
import { TranslateService } from '@ngx-translate/core';
import { OrganizationAdminEditComponent } from '../../components/admin/organization-admin-edit/organization-admin-edit.component'
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OrganizationCloneComponent } from '../../components/admin/organization-clone/organization-clone.component'

import * as _ from 'lodash';
import * as moment from 'moment'

@Component({
	selector: 'organization-listing.component',
	templateUrl: 'organization-listing.component.html',
	styleUrls: ['./organization-listing.scss'],
	animations: [
		trigger('detailExpand', [
			state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
			state('*', style({ height: '*', visibility: 'visible' })),
			transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class OrganizationListingPage implements OnInit {
	displayedColumns: string[] = ['Name', 'EntityID', 'ID', 'DownloadJson', 'DownloadText'];
	displayedColumnsResources: string[] = ['Name', 'Modify'];
	users: User[] = [];
	popup: any;
	organizations: Organization[];
	activeorganizations: Organization[];
	disabledOrganizations: Organization[];
	isLoaded: number = 0;
	settings: any;
	cols: any = [];
	disCols: any = [];
	organizationsAuth: Array<object>;
	organizationResources: Array<object>;

	constructor(
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
		private fileService: FileService,
		private translate: TranslateService
	) {
		this.cols.push('');
		this.cols.push('');
		this.disCols.push('');
		this.disCols.push('');
	}

	ngOnInit() {

		this.translate.stream('error').subscribe((res: any) => {
			this.popup = res;
		});

		this.loadMore();
		this.loadResourceOrgs();
		this.loadAuth();

	}
	inviteProfessional() {
		this.modalService.showComponent(Invite);
	}

	valueChange(i) {

		let filterValue = this.cols[i].toLowerCase();
		let empty = this.reset();

		let key = '';
		if (i == 0) {
			key = 'name';
		}
		else if (i == 1) {
			key = 'subdomain';
		}
		else {
			return;
		}


		if (!empty) {
			let cols = this.cols;
			this.activeorganizations = this.organizations.filter(org => org.active);
			let resp = _.filter(this.activeorganizations, function (o) {
				for (i = 0; i < cols.length; i++) {
					if (!o[key] || o[key].toLowerCase().search(filterValue) === -1) {
						return false;
					}
				}
				return true;
			});
			this.activeorganizations = resp;
		} else {
			this.activeorganizations = this.organizations.filter(org => org.active);
		}
	}

	disabledValueChange(i){
		let filterValue = this.disCols[i].toLowerCase();

		let key = '';
		if (i === 0) {
			key = 'name';
		}
		else if (i === 1) {
			key = 'subdomain';
		}
		else {
			return;
		}

		let cols = this.disCols;
		if(this.disCols[0] !== '' || this.disCols[1] !== ''){
			this.disabledOrganizations = this.organizations.filter(org => !org.active);
			let resp = _.filter(this.disabledOrganizations, function (o) {
				for (i = 0; i < cols.length; i++) {
					if (!o[key] || o[key].toLowerCase().search(filterValue) === -1) {
						return false;
					}
				}
				return true;
			});
			this.disabledOrganizations = resp;
		}else{
			this.disabledOrganizations = this.organizations.filter(org => !org.active);
		}
	}

	reset() {
		if (this.cols[0] === '' && this.cols[1] === '') {
			return true;
		} else {
			return false;
		}

	}

	doCreate() {
		this.modalService.setCloseOnClickAway(false);
		this.modalService.showComponent(OrganizationAdminEditComponent, null);
	}

	onEdit(id) {
		this.modalService.setCloseOnClickAway(false);
		const modal = this.modalService.showComponent(OrganizationAdminEditComponent, id);
		modal.beforeClosed().subscribe((data: any) => {
			if(data){
				const actIndex = this.activeorganizations.findIndex((org: Organization) => org.id === id);
				if(actIndex !== -1) {
					this.activeorganizations[actIndex] = {...this.activeorganizations[actIndex], ...data};
				} else {
					const disIndex = this.disabledOrganizations.findIndex((org: Organization) => org.id === id);
					if(disIndex !== -1){
						this.disabledOrganizations[disIndex] = {...this.disabledOrganizations[disIndex], ...data};
					}
				}
			}
		})
	}

	loadMore() {
		this.api.get('admin/organizations').subscribe(
			(results: any) => {
				this.organizations = Organization.initializeArray(results.data);
				this.activeorganizations = this.organizations.filter(org => org.active);
				this.disabledOrganizations = this.organizations.filter(org => !org.active); //.filter((org) => org.active === true);
				this.isLoaded++;
			},
			(error: any) => {
				this.log.error('Error loading. ' + error.message);

			}
		);

	}

	loadAuth() {
		this.api.get('admin/organizationsauth').subscribe(
			(results: any) => {
				this.organizationsAuth = results.data;
				this.log.debug(this.organizationsAuth);
				this.isLoaded++;
			},
			(error: any) => {


			}
		);
	}

	loadResourceOrgs() {
		this.api.get('admin/organizationsressources').subscribe(
			(results: any) => {
				this.isLoaded++;
				this.organizationResources = results.data;
			},
			(error: any) => {


			}
		);
	}

	onActivate(id: number, activate = true){
		const activateString = activate? "Activate": "Deactivate";

		this.modalService.showConfirmation(activateString, `Are you sure you want to ${activateString.toLowerCase()} the organization?`).afterClosed().subscribe((result) => {
			if(result){
				this.api.post('organizations/activate',  {
					OrgID: id,
					Active: activate? 1: 0
				  }).subscribe(
					(results: any) => {
						const index = _.findIndex(this.organizations, { id });
						this.organizations[index].active = activate;
						this.activeorganizations = this.organizations.filter(org => org.active);
						this.disabledOrganizations = this.organizations.filter((org) => !org.active);
					},
					(error: any) => {
						this.log.error('Error loading. ' + error.message);
		
					}
				);
			}
		});
	}

	onEditAuth(id) {
		const index = _.findIndex(this.organizationsAuth, { ID: id });
		this.modalService.showComponent(OrgAuthComponent, this.organizationsAuth[index]);
	}

	exportListingCsv() {
		var data = [];

		this.activeorganizations.forEach(organization => {
			let obj = {
				'name': organization.name,
				'subdomain': organization.subdomain ? organization.subdomain : 'none',
				'logo': organization.logo ? organization.logo : 'none',
				'address': organization.address ? organization.address : 'none',
				'phone': organization.phone ? organization.phone : 'none',
				'website': organization.website ? organization.website : 'none',
				'emergencyContact': organization.emergencyContact ? organization.emergencyContact : 'none',
				'description': organization.description ? organization.description : 'none',
				'allowedDomains': organization.allowedDomains ? organization.allowedDomains : 'none',
				'enableResources': organization.enableResources ? true : false,
				'resources': organization.resources ? organization.resources : 'none',
			};
			data.push(obj);
		});
		let options = {
			fieldSeparator: ',',
			quoteStrings: '"',
			decimalseparator: '.',
			showLabels: true,
			showTitle: false,
			useBom: true,
			noDownload: false,
			headers: [
				'Name',
				'Subdomain',
				'Logo',
				'Address',
				'Phone',
				'Website',
				'Emergency Contact',
				'Description',
				'Allowed Domains',
				'Enable Resources',
				'Resources']
		};

		new AngularCsv(data, 'Organization listing -' + moment().format('MMMM Do YYYY, h:mm:ss a'), options);

	}

	exportResourcesCsv() {

		var data = [];
		this.activeorganizations.forEach(organization => {
			if (organization.enableResources) {
				let obj = {
					'name': organization.name,
					'resources': organization.resources ? organization.resources : 'none',
				};

				if (organization.questionSet) {
					var i = 1;
					organization.questionSet.forEach(questionSet => {
						obj['questionQuestion' + i] = questionSet.question;
						obj['questionInstruction' + i] = questionSet.instruction;
						i++;
					});
				}
				data.push(obj);

				if (organization.resourceSet) {
					organization.resourceSet.forEach(resourceSet => {
						let obj = {
							'name': '',
							'resources': '',
							'title': resourceSet.title,
							'summary': resourceSet.summary
						};

						if (resourceSet.resourcesetGroup) {
							resourceSet.resourcesetGroup.forEach(group => {
								let obj = {
									'name': '',
									'resources': '',
									'title': '',
									'summary': '',
									'groupTitle': group.title,
									'groupAddress': group.address,
									'groupContact': group.contact,
									'groupAlternateContact': group.alternateContact,
									'groupWebsite': group.website,
								};
								data.push(obj);
							});
						}
					});
				}

			}

		});

		this.log.debug(data);

		let options = {
			fieldSeparator: ',',
			quoteStrings: '"',
			decimalseparator: '.',
			showLabels: true,
			showTitle: false,
			useBom: true,
			noDownload: false,
			headers: [
				'Organization Name',
				'General Resource Description',
				'Resource Title',
				'Resource Summary',
			]
		};
		new AngularCsv(data, 'Organization resources -' + moment().format('MMMM Do YYYY, h:mm:ss a'), options);

	}

	onDownloadConfigJson(row) {
		const fileName = row.Name + '-' + 'saml2-config.json';
		const jsonString = JSON.stringify(row.Settings);
		this.fileService.dyanmicDownloadByHtmlTag(fileName, jsonString);
	}

	onDownloadConfigText(row) {
		const fileName = row.Name + '-' + 'saml2-config.json';
		this.fileService.dyanmicDownloadByHtmlTag(fileName, row.Settings);
	}

	doClone() {
		this.modalService.setCloseOnClickAway(false);
		this.modalService.showComponent(OrganizationCloneComponent, null);
	}
}
