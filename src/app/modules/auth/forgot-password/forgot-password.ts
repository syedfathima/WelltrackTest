import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { ModalService } from '../../../lib/modal.service';
import { LogService } from '../../../lib/log.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginAPIService } from "../lib/login-api.services";

@Component({
	selector: 'page-forgot-password',
	templateUrl: 'forgot-password.html',
	styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordPage implements OnInit {
	emailAddress: string;
	popup: any;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private modalService: ModalService,
		private log: LogService,
		private translate: TranslateService,
		private loginApi: LoginAPIService) {

	}

	ngOnInit() {
		this.translate.stream('forgotPassword.popups').subscribe((res: any) => {
			this.popup = res;
		});
	}

	onResetPassword() {

		//Validation
		if (!this.emailAddress) {
			this.modalService.showAlert(this.popup.oops, this.popup.email);
			return;
		}

		this.loginApi.resetPassword(this.emailAddress)
			.subscribe(
			(data: any) => {
				this.modalService.showAlert(this.popup.password, this.popup.sent);
				this.log.event('password_reset');
				this.router.navigate(['app']);
			},
			(error: any) => {

				this.modalService.showAlert(this.popup.error, error.message);
				this.log.error('Error resetting password. ' + error.message);
			}
			);
	}
}
