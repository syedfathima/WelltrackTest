import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { LogService } from '../../lib/log.service';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { Organization } from '../../models/organization';
import { ModalService } from '../../lib/modal.service';
import { Invite } from '../../components/invite/invite';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'page-onboarding',
	templateUrl: 'onboarding.html',
	styleUrls: ['./onboarding.scss']
})
export class OnboardingPage implements OnInit {
	@ViewChild('input') fileInput: any;
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
	fullName: string;
	steps: number = 0;

	constructor(
		private api: ApiService,
		private modalService: ModalService,
		private log: LogService,
		private userService: UserService,
		private translate: TranslateService
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

		this.organization = new Organization({}, 'full');
		this.log.debug('organization');
		this.log.debug(this.organization);
	}



	onUpdateMain() {
		if (!this.name) {
			this.modalService.showAlert(this.popups[5].title, this.popups[5].body);
			return;
		}

		this.api.put('organizations/' + this.id, {
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

	addResourceGroup(i) {
		this.organization.resourceSet[i].addGroup();
	}

	removeResourceGroup(i, r) {
		this.organization.resourceSet[i].resourcesetGroup.splice(r, 1);
	}

	addQuestionSet() {
		this.organization.addQuestionset();
	}

	onRemoveQuestionset(i) {
		this.organization.questionSet.splice(i, 1);
	}

	addRessourceSet() {
		this.organization.addResourceset();
		//this.refreshnumberResourceGroups();
	}


	changeListener($event): void {
		this.readThis($event.target);
	}

	readThis(inputValue: any): void {

		var file: File = inputValue.files[0];
		inputValue.files[0]
		let fileName = inputValue.files[0].name;
		var reader: FileReader = new FileReader();

		if ((/\.(gif|jpg|jpeg|png)$/i).test(fileName)) {
			reader.onloadend = (e) => {
				this.organization.logoUpload = reader.result;
				this.organization.logo = fileName;
			}
		}
		else {
			this.fileInput.nativeElement.value = "";
			this.modalService.showAlert('Error', 'The extension is invalid. Are you sure this is an image?  Are you really really sure?');
		}

		reader.readAsDataURL(file);
	}



}
