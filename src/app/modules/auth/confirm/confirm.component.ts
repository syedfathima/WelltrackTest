import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../../lib/modal.service';
import { config } from '../../../../environments/all';
import { TranslateService } from '@ngx-translate/core';
import { LoginAPIService } from "../lib/login-api.services";


@Component({
	selector: 'confirm',
	templateUrl: 'confirm.component.html',
	styleUrls: ['./confirm.component.scss']
})
export class ConfirmPage implements OnInit {
	sub: any;
	verified = false;
	appStore: string;
	playStore: string;
	title = '';
	message = '';
	guid: string;
	segment: string;
	popup: any;
	english: boolean = true;
	application: string;
	instructionsEnable: boolean = true;

	constructor(
		private router: Router,
		private api: ApiService,
		private modalService: ModalService,
		private log: LogService,
		private activatedRoute: ActivatedRoute,
		private translate: TranslateService,
		private loginApi: LoginAPIService
	) {
		this.appStore = config.appStore;
		this.playStore = config.playStore;
		this.message = '';
	}

	ngOnInit() {

		this.translate.stream('error').subscribe((res: any) => {
			this.popup = res.title;
		});
		let confirm;

		this.translate.stream('confirm').subscribe((res: any) => {
			confirm = res;
		});

		this.sub = this.activatedRoute.params.subscribe(params => {
			this.segment = params['segment'];
			this.guid = params['guid'];
			this.application = params['application'];
			this.loginApi.confirm(this.segment, this.guid)
				.subscribe(
					(results: any) => {
						if (this.segment == 'invite') {
							this.router.navigate(['/'], { queryParams: { code: this.guid } });
						}
						else{
							this.title = results.title;
							this.message = results.message;

						}

						if(this.segment == 'account' || this.segment == 'associate' ){
							if(this.application == 'web'){
								this.modalService.showAlert(confirm.success, confirm.readylogin);
								this.router.navigate(['/']);
							}
							this.verified = true;
						}

						if(this.segment == 'acceptappointment'){
							this.verified = true;
							this.instructionsEnable = false;
						}
					},
					(error: any) => {
						this.message = error.message;
						this.log.error('Error registering. ' + error.message);
					}
					);
		});
	}

	ngAfterViewInit() {
		this.translate.stream('lang').subscribe((res: any) => {
			if (res === 'en') {
				this.english = true;
			} else {
				this.english = false;
			}
		});
	}

	setTimeout() {
		setTimeout((router: Router) => {
			this.router.navigateByUrl('/');
		}, 3000);
	}
}
