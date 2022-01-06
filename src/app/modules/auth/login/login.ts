import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../lib/auth.service';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from '../../../../environments/all';
import { ApiError } from '../../../lib/api-error';
import { UtilityService } from '../../../lib/utility.service';
import { TranslateService } from '@ngx-translate/core';
import { Organization } from '../../../models/organization';
import { AuthModuleService } from "../lib/auth-module.service";
import { LoginAPIService } from "../lib/login-api.services";
import { AlertDialog } from "../../../components/alert-dialog/alert-dialog.component";

//import * as flat from 'flat';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	styleUrls: ['./login.scss']
})

export class LoginPage implements OnInit {
	username: string;
	password: string;
	passwordrepeat: string;
	passwordRepeatValidate: boolean = false;
	playStore: string;
	appStore: string;
	facebookAccessToken: string;
	sub: any = null;
	name: string = '';
	email: string;
	emailAddress: string;
	passText: string;
	popup: any;
	authType: string;
	assertion: string;
	accountFound: boolean = false;
	closeNotice: boolean = false;

	signUpText: any;
	orgId: number = -1;
	valid: boolean;
	skip: boolean = false;
	orgEmail: string = '';

	fullName: string = '';
	customConfirmCheck: boolean = false;

	continue: boolean = true;
	ssoComplete: boolean = false;
	passwordValidate: boolean = false;
	passwordChangeText: any;
	emailValidate: boolean = false;
	emailValid: boolean = false;
	accesscode: string;
	code: string;
	domain: string = '';
	validAssertion: boolean = false;
	activateCorporatePolicy: boolean = false;
	healthCanadaEnable: boolean;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private log: LogService,
		private modalService: ModalService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		public auth: AuthService,
		private translate: TranslateService,
		private authModuleCommon: AuthModuleService,
		private loginApi: LoginAPIService) {
		this.appStore = config.appStore;
		this.playStore = config.playStore;
		this.loginApiService.agree = false;
		this.loginApiService.showTerms = false;
	}

	get loginApiService(){
		return this.loginApi;
	}

	ngOnInit() {
		this.loginApiService.submitting = false;
		this.loginApiService.healthCanadaEnable = false;

		if (this.auth.isAuthenticated()) {
			if (this.loginApiService.redirect) {
				this.router.navigate([this.loginApiService.redirect]);
			} else {
				this.router.navigate(['app']);
			}
		}

		//this.storage.clearAllCookies();

		this.translate.stream('loginMobile').subscribe((res: any) => {
			this.email = res.emailAddress;
			this.passText = res.password;
			this.loginApiService.popup = res.popups;
		});

		this.translate.stream('signUp').subscribe((res: any) => {
			this.signUpText = res;
		});

		this.translate.stream('changePassword').subscribe((res: any) => {
			this.passwordChangeText = res
		});

		this.urlInitState();
		this.subDomainAccessCode();
	}

	urlInitState() {
		//refactor this to use services
		//every external condition should have a matching function
		this.activatedRoute.queryParams.subscribe(params => {
			this.loginApiService.redirect = params['redirect'] ? params['redirect'] : '';

			if (params['auth_type']) {
				this.authType = params['auth_type'];
				this.assertion = params['assertion'];
				let type = params['type'];

				//request coming from web application
				if (type === 'web') {
					this.loginApi.hassaml(params['assertion'], () => { this.onConfirmSso() });
					// this.api.get('users/hassaml/' + params['assertion']).subscribe(
					// 	(result: any) => {
					// 		this.loginApiService.state = 'sso'
					// 		this.validAssertion = true;
					// 		if (result.data && result.data.userExists) {
					// 			this.loginApiService.agree = true;
					// 			this.onConfirmSso();
					// 			return;
					// 		} else {
					// 			if (result.data.organizations) {
					// 				this.loginApiService.organizations = Organization.initializeArray(result.data.organizations);
					// 				this.loginApiService.showTerms = true;
					// 				this.loginApiService.agree = false;
					// 			} else if (result.data.organization) {
					// 				this.loginApiService.organization = new Organization(result.data.organization);
					// 				this.refreshOrg();
					// 				this.loginApiService.showTerms = true;
					// 				this.loginApiService.agree = false;
					// 			} else {
					// 				//do nothing
					// 			}
					// 		}
					// 	},
					// 	(error: any) => {
					// 		this.log.error('Error verifying account. ' + error.message);
					// 		//this.loginApiService.showTerms = true;
					// 	}
					// );
				} else {
					this.closeNotice = true;
				}
			}

			this.code = params['code'] ? params['code'] : '';
			this.accesscode = params['accesscode'] ? params['accesscode'] : '';

			if (this.code) {
				this.api.post('confirm/guid', {
					Guid: this.code,
				}).subscribe(
					(results: any) => {
						let confirm = results.data[0];
						this.emailAddress = confirm.Arg1;
						if (parseInt(confirm.Role) > 1) {
							this.activateCorporatePolicy = true;
						}
					});
			}
		});

	}

	subDomainAccessCode() {

		this.sub = UtilityService.getSubdomain();

		this.activatedRoute.queryParams.subscribe(params => {
			if (params['subdomain']) {
				this.sub = params['subdomain']
			}
		});

		if (this.sub === 'app' || this.sub === 'staging') {
			this.sub = '';
		}

		if (this.sub || this.accesscode) {
			this.api.get('organizations', {
				Subdomain: this.sub,
				AccessCode: this.accesscode
			}, false).subscribe(
				(results: any) => {
					this.loginApiService.organization = new Organization(results.data);
					if (this.loginApiService.organization.id === 2635) {
						this.loginApiService.healthCanadaEnable = true;
					}
					this.loginApi.refreshOrg();
				},
				(error: any) => {

				}
			);
		}
	}

	triggerNextStep() {
		if (this.loginApiService.state === 'login') {
			if (this.continue) {
				this.onContinue();
			} else {
				this.onLogin();
			}
		} else if (this.loginApiService.state === 'register') {
			this.onCreate();
		} else if (this.loginApiService.state === 'sso' && this.validAssertion === false) {

		} else if (this.loginApiService.state === 'complete') {
			this.onComplete();
		} else {
			//do nothing
		}
	}


	// validateEmail(value) {
	// 	let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	// 	var RegularExp = new RegExp(reg);
	// 	if (RegularExp.test(value)) {
	// 		this.emailValid = true;
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	// validatePassword(value) {
	// 	let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
	// 	var RegularExp = new RegExp(reg);
	// 	if (RegularExp.test(value)) {
	// 		this.passwordValidate = true;
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	onChangePassword() {
		let validate = this.authModuleCommon.validatePassword(this.password);
		if (validate) {
			this.passwordValidate = true;
		} else {
			this.passwordValidate = false;
		}
	}

	onChangeRepeat() {
		if (this.password == this.passwordrepeat) {
			this.passwordRepeatValidate = true;
		} else {
			this.passwordRepeatValidate = false;
		}
	}

	onChangeEmail($event) {

		let validate = this.authModuleCommon.validateEmail(this.emailAddress);

		if (validate) {
			this.emailValidate = true;
		} else {
			this.initialize();
			this.emailValidate = false;
		}
	}

	// flatten(inputArray, ischild = false) {
	// 	let flatresult = [];
	// 	ischild = ischild || false;

	// 	let i = 0, len = inputArray.length;

	// 	for (i = 0; i < len; i++) {
	// 		flatresult.push(inputArray[i]);

	// 		if (inputArray[i].children && typeof inputArray[i].children === typeof []) {
	// 			this.flatten(inputArray[i].children, true);
	// 		}
	// 	}

	// 	if (ischild === false) {
	// 		return this;
	// 	}
	// };

	onLogin() {
		//Validation
		if (!this.emailAddress || !this.password) {
			// this.modalService.showAlert(this.loginApiService.popup.error, this.loginApiService.popup.blank);
			const modal = this.modalService.showComponent(AlertDialog, {title: this.loginApiService.popup.error, content: this.loginApiService.popup.blank});
			return;
		}

		let email = this.formatEmail();
		this.loginApiService.submitting = true;
		this.loginApi.login(email, this.password);
	}

	onContinue() {
		let email = this.formatEmail();
		if (!this.emailAddress || !this.authModuleCommon.validateEmail(email)) {
			this.modalService.showAlert(this.signUpText.emailPopup.title, this.signUpText.emailPopup.body);
			return;
		}
		this.continue = false;

		this.loginApi.loginDetect(email);
	}

	onCreate() {

		if (!this.authModuleCommon.validatePassword(this.password) && this.password) {
			this.modalService.showAlert(this.signUpText.passwordPopup.title, this.signUpText.passwordPopup.body);
			return;
		}

		if (this.password !== this.passwordrepeat) {
			this.modalService.showAlert(this.signUpText.passwordMatch.title, this.signUpText.passwordMatch.body);
			return;
		}

		if (this.loginApiService.organizations && this.orgId === -1) {
			this.modalService.showAlert(this.signUpText.organizationPopup.title, this.signUpText.organizationPopup.body);
			return;
		}

		if (!this.emailAddress || !this.password || !this.fullName) {
			this.modalService.showAlert(this.signUpText.emptyPopup.title, this.signUpText.emptyPopup.body);
			return;
		}

		if (!this.loginApiService.agree) {
			this.modalService.showAlert(this.signUpText.tosPopup.oops, this.signUpText.tosPopup.tos);
			return;
		}

		if (this.loginApiService.showNext && !this.skip && !this.accesscode && !this.orgEmail) {
			this.modalService.showAlert(this.signUpText.errorPopup.title, this.signUpText.registrationPopup.body);
			return;
		}

		let email = this.formatEmail();

		this.loginApiService.submitting = true;
		this.loginApi.usersPreregistration(
			this.fullName,
			this.password,
			this.accesscode,
			this.sub,
			this.code,
			email,
			this.skip,
			this.orgId).subscribe(
			(data: any) => {
				if (data.data && data.data.code && data.data.code === 303) {
					this.emailAddress = email;
					this.initialize();
					this.modalService.showAlert('', data.data.message);
					this.loginApiService.state = 'login';
				} else {
					this.modalService.showAlert(this.signUpText.successPopup.title, this.signUpText.successPopup.body);
					this.log.event('register');
					let tempEmail = this.emailAddress;
					this.onInitial();
					this.emailAddress = tempEmail;
					/*
						* Prep form for login
					*/
					this.continue = false;
					this.loginApiService.submitting = false;
				}
			},
			(error: any) => {
				if (error.status === 404 && !this.loginApiService.showNext) {
					this.loginApiService.showNext = true;
				} else if (error.status === 412) {
					this.modalService.showAlert(this.signUpText.chooseOrganization.title, this.signUpText.chooseOrganization.body);
					this.loginApi.getAllOrganizations(email);
					// this.api.get('organizations/all', {
					// 	Email: email,
					// 	allowed: true
					// }).subscribe(
					// 	(result: any) => {
					// 		this.loginApiService.organizations = Organization.initializeArray(result.data);
					// 	}
					// );
				} else {
					this.modalService.showAlert(this.signUpText.errorPopup.title, error.message);
					this.log.error('Error registering. ' + error.message);
				}
				this.loginApiService.submitting = false;
			}
		);
	}

	formatEmail() {
		let email;
		if (this.orgEmail) {
			email = this.orgEmail;
		} else if (this.loginApiService.suffix) {
			if (this.domain) {
				email = this.emailAddress + '@' + this.domain;
			} else {
				email = this.emailAddress + this.loginApiService.suffix;
			}
		} else {
			email = this.emailAddress;
		}

		return email;
	}

	initialize() {
		this.loginApiService.showNext = false;
		this.loginApiService.sso = '';
		this.loginApiService.accountExists = false;
	}

	onConfirmSso() {
		if (!this.loginApiService.agree) {
			this.modalService.showAlert(this.loginApiService.popup.oops, this.loginApiService.popup.tos);
			return;
		}

		if (this.loginApiService.organizations) {
			if (this.orgId === -1) {
				this.modalService.showAlert(this.loginApiService.popup.oops, this.loginApiService.popup.errorOrganization);
				return;
			} else {
				//register org
				this.onAuthenticateSso();
			}
		} else {
			this.onAuthenticateSso();
		}
	}

	onAuthenticateSso() {
		//change this function title to saml2
		this.api.authenticateSso(this.authType, this.assertion, this.orgId).subscribe(
			(data: any) => {
				if (data.access_token) {
					this.auth.redirectUrl = this.auth.redirectUrl || 'app';
					this.auth.authenticate(data.access_token);
					this.log.event('login', 'Authenticate', { method: 'sso' });
				}
			},
			(error: any) => {
				this.modalService.showAlert(this.loginApiService.popup.error, error.message);
				this.log.error('An error occured authenticating with WellTrack. ' + error.message);
			}
		);
	}

	onComplete() {
		if (!this.auth.isAuthenticated()) {
			this.loginApiService.state = 'sso';
		}
	}

	onInitial() {
		this.loginApiService.state = 'login';
		this.continue = true;
		this.emailAddress = '';
		this.password = ''
		this.passwordrepeat = ''
		this.orgEmail = '';
		this.loginApiService.organizations = null;
		this.ssoComplete = false;
		this.skip = false;
	}

	onPrevious() {
		this.loginApiService.state = 'login';
		this.continue = true;
	}

	onToggleContinue() {
		this.continue = !this.continue;
		this.loginApiService.state = 'login';
	}
}
