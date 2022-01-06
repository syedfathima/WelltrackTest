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
import { LoginAPIService } from "../lib/login-api.services";

//import * as flat from 'flat';

@Component({
	selector: 'page-login-assertion',
	templateUrl: 'login-assertion.html',
	styleUrls: ['./login-assertion.scss']
})

export class LoginAssertionPage implements OnInit {
	authType: string;
	assertion: string;
	popup: any;
	message: any;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private log: LogService,
		private modalService: ModalService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		public auth: AuthService,
		private translate: TranslateService,
		private loginApi: LoginAPIService) {

	}

	ngOnInit() {
		this.translate.stream('loginMobile').subscribe((res: any) => {
			this.popup = res.popups;
		});
		this.activatedRoute.params.subscribe(params => {
			this.assertion = params['id'];
			this.loginApi.hassaml2(this.assertion).subscribe(
				(result: any) => {
					this.message = 'You can now close this window';
				},
				(error: any) => {
					this.message = 'Something went wrong.  Please close this window and retry.';
				}
			);
		});
	}

}
