import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../lib/api.service';
import { ModalService } from '../../../lib/modal.service';
import { LogService } from '../../../lib/log.service';
import { User } from '../../../models/user';
import { UserService } from '../../../lib/user.service';
import { ThoughtDiary, ThinkingStyle } from '../../../models/thought-diary';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from '../../../lib/utility.service';

declare var jQuery: any;

@Component({
	selector: 'app-addiction-details',
	templateUrl: './addiction-details.html',
	styleUrls: ['./addiction-details.scss']
})
export class AddictionDetailsPage implements OnInit, OnDestroy, AfterViewInit {
	id: number;
	sub: Subscription;
	isLoaded = false;
	diary: ThoughtDiary;
	viewMode: string;
	step: number;
	steps: number[];
	totalSteps = 3;
	backLink = '/app/practice/addiction';
	helpSections = {
		thinkingStyles: false,
		feelings: false,
		thoughts: false
	};
	title: string;
	back: string;
	popups: any;
	thinkingStyles: Array<Object> = [];
	thinkingStylesKeys: Array<string> = [];
	user: User;
	benefits: Array<Object> = [{}];

	constructor(
		private activatedRoute: ActivatedRoute,
		private api: ApiService,
		private router: Router,
		private modalService: ModalService,
		private log: LogService,
		private userService: UserService,
		private utilityService: UtilityService,
		private translate: TranslateService) {
		this.popups = {};
		this.diary = new ThoughtDiary(null);
		this.diary.status = 'inprogress';
		this.step = 1;
		this.steps = Array(this.totalSteps).fill(0).map((x, i) => (i + 1));
		this.user = this.userService.getUser();
	}

	ngOnInit() {

		this.benefits = [{}, {}];
		this.translate.stream('thoughtDiary').subscribe((res: any) => {
			this.popups = res.popups;
			let thinkingStyles = res.thinkingStyles;

			for (let thinkingStyle of thinkingStyles) {
				this.thinkingStylesKeys.push(thinkingStyle.key);
				this.thinkingStyles[thinkingStyle.key] = { 'info': thinkingStyle.info, 'text': thinkingStyle.text };
			}

		});

		this.translate.stream('addiction').subscribe((res: any) => {
			this.title = res.title;
			this.back = res.back;
		});

		this.sub = this.activatedRoute.params.subscribe(params => {
			if (!params['id']) {
				this.isLoaded = true;
				this.viewMode = 'create';
				return;
			}

			this.id = params['id'];
			this.step = this.totalSteps; //show all steps when editing or viewing

			//Load info from api...
			this.api.get('theory/thoughtdiary/' + this.id).subscribe(
				(result: any) => {
					this.log.debug('Thought diary data fetched');
					//this.log.debug(result.data);
					this.diary = new ThoughtDiary(result.data);
					//this.log.debug(this.diaries);

					if (this.diary.status === 'complete') {
						this.viewMode = 'readonly';
					} else {
						this.viewMode = 'edit';

						//add a blank feeling if non exists
						if (this.diary.entries.length === 0) {
							this.step = 1;
						}
					}

					if (this.user.id !== this.diary.userId) {
						this.backLink = '/professional/user-details/' + this.diary.userId;
					}
					else {
						this.backLink = '/app/practice/thoughtdiary';
					}


				},
				(error: any) => {
					this.log.error('Error getting thought diary. ' + error.message);
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


	ngAfterViewInit() {
		jQuery(document).ready(() => {
	

		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	goBack() {
		this.router.navigate(['app/practice/addiction']);
	}

	makeReadOnly() {
		jQuery('#page-thoughtdiary input').attr('disabled', true);
		jQuery('#page-thoughtdiary textarea').attr('disabled', true);
	}

	isValid() {
		//TODO: add validation for each step
		if (this.step >= 1) {
			if (!this.diary.thought.event || this.diary.thought.event.length === 0) {
				//this.modalService.showAlert(this.popups.validation.header, this.popups.validation.bodys[0]);
				//return false;
			}
		}

		if (this.step >= 2) {
			/*
			for (let i = 0; i < this.diary.entries.length; i++) {
				let entry = this.diary.entries[i];

				if (!entry.feeling || entry.feeling.length === 0) {
					this.modalService.showAlert(this.popups.validation.header, this.popups.validation.bodys[1]);
					return false;
				}
			}
			*/
		}

		if (this.step >= 3) {
			/*
			for (let i = 0; i < this.diary.entries.length; i++) {
				let entry = this.diary.entries[i];

				if (!entry.thought || entry.thought.length === 0) {
					this.modalService.showAlert(this.popups.validation.header, this.popups.validation.bodys[2]);
					return false;
				}
			}
			*/
		}

		if (this.step >= 4) {
			for (let i = 0; i < this.diary.entries.length; i++) {
				let entry = this.diary.entries[i];

				if (!entry.hasThinkingStyle()) {
					this.modalService.showAlert(this.popups.validation.header, this.popups.validation.bodys[3]);
					return false;
				}
			}
		}

		if (this.step >= 5) {
			for (let i = 0; i < this.diary.entries.length; i++) {
				let entry = this.diary.entries[i];

				if (!entry.challenge || entry.challenge.length === 0) {
					this.modalService.showAlert(this.popups.validation.header, this.popups.validation.bodys[4]);
					return false;
				}
			}
		}

		if (this.step >= 6) {
			if (!this.diary.thought.plan || this.diary.thought.plan.length === 0) {
				this.modalService.showAlert(this.popups.validation.header, this.popups.validation.bodys[4]);
				return false;
			}
		}

		return true;
	}

	onNext() {

		if (!this.isValid()) {
			return;
		}

		this.step++;

		if (this.step === 2) {
			//add an initial feeling if needed
			if (this.diary.entries.length === 0) {
				this.onAddFeeling();
			}

		}

		this.scrollToNext();
	}

	onSaveForLater() {
	
		if (this.viewMode === 'edit') {
			if (this.utilityService.demoMode()) {
				return;
			}
			this.api.put('theory/thoughtdiary', this.diary.forApi()).subscribe(
				(data: any) => {
					this.modalService.showAlert(this.popups.success.header, this.popups.success.body);
					this.goBack();
				},
				(error: any) => {
				
					this.log.error('thoughtdiary_error');
					this.modalService.showAlert(this.popups.error, error.message);
				}
			);
		} else if (this.viewMode === 'create') {
			let isValid = this.isValid();
			if (isValid) {
				if (this.utilityService.demoMode()) {
					return;
				}
				this.api.post('theory/thoughtdiary', this.diary.forApi()).subscribe(
					(data: any) => {
						this.modalService.showAlert(this.popups.success.header, this.popups.success.later);
						this.goBack();
					},
					(error: any) => {
				
						this.log.error('thoughtdiary_error');
						this.modalService.showAlert(this.popups.error, error.message);
					}
				);
			}
		}
	}

	onComplete() {
		if (!this.isValid()) {
			return;
		}

		this.diary.status = 'complete';

		if (this.utilityService.demoMode()) {
			return;
		}

		if (this.viewMode === 'edit') {
		
			this.api.put('theory/thoughtdiary', this.diary.forApi()).subscribe(
				(data: any) => {
					this.modalService.showAlert(this.popups.success.header, this.popups.success.body);
					this.goBack();
				},
				(error: any) => {
			
					this.log.error('thoughtdiary_error');
					this.modalService.showAlert(this.popups.error, error.message);
				}
			);
		} else if (this.viewMode === 'create') {

			this.api.post('theory/thoughtdiary', this.diary.forApi()).subscribe(
				(data: any) => {
					this.modalService.showAlert(this.popups.success.header, this.popups.success.body);
					this.goBack();
				},
				(error: any) => {
				
					this.log.error('thoughtdiary_error');
					this.modalService.showAlert(this.popups.error, error.message);
				}
			);
		}
	}

	onAddBenefit(){
		this.benefits.push({});
	}

	onAddFeeling() {
		this.diary.addFeeling();
		this.diary.entries[this.diary.entries.length - 1].belief = 50;
		this.diary.entries[this.diary.entries.length - 1].intensity = 50;
	}

	onToggleThinkingStyle(thinkingStyle: ThinkingStyle) {
		if (this.viewMode === 'readonly') {
			return;
		}

		thinkingStyle.isSelected = !thinkingStyle.isSelected;
	}

	onToggleHelpSection(helpSection: string) {
		this.helpSections[helpSection] = !this.helpSections[helpSection];

	}

	scrollToNext() {
		setTimeout(() => {
			let element = document.getElementById('step-' + this.step);
			element.scrollIntoView();
		}, 100);

	}

	validateInput(value, i) {

		value = parseInt(value);

		if (value) {
			if (value < 0) {
				value = 0;
			}

			if (value > 100) {
				value = 100;
			}
		}
		else {
			value = 0
		}
		this.diary.entries[i].intensity = value;
	}

}