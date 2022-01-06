import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { UtilityService } from '../../lib/utility.service';
import { ModalService } from '../../lib/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Organization } from '../../models/organization';

@Component({
	selector: 'register-form',
	templateUrl: 'register.html',
})
export class RegisterComponent implements OnInit {

	fullName: string;
	emailAddress: string;
	password: string;
	inputs: string[];
	exiting: boolean;
	errorPopup: any;
	successPopup: any;
	emptyPopup: any;
	showTerms: boolean;
	showNext: boolean;
	agree: boolean;
	sub: string;
	accesscode: string;
	code: any;
	logo = '';
	logoPath = '';
	suffix = '';
	tosPopup: any;
	organization: Organization;
	organizations: Organization[];
	orgId: number = -1;
	valid: boolean;
	skip: boolean = false;
	accessCode: string = '';
	orgEmail: string = '';
	redirect: string = '';
	passwordValidate: boolean = false;
	emailValidate: boolean = false;
	signUpText: any;
	name: string = '';
	domains: Array<string>;
	domain: string = '';
	emailPlaceholder: string;
	signUpStrings: any;
	customConfirm: string = '';
	customConfirmCheck: boolean = false;

	@Input() title: string;
	@Input() description: string;

	constructor(
		private api: ApiService,
		private modalService: ModalService,
		private storage: StorageService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private log: LogService,
		private translate: TranslateService) {

		this.exiting = true;
		this.errorPopup = {};
		this.successPopup = {};
		this.emptyPopup = {};

		this.inputs = [];

		this.agree = false;
		this.showTerms = false;
	}

	ngOnInit() {
		this.translate.stream('signUp').subscribe((res: any) => {
			this.signUpText = res;
			this.inputs = res.inputs;
			this.errorPopup = res.errorPopup;
			this.successPopup = res.successPopup;
			this.emptyPopup = res.emptyPopup;
			this.tosPopup = res.tosPopup;
			this.signUpStrings = res;
			this.emailPlaceholder = this.signUpStrings.emailPlaceholder;
		});

		this.activatedRoute.queryParams.subscribe(params => {
			this.code = params['code'] ? params['code'] : '';
			this.accesscode = params['accesscode'] ? params['accesscode'] : '';

			if(this.accesscode){
				this.router.navigate(['/'], { queryParams: { accesscode: this.accesscode } });
			}

			if (this.code) {
				this.api.post('confirm/guid', {
					Guid: this.code,
				}).subscribe(
					(results: any) => {
						let confirm = results.data[0];
						this.emailAddress = confirm.Arg1;
					});
			}
		});
	
		this.sub = UtilityService.getSubdomain();
		if (this.sub == 'app' || this.sub == 'staging') {
			this.sub = '';
		}
	
		if (this.sub || this.accesscode) {
			this.api.get('organizations', {
				Subdomain: this.sub,
				AccessCode: this.accesscode
			}).subscribe(
				(results: any) => {
					this.organization = new Organization(results.data);
					this.refreshOrg();
				},
				(error: any) => {

				}
			);
		}
	}

	refreshOrg() {

		if (this.organization.allowedDomains != null && this.organization.allowedDomains !== '' && this.organization.enforceDomains) {
			this.emailPlaceholder = this.signUpStrings.emailPrefixPlaceholder;
			let domains = this.organization.allowedDomains.split(",");
			if (domains.length > 1) {
				this.domains = domains;
				this.suffix = '@';
			}
			else {
				this.suffix = '@' + this.organization.allowedDomains;
			}
		}

		if (this.organization.logoPath) {
			this.logoPath = this.organization.logoPath;
		}

		if (this.organization.name) {
			this.name = this.organization.name;
		}

		if (this.organization.settings['customConfirm']) {
			this.customConfirm = this.organization.settings['customConfirm'];
		}
	}

	onChangePassword() {
		let validate = this.validatePassword(this.password);
		if (validate) {
			this.passwordValidate = true;
		}
		else {
			this.passwordValidate = false;
		}
	}

	onChangeEmail() {
		let validate = this.validateEmail(this.emailAddress);
		if (validate) {
			this.emailValidate = true;
		}
		else {
			this.emailValidate = false;
		}
	}

	validatePassword(value) {
		let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
		var RegularExp = new RegExp(reg);
		if (RegularExp.test(value)) {
			this.passwordValidate = true;
			return true;
		}
		else {
			return false;
		}
	}

	validateEmail(value) {
		let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		var RegularExp = new RegExp(reg);
		if (RegularExp.test(value)) {
			this.log.debug('validates');
			this.emailValidate = true;
			return true;
		}
		else {
			this.log.debug('doesnt validates');
			return false;
		}
	}

	onpreSignUp() {
		if (!this.validatePassword(this.password) && this.password) {
			this.modalService.showAlert(this.signUpText.passwordPopup.title, this.signUpText.passwordPopup.body);
			return;
		}

		if (this.domains && this.domain === '') {
			this.modalService.showAlert(this.signUpText.domainPopup.title, this.signUpText.domainPopup.body);
			return;
		}

		if (this.organizations && this.orgId === -1) {
			this.modalService.showAlert(this.signUpText.organizationPopup.title, this.signUpText.organizationPopup.body);
			return;
		}

		/*
		* support variable number of consent checks
		*/

		let consent = 1;
		let consentChecks = 0;

		if (this.customConfirm) {
			consent++;
		}

		if (!this.agree) {
			this.modalService.showAlert(this.signUpText.tosPopup.oops, this.signUpText.tosPopup.tos);
		}
		else {
			consentChecks++;
		}


		if (this.customConfirm) {
			if (!this.customConfirmCheck && this.agree) {
				this.modalService.showAlert(this.signUpText.tosPopup.oops, this.signUpText.tosPopup.tos);
			}
			else {
				consentChecks++;
			}
		}

		if (consentChecks < consent) {
			return;
		}

		//validate
		if (!this.emailAddress || !this.password || !this.fullName) {
			this.modalService.showAlert(this.signUpText.emptyPopup.title, this.signUpText.emptyPopup.body);
			return;
		}

		if (this.accesscode && this.orgEmail) {
			this.modalService.showAlert(this.signUpText.errorPopup.title, this.signUpText.registrationPopup.oneOrOther);
			return;
		}

		if (this.showNext && !this.skip && !this.accesscode && !this.orgEmail) {
			this.modalService.showAlert(this.signUpText.errorPopup.title, this.signUpText.registrationPopup.body);
			return;
		}

		let email;
		if (this.orgEmail) {
			email = this.orgEmail;
		}
		else if (this.suffix) {
			if (this.domain) {
				email = this.emailAddress + '@' + this.domain;
			}
			else {
				email = this.emailAddress + this.suffix;
			}
		}
		else {
			email = this.emailAddress;
		}

		this.api.post('users/preregistration', {
			Name: this.fullName,
			Password: this.password,
			Email: email,
			Subdomain: this.sub,
			Code: this.code,
			AccessCode: this.accesscode,
			Skip: this.skip,
			OrgID: this.orgId !== -1 ? this.orgId : null
		}, false).subscribe(
			(data: any) => {
				this.modalService.showAlert(this.successPopup.title, data.message);
				this.log.event('register');
				this.storage.resetFlags();
				this.router.navigate(['/']);
			},
			(error: any) => {
				if (error.status === 303) {
					this.api.get('organizations', {
						Email: email
					}, false).subscribe(
						(result: any) => {
							this.organization = new Organization(result.data);
							window.location.href = this.organization.sso;
						}
					);
				}
				else if (error.status === 404 && !this.showNext) {
					this.showNext = true;
				}
				else if (error.status === 412) {
					this.modalService.showAlert(this.signUpText.chooseOrganization.title, this.signUpText.chooseOrganization.body);

					this.api.get('organizations/all', {
						Email: email,
						allowed: true
					}).subscribe(
						(result: any) => {
							this.organizations = Organization.initializeArray(result.data);
						}
					);

				}
				else {
					this.modalService.showAlert(this.errorPopup.title, error.message);
					this.log.error('Error registering. ' + error.message);
				}
			}
		);
	}

	onPrevious() {
		this.showNext = false;
	}

}