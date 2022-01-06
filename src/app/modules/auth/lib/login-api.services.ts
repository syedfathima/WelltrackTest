import { Injectable } from "@angular/core";
import { ApiService } from "../../../lib/api.service";
import { Organization } from "../../../models/organization";
import { StorageService } from "../../../lib/storage.service";
import { AuthService } from "../../../lib/auth.service";
import { LogService } from "../../../lib/log.service";
import { ModalService } from "../../../lib/modal.service";
import { AlertDialog } from "../../../components/alert-dialog/alert-dialog.component";

@Injectable()
export class LoginAPIService {
	showTerms: boolean;
	redirect: string = "";
	state: string = "login";
	agree: boolean;
	ssoEnabled: boolean = false;
	fullName: string = "";
	customConfirm: string = "";
	customConfirmCheck: boolean = false;
	organization: Organization;
	organizations: Organization[];
	accountExists: boolean;
	sso: string = "";
	ssoType: string;
	loginValidate = false;
	ssoComplete: boolean = false;
	showNext: boolean = false;
	passwordValidate: boolean = false;
	passwordChangeText: any;
	emailValidate: boolean = false;
	emailValid: boolean = false;
	accesscode: string;
	code: string;
	domains: Array<string>;
	domain: string = "";
	validAssertion: boolean = false;
	submitting: boolean;
	activateCorporatePolicy: boolean = false;
	healthCanadaEnable: boolean;
	popup: any;
	suffix = "";
	logoPath: string;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private log: LogService,
		private modalService: ModalService,
		public auth: AuthService,
	) {}

	loginDetect(email: string) {
		return this.api
			.get("users/logindetect", {
				Email: email,
			})
			.subscribe(
				(result: any) => {
					this.initialize();
					let data = result.data;

					if (data.userExists) {
						this.loginValidate = true;
					} else {
						this.state = "register";
						if (data.organizations) {
							this.organizations = Organization.initializeArray(
								data.organizations
							);
						}
						this.showTerms = true;
					}

					if (data.organization) {
						this.organization = new Organization(data.organization);
					}

					if (data.sso) {
						this.sso = data.sso;
						if (this.organization.auth.type === "saml2") {
							this.state = "sso";
							this.ssoType = "saml2";
						}
						if (!data.userExists) {
							this.showTerms = true;
						} else {
							this.showTerms = false;
						}
					}

					if (data.organization) {
						this.organization = new Organization(
							result.data.organization
						);
						if (this.organization.settings["customConfirm"]) {
							this.customConfirm = this.organization.settings[
								"customConfirm"
							];
						}

						if(this.organization.enableSso){
							if (this.organization.sso &&  this.organization.sso.AuthType && this.organization.sso.AuthType === 'oauth2pkce') {
								window.location.href = this.organization.sso.RedirectUrl;
							}

							if (this.organization.id === 2635) {
								this.healthCanadaEnable = true;
							}
							this.refreshOrg();
						}
					}
				},
				(error: any) => {
					this.initialize();
				}
			);
	}

	login(email: string, password: string) {
		this.api.authenticate(email, password).subscribe(
			(data: any) => {
				if (data.access_token) {
					this.storage.set("modalOpen", false);
					if (this.redirect) {
						this.auth.redirectUrl = this.redirect;
					} else {
						this.auth.redirectUrl = this.auth.redirectUrl || "app";
					}
					this.auth.authenticate(data.access_token);
					this.log.event("login", "Authenticate", {
						method: "username",
					});
					this.submitting = false;
				}
			},
			(error: any) => {
				//this.modalService.open('Error', 'An error occured authenticating with WellTrack. ' + error.message);
				// this.modalService.showAlert(this.popup.error, error.message);
				const modal = this.modalService.showComponent(AlertDialog, {title: this.popup.error, content: error.message});
				this.log.error(
					"An error occured authenticating with WellTrack. " +
						error.message
				);
				this.submitting = false;
			}
		);
	}

	hassaml(assertion, onConfirmSso: Function) {
		this.api.get("users/hassaml/" + assertion).subscribe(
			(result: any) => {
				this.state = "sso";
				this.validAssertion = true;
				if (result.data && result.data.userExists) {
					this.agree = true;
					onConfirmSso();
					return;
				} else {
					if (result.data.organizations) {
						this.organizations = Organization.initializeArray(
							result.data.organizations
						);
						this.showTerms = true;
						this.agree = false;
					} else if (result.data.organization) {
						this.organization = new Organization(
							result.data.organization
						);
						this.refreshOrg();
						this.showTerms = true;
						this.agree = false;
					} else {
						//do nothing
					}
				}
			},
			(error: any) => {
				this.log.error("Error verifying account. " + error.message);
				//this.loginApiService.showTerms = true;
			}
		);
	}

	usersPreregistration(
		fullName: string,
		password: string,
		accesscode: string,
		sub: any,
		code: string,
		email: any,
		skip: boolean,
		orgId: number
	) {
		return this.api.post("users/preregistration", {
			Name: fullName,
			Password: password,
			AccessCode: accesscode,
			Subdomain: sub,
			Code: code,
			Email: email,
			Skip: skip,
			OrgID: orgId !== -1 ? orgId : null,
		});
	}

	getAllOrganizations(email: any){
		this.api.get('organizations/all', {
			Email: email,
			allowed: true
		}).subscribe(
			(result: any) => {
				this.organizations = Organization.initializeArray(result.data);
			}
		);
	}

	confirm(segment:string, guid:string){
		return this.api.post('confirm/' + segment, {
			Guid: guid
		}, false);
	}

	resetPassword(emailAddress:string){
		return this.api.post('users/resetpasswordsend', {
			Email: emailAddress
		})
	}

	hassaml2(assertion: string){
		return this.api.get('users/hassaml/' + assertion);
	}

	getOrganizations(segment: any){
		return this.api.get('organizations', {
			Subdomain: segment
		}, false);
	}

	confirmGuid(guid: string){
		return this.api.post('confirm/guid', {
			Guid: guid
		}, false)
	}

	initialize() {
		this.showNext = false;
		this.sso = "";
		this.accountExists = false;
	}

	refreshOrg() {
		if (this.organization.sso) {
			if (!this.showTerms) {
				this.ssoEnabled = true;
			}
			if (this.organization.auth.type === "saml2") {
				this.sso = this.organization.sso;
				this.ssoType = this.organization.auth.type;
				this.state = "sso";
			} else if (this.organization.auth.type === "oauth2pkce") {
				this.sso = this.organization.sso;
				this.ssoType = this.organization.auth.type;
				this.state = "sso";
			} else {
				return;
			}
		}

		if (
			this.organization.allowedDomains != null &&
			this.organization.allowedDomains !== "" &&
			this.organization.enforceDomains
		) {
			let domains = this.organization.allowedDomains.split(",");
			if (domains.length > 1) {
				this.domains = domains;
				this.suffix = "@";
			} else {
				this.suffix = "@" + this.organization.allowedDomains;
			}
		}

		if (this.organization.logoPath) {
			this.logoPath = this.organization.logoPath;
		}

		if (this.organization.settings["customConfirm"]) {
			this.customConfirm = this.organization.settings["customConfirm"];
		}
	}
}
