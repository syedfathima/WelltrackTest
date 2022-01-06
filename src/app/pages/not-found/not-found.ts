import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { ModalService } from '../../lib/modal.service';
import { LogService } from '../../lib/log.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'page-not-found',
	templateUrl: 'not-found.html',
	styleUrls: ['./not-found.scss']
})
export class NotFoundPage implements OnInit {
	emailAddress: string;
	popup: any;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private modalService: ModalService,
		private log: LogService,
		private translate: TranslateService) {

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

		//make call to server
		this.api.post('users/resetpasswordsend', {
			Email: this.emailAddress
		})
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
