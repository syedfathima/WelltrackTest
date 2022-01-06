import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { ModalService } from '../../../lib/modal.service';
import { LogService } from '../../../lib/log.service';
import { User } from '../../../models/user';
import { UserService } from '../../../lib/user.service';
import { FunAchievement } from '../../../models/fun-achievement';
import { DatePopup } from '../../../components/date-popup/date-popup';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from '../../../lib/utility.service';

declare var jQuery: any;

@Component({
	selector: 'app-fun-achievement-details',
	templateUrl: './fun-achievement-details.component.html',
	styleUrls: ['./fun-achievement-details.component.scss']
})
export class FunAchievementDetailsPage implements OnInit, OnDestroy {

	id: number;
	sub: Subscription;
	isLoaded = false;
	fa: FunAchievement;
	viewMode: string;
	totalSteps = 6;
	something: any;
	placeholder: string;
	amounts = [
		{ value: 0, description: '' },
		{ value: 1, description: '' },
		{ value: 2, description: '' },
		{ value: 3, description: '' },
		{ value: 4, description: '' },
		{ value: 5, description: '' },
		{ value: 6, description: '' },
		{ value: 7, description: '' },
		{ value: 8, description: '' }
	]
	backLink = '/app/practice/funachievement';
	title: string;
	back: string;
	successPopup: any;
	validationPopup: any;
	errorPopup: any;
	error: any;
	user: User; 

	constructor(
		private activatedRoute: ActivatedRoute,
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private modalService: ModalService,
		private log: LogService,
		private userService: UserService,
		private utilityService: UtilityService,
		private translate: TranslateService) {
		this.fa = new FunAchievement(null);
		this.fa.status = 'inprogress';
		this.something = { 'date': 'default' };
		this.user = this.userService.getUser();
	}

	onDate(data: any) {

		this.fa.primaryAchievement.date = data.date;
	}

	ngOnInit() {
		this.translate.stream('fa').subscribe((res: any) => {
			this.title = res.title;
			this.back = res.back;
			this.successPopup = res.popups.success;
			this.validationPopup = res.popups.validation;
			for(let i = 0; i < this.amounts.length; i++) {
				this.amounts[i].description = res.levels[i];
			}
	

			// tslint:disable-next-line:no-unused-expression
		});
		this.translate.get('error').subscribe((res: any) => {
			this.error = res.title;
		});
		this.translate.stream('fa.steps.0.inputs.0.default').subscribe((res: any) => {
			this.placeholder = res;
	
		})

		this.sub = this.activatedRoute.params.subscribe(params => {
			if (!params['id']) {
				this.isLoaded = true;
				this.viewMode = 'create';
				return;
			}

			this.id = params['id'];

			//Load info from api...
			this.api.get('theory/funachievement/' + this.id).subscribe(
				(result: any) => {
					this.log.debug('F&A data fetched');
					//this.log.debug(result.data);
					this.fa = new FunAchievement(result.data);
					//this.log.debug(this.diaries);

					if (this.fa.status === 'complete') {
						this.viewMode = 'readonly';
					} else {
						this.viewMode = 'edit';
					}

					if(this.user.id !== this.fa.userId ){
						this.backLink = '/professional/user-details/' + this.fa.userId;
					}
					else{
						this.backLink = '/app/practice/funachievement';
					}

				},
				(error: any) => {
					this.log.error('Error getting F&A. ' + error.message);
				},
				() => {
					this.isLoaded = true;

					if (this.viewMode === 'readonly') {
						setTimeout(() => { this.makeReadOnly() }, 250);
					}
				}
			);
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}


	goBack() {
		this.router.navigate(['app/practice/funachievement']);
	}

	makeReadOnly() {
		jQuery('#page-fa-details input').attr('disabled', true);
		jQuery('#page-fa-details textarea').attr('disabled', true);
		jQuery('#page-fa-details select').attr('disabled', true);
	}

	isValid() {
		if (!this.fa.primaryAchievement.activity || this.fa.primaryAchievement.activity.length === 0) {
			this.modalService.showAlert(this.validationPopup.title, this.validationPopup.body[0]);
			return false;
		}

		if (!this.fa.primaryAchievement.happinessBefore || !this.fa.primaryAchievement.happinessAfter) {
			this.modalService.showAlert(this.validationPopup.title, this.validationPopup.body[1]);
			return false;
		}

		if (!this.fa.primaryAchievement.funBefore || !this.fa.primaryAchievement.funAfter) {
			this.modalService.showAlert(this.validationPopup.title, this.validationPopup.body[2]);
			return false;
		}

		if (!this.fa.primaryAchievement.achievementBefore || !this.fa.primaryAchievement.achievementAfter) {
			this.modalService.showAlert(this.validationPopup.title, this.validationPopup.body[3]);
			return false;
		}

		if (!this.fa.primaryAchievement.observation || this.fa.primaryAchievement.observation.length === 0) {
			this.modalService.showAlert(this.validationPopup.title, this.validationPopup.body[4]);
			return false;
		}

		return true;
	}

	onComplete() {

		if (!this.isValid()) {
			return;
		}

		if (this.utilityService.demoMode()) {
			return;
		}

		this.fa.status = 'complete';

		if (this.viewMode === 'edit') {

			this.api.put('theory/funachievement', this.fa.forApi()).subscribe(
				(data: any) => {
					this.modalService.showAlert(this.successPopup.title, this.successPopup.body);
					this.goBack();
				},
				(error: any) => {
					this.log.error('funachievement_error');
					this.modalService.showAlert(this.error, error.message);
				}
			);
		} else if (this.viewMode === 'create') {
			
	

			this.api.post('theory/funachievement', this.fa.forApi()).subscribe(
				(data: any) => {
					this.modalService.showAlert(this.successPopup.title, this.successPopup.body);
					this.goBack();
				},
				(error: any) => {
			
					this.log.error('funachievement_error');
					this.modalService.showAlert(this.error, error.message);
				}
			);
		}
	}
}
