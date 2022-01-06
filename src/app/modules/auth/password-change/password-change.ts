import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../lib/auth.service';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { UserService } from '../../../lib/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthModuleService } from "../lib/auth-module.service";
import { LoginAPIService } from "../lib/login-api.services";

@Component({
	selector: 'page-password-change',
	templateUrl: 'password-change.html',
	styleUrls: ['./password-change.scss']
})
export class PasswordChangePage implements OnInit {
	username: string;
	password: string;
	passwordrepeat: string;
	showForm: boolean = false;
	passwordValidate: boolean = false;
	passwordRepeatValidate: boolean = false;
	message: string;
	signUpText: any;
	passwordChangeText: any;
	guid: string;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private log: LogService,
		private modalService: ModalService,
		private router: Router,
		private userService: UserService,
		private activatedRoute: ActivatedRoute,
		public auth: AuthService,
		private translate: TranslateService,
		private authModuleCommon: AuthModuleService,
		private loginApi: LoginAPIService) {
	}

	ngOnInit() {
		this.translate.stream('signUp').subscribe((res: any) => {
			this.signUpText = res;
		});

		this.translate.stream('changePassword').subscribe((res: any) => {
			this.passwordChangeText = res
		});

		this.activatedRoute.params.subscribe(params => {
			this.guid = params['guid'];
			this.loginApi.confirmGuid(this.guid).subscribe(
				(results: any) => {
					this.showForm = true;
				},
				(error: any) => {
					this.message = error.message;
					this.log.error('Error confirming. ' + error.message);
				}
				);
		});
	}

	onChangePassword(){
		let validate = this.authModuleCommon.validatePassword(this.password);
		if(validate){
			this.passwordValidate = true;
		}
		else{
			this.passwordValidate = false;
		}
	}

	onChangeRepeat(){
		this.log.debug(this.password);
		this.log.debug(this.passwordrepeat);
		if(this.password == this.passwordrepeat){
			this.passwordRepeatValidate = true;
		}
		else{
			this.passwordRepeatValidate = false;
		}
	}

	onChange() {
		//Validation
		if (!this.authModuleCommon.validatePassword(this.password) && this.password) {
			this.modalService.showAlert(this.signUpText.passwordPopup.title, this.signUpText.passwordPopup.body);
			return;
		}

		if (this.password !== this.passwordrepeat) {
			this.modalService.showAlert(this.passwordChangeText.popups.error,  this.passwordChangeText.popups.passwordmatch);
			return;
		}

		this.api.post('confirm/password', { Guid: this.guid,  Password: this.password }).subscribe(
			(data: any) => {
				this.modalService.showAlert(
					this.passwordChangeText.popups.success,  this.passwordChangeText.popups.passwordsuccess
				);
				this.router.navigate(['/']);
			},
			(error: any) => {
				this.modalService.showAlert(
					this.passwordChangeText.popups.error, error.message
				);
				this.log.error('An error occured. ' + error.message);
			}
		);
	}




}
