import { Component, OnInit } from '@angular/core';
import { Organization } from '../../../models/organization';
import { AuthService } from '../../../lib/auth.service';
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { SsoService } from '../../../lib/sso.service';
import { ModalService } from '../../../lib/modal.service';
import { StorageService } from '../../../lib/storage.service';
import { UtilityService } from '../../../lib/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginAPIService } from "../lib/login-api.services";


@Component({
	selector: 'page-login-sso-auth',
	templateUrl: 'login-sso-auth.html',
	styleUrls: ['./login-sso-auth.scss']
})

export class LoginSsoAuthPage implements OnInit {
	authType: string;
	code: string;
	popup: any;
	message: any;
	organization: Organization;
	accessTokenResp: any;
	decodedText: any;

	constructor(
		private api: ApiService,
		private activatedRoute: ActivatedRoute,
		public auth: AuthService,
		private translate: TranslateService,
		private logService: LogService,
		private modalService: ModalService,
		private storageService: StorageService,
		private ssoService: SsoService,
		private utiltyService: UtilityService,
		private loginApi: LoginAPIService
	) {

	}

	ngOnInit() {
		this.translate.stream('loginMobile').subscribe((res: any) => {
			this.popup = res.popups;
		});

		this.activatedRoute.params.subscribe(params => {
			const segment = params['segment'];
			if (!segment) {
				this.modalService.showAlert('Error', 'The url is invalid. Please contact IT.');
			}
			else {
				this.activatedRoute.queryParams.subscribe(params => {
					if (!params['code']) {
						this.modalService.showAlert('Error', 'The url is invalid. Please contact IT.');
					}
					else {
						this.code = params['code'];
						this.loginApi.getOrganizations(segment).subscribe(
							(results: any) => {
								this.organization = new Organization(results.data);
								if (this.organization.sso) {
									if (this.organization.sso.AuthType && this.organization.sso.AuthType === 'oauth2pkce') {
										const clientId = this.organization.sso.ClientID;
										const endPointUrl = this.organization.sso.OauthEndPointUrl;
										const redirectUrl = this.organization.sso.RedirectUrl;

										this.logService.debug('code:' + this.code);
										this.logService.debug('clientId:' + clientId);
										this.logService.debug('endpointUrl:' + endPointUrl);
										this.logService.debug('redirectUrl:' + redirectUrl);
										this.logService.debug('codeverifier:' + this.storageService.get('codeVerifierHash'));
										this.logService.debug('challenge:' + this.storageService.get('challenge'));

										if (clientId && endPointUrl && redirectUrl) {
											this.ssoService.getAccessTokenWT(endPointUrl, redirectUrl, clientId,this.code).subscribe(
												(data: any) => {
													if (data.access_token) {
														this.auth.redirectUrl = this.auth.redirectUrl || 'app';
														this.auth.authenticate(data.access_token);
													}
												},
												(error: any) => {
													this.modalService.showAlert(this.popup.error, error.message);
												}
											);

										}
									}
									else {
										this.modalService.showAlert('Error', 'The code is invalid. Please contact IT.');
									}
								}

							},
							(error: any) => {
								this.modalService.showAlert('Error', 'Something went wrong. Please try again.');

							}
						);

					}

				});
			}

		});

	}

}
