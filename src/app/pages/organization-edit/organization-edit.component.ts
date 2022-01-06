import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { Organization } from '../../models/organization';
import { ModalService } from '../../lib/modal.service';
import { Invite } from '../../components/invite/invite';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'page-organization-edit.component',
	templateUrl: 'organization-edit.component.html',
	styleUrls: ['./organization-edit.component.scss']
})
export class OrganizationEditPage implements OnInit {
	id: number;
	name: string;
	email: string;
	active: string;
	address: string;
	phone: string;
	website: string;
	city: string;
	country: string;
	emergencyContact: string;
	subdomain: string;
	logo: string;
	headerLogo: string;
	enableSubdomains: boolean;
	allowedDomains: boolean;
	demoStatus: boolean;
	user: User;
	professionals: User[] = [];
	placeholders: any[];
	default: any;
	organization: Organization;
	popups: any[];
	isAdmin = false;
	config = {};
	showInvite: boolean = true;
	resourseSet: any;
	errors:string = "";
	submitButtonPressed:boolean = false;

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
		this.config = {
			toolbar: [
				{ name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-'] },
				{ name: 'links', items: ['Link', 'Unlink'] },
				{ name: 'paragraph', items: ['NumberedList', 'BulletedList'] }
			]
		};
	}

	ngOnInit() {
		this.translate.stream('organizationInfo').subscribe((res: any) => {
			this.default = res.default;
			this.placeholders = res.placeholders;
			this.popups = res.popups;
		});
		let orgId;
		if (this.router.url.slice(1, 6) === 'admin') {
			this.isAdmin = true;
			orgId = this.activatedRoute.params.subscribe(params => orgId = params['id']);
		} else {
			this.isAdmin = false;
			if (this.storage.get('orgselect')) {
				orgId = this.storage.get('orgselect')
			}
			else {
				this.user.primaryOrganization;
				orgId = this.user.primaryOrganization.id;
				this.log.debug('this is called');
				this.log.debug(orgId);
			}

		}

		if (orgId) {
			this.api.get('organizations/' + orgId).subscribe(
				(result: any) => {
					this.organization = new Organization(result.data, 'full');
					this.updateInfo();
					if (this.organization.settings && this.organization.settings['hasCounselors'] === false) {
						this.showInvite = false;
					}
					this.resourseSet = {
                        enableResources: this.organization.enableResources,
                        resources: this.organization.resources,
                        resourceSet: this.organization.resourceSet,
                        questionSet: this.organization.questionSet
                    };
				},
				(error: any) => {
					this.log.error('Error getting organizations. ' + error.message);
				},
				() => {
				});
		}
		else {
			this.organization = this.user.primaryOrganization;
			if (this.organization.settings && this.organization.settings['hasCounselors'] === false) {
				this.showInvite = false;
			}
		}

	}

	updateInfo() {
		this.log.debug(this.organization);
		this.id = this.organization.id;
		this.name = this.organization.name;
		this.emergencyContact = this.organization.emergencyContact;
		this.address = this.organization.address;
		this.phone = this.organization.phone;
		this.website = this.organization.website;

		this.api.get('organizations/professionals/' + this.id, {
		}).subscribe(
			(results: any) => {
				for (let obj of results.data) {
					let professional = new User(obj);
					this.professionals.push(professional);

				}
				this.log.debug('fetched professionals');
				this.log.debug(this.professionals);
				this.log.event('updateorganization');
			},
			(error: any) => {
				this.modalService.showAlert(this.popups[0], error.message);
				this.log.error('Error registering. ' + error.message);
			}
		);
	}

	onUpdateMain() {
		if (!this.name) {
			this.modalService.showAlert(this.popups[5].title, this.popups[5].body);
			return;
		}

		this.api.put('organizations/updateexecutive/' + this.id, {
			Name: this.name,
			Address: this.address,
			Phone: this.phone,
			Website: this.website,
			EmergencyContact: this.emergencyContact,
		}).subscribe(
			(data: any) => {
				this.modalService.showAlert(this.popups[3].title, this.popups[3].body);
				this.log.event('updateorganization');
			},
			(error: any) => {

				this.modalService.showAlert(this.popups[0], error.message);
				this.log.error('Error registering. ' + error.message);
			}
		);
	}


	onUpdateContact() {
		if (!this.emergencyContact) {
			this.modalService.showAlert(this.popups[4].title, this.popups[4].body);
			return;
		}
		this.api.put('organizations/updatecontact/' + this.id, {
			EmergencyContact: this.emergencyContact,
		}).subscribe(
			(data: any) => {
				this.modalService.showAlert(this.popups[3].title, this.popups[3].body);
				this.log.event('updateorganization');
			},
			(error: any) => {

				this.modalService.showAlert(this.popups[0], error.message);
				this.log.error('Error registering. ' + error.message);
			}
		);
	}

	activateUser(id, i) {

		this.api.post('users/activate', {
			UserID: id
		}).subscribe(
			(data: any) => {
				this.modalService.showAlert(this.popups[2].title, this.popups[2].body);

				this.professionals[i].status = 'approved';
			},
			(error: any) => {

				this.modalService.showAlert(this.popups[0], error.message);
				this.log.error('Error activating. ' + error.message);
			}
		);
	}


	deactivateUser(id, i) {
		this.api.post('users/deactivate', {
			UserID: id
		}).subscribe(
			(data: any) => {
				this.modalService.showAlert(this.popups[2].title, this.popups[2].body);

				this.professionals[i].status = 'disabled';
			},
			(error: any) => {

				this.modalService.showAlert(this.popups[0], error.message);
				this.log.error('Error deactivating. ' + error.message);
			}
		);
	}

	inviteExecutive() {
		let inviteInfo = {
			'type': 'orgadmin',
			'endpoint': 'proinvite',
			'orgId': this.organization.id
		};
		this.modalService.setCloseOnClickAway(false);
		this.modalService.showComponent(Invite, inviteInfo);
	}

	resourceSetChanged(data) {
        this.resourseSet = data.resourceSet;
	}

	doUpdateResources() {
        this.submitButtonPressed = true;
        this.errors = "";

        if (this.resourseSet?.enableResources && this.resourseSet?.resourceSet) {
            this.resourseSet.resourceSet.every((resource: any, index: number) => {
                if (resource.title === "") {
                    this.errors = `Title of resource set ${index + 1} is empty`;
                    return false;
                }

                resource.resourcesetGroup.every((group: any, r: number) => {
                    if (group.title === "") {
                        this.errors = `Title of resourse group ${r + 1} of resource set ${index + 1} is empty`;
                        return false;
                    }

                    return true;
                });

                if (this.errors !== "") {
                    return false;
                }

                return true;
            });
        }

        if (this.errors === "") {
            this.resourseSet.resourceSet = JSON.stringify(this.resourseSet.resourceSet);
            this.resourseSet.questionSet = JSON.stringify(this.resourseSet.questionSet);

            this.api.put('resources/update/' + this.organization.id, this.resourseSet, true, false).subscribe(
                (data: any) => {
                    this.modalService.showAlert('Success', 'Organization has been updated');
                },
                (error: any) => {
                    this.modalService.showAlert('Error', 'Something went wrong. ' + error.message);
                }
            );
        }
    }
}
