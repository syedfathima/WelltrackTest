import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalService } from '../../lib/modal.service';
import { AssessmentAlert } from '../../components/assessment-alert/assessment-alert';
import { AssessmentResilienceAlert } from '../../components/assessment-resilience-alert/assessment-resilience-alert';
import { AssessmentCoreContributorAlert } from '../../components/assessment-core-contributor-alert/assessment-core-contributor-alert';
import { User } from '../../../app/models/user';
import { Organization } from '../../../app/models/organization';
import { Assessment } from '../../../app/models/assessment';
import { UserService } from '../../../app/lib/user.service';
import { TranslateService } from '@ngx-translate/core';

import * as jQuery from 'jquery';

@Component({
	selector: 'page-assessment',
	templateUrl: 'das-assessment.html',
	styleUrls: ['./das-assessment.scss']
})
export class DasAssessmentPage implements OnInit {
	isLoaded = false;
	questions: Array<Object> = [];
	answers: Array<Object> = [];
	active = 0;
	count = 0;
	alerts: string;
	user: User;
	popup: any;
	quizType: string = 'das';
	showExplain: boolean = false;
	showScore: boolean = false;
	showIntro: boolean = true;
	assessment: Assessment;
	organization: Organization;
	forced: boolean;
	submitting: boolean;
	title: string;
	back: string;
	backLink: string;
	cssClass: string;
	headerImage: string;
	resiliencyLevel: string;
	resiliencyDescription: string;
	alert: boolean;

	constructor(
		private api: ApiService,
		private modalService: ModalService,
		private log: LogService,
		private storage: StorageService,
		private router: Router,
		private userService: UserService,
		private activatedRoute: ActivatedRoute,
		private translate: TranslateService
	) {

		this.user = this.userService.getUser();

		this.submitting = false;
	}

	ngOnInit() {
		this.translate.stream('error').subscribe((res: any) => {
			this.popup = res.title;
		});


		this.activatedRoute.params.subscribe((params: Params) => {
			if (params['assessment']) {
				this.quizType = params['assessment'];
			} else if (this.user.primaryOrganization && this.user.primaryOrganization.settings) {
				this.quizType = this.user.primaryOrganization.settings['assessment'] ? this.user.primaryOrganization.settings['assessment'] : 'das';
			} else {
				this.quizType = 'das';
			}

			if (this.quizType === 'das') {
				this.cssClass = 'assessment-wellness';
				this.headerImage = './assets/img/assessment_icon@2x.png';
			} else if (this.quizType === 'resilience') {
				this.cssClass = 'assessment-resilience';
				this.headerImage = './assets/img/icons/fun_achievement_icon@2x.png';
			} else {
				this.cssClass = 'assessment-wellness';
				this.headerImage = './assets/img/assessment_icon@2x.png';
			}

			if (this.quizType === 'das') {
				this.translate.stream('das').subscribe((res: any) => {
					this.title = res.title;
					this.back = res.back;
				});
				this.activatedRoute.queryParams.subscribe(queryParams => {
					this.forced = queryParams['forced'];
				});
			} else {
				this.translate.stream('resilience').subscribe((res: any) => {
					this.title = res.title; //overwrite title in the case of a resilience assessment
					this.back = res.back;
				});
			}
			this.backLink = '/app/assessments/' + this.quizType + '/listing';
		});

	

		this.api.get('assessmentquestions/' + this.quizType).subscribe(
			(result: any) => {
				let objs = result.data;

				for (let obj of objs) {
					this.questions.push(obj[0]);
					this.answers.push({ 'value': -1, 'values': {}, 'name': -1, 'id': obj[0].ID, 'type': obj[0].Type });
					this.count++;
				}

				if (this.user.primaryOrganization && this.user.primaryOrganization.id) {
					this.api.get('organizations/' + this.user.primaryOrganization.id).subscribe(
						(result: any) => {
							this.organization = new Organization(result.data, 'view');
							if (this.organization.settings.assessment !== 'resilience') {
								this.orgQuestions();
							}
						},
						(error: any) => {
							this.log.error('Error getting organizations. ' + error.message);
						});
				}
				this.isLoaded = true;
			},
			(error: any) => {
				this.log.error('Error getting assessment questions. ' + error.message);
			},
		);

		this.focusOnFirst();
	}

	orgQuestions() {
		// for each on question set.  loop and add answers
		if (this.organization.questionSet && this.organization.enableResources) {
			this.organization.questionSet.forEach(qs => {
				let number = qs.resourceNumber;
				let resource = this.organization.resourceSet[number - 1];
				let videos = resource?.videos? resource.videos : [];
				this.questions.push({
					'Type': 3,
					'Comment': qs.question,
					'instruction': qs.instruction,
					'Group': 'Organization',
					'ID': qs.id,
					'resource': resource,
					'videos':videos,
					'options': [
						{
							'OptionValue': 0,
							'Comment': 'No'
						},
						{
							'OptionValue': 1,
							'Comment': 'Yes'
						}]
				}
				);
				this.answers.push({ 'value': -1, 'values': {}, 'name': -1, 'id': qs.id, 'type': 3 });
				this.count++;
			});
		}
	}

	onSubmit() {

		if(this.answers[this.active]['value'] === -1){
			return;
		}

		this.submitting = true;
		this.api.post('assessment', {
			Assessment: this.assessment,
			Type: this.quizType,
			Data: JSON.stringify(this.answers),
			OrgQuestions: {}
		}).subscribe(
			(results: any) => {
				this.api.get('users/me').subscribe(
					(result: any) => {
						this.user = new User(result.data);
						this.userService.setUser(this.user);
						this.assessment = new Assessment(results.data);
						if (this.quizType === 'resilience') {
							this.modalService.showComponent(AssessmentCoreContributorAlert, this.assessment, null, true);

						} else {
							this.modalService.showComponent(AssessmentAlert, this.assessment, null, true);
						}
		
						this.submitting = false;
					},
					(error: any) => {
						this.log.error('Error fetching user profile: ' + error.message);
					}
				);
		
			},
			(error: any) => {
				this.modalService.showAlert(this.popup, error.message);
				this.log.error('Error registering. ' + error.message);
				this.submitting = false;
			}
		);
	}

	scrollToTop() {
		let element = document.getElementById('page-assessment');
		element.scrollIntoView();
	}

	countAssoc() {
		return Object.keys(this.answers[this.active]['values']).length;
	}

	setNextActive() {

		if (this.questions[this.active]['Type'] === 2 || this.answers[this.active]['value'] !== -1) {
			this.active = this.active + 1;
			this.scrollToTop();
		}

		if (this.active === 1) {
			this.showIntro = false;
		}

		if (this.active === 6 && this.quizType === 'resilience') {
			this.resilienceCalculate();
			this.showScore = true;
		}
	}

	setExplain(show) {
		this.showScore = false;
		this.showExplain = show;
	}

	setIntro(intro) {
		this.showIntro = intro;
		this.focusOnFirst();
	}

	setPreviousActive() {
		if (this.active === 0) {
			return;
		}
		else{
			this.active = this.active - 1;
			if(this.active > 0){
				this.showScore = this.showIntro = this.showExplain = false; 
			}
			this.scrollToTop();
		}

	}
	/*
		question position, answer position,  type of question (1,2), question ID
		type 1: single answer
		type 2: multiple answers
		type 3: yes/no
	*/
	onSelectionChange(i, value, type, optionID) {

		if (type === 2) {
			if (this.answers[i]['values'][optionID] === value) {
				delete this.answers[i]['values'][optionID];
			} else {
				this.answers[i]['values'][optionID] = value;
			}
		} else if (type === 3) {
			this.answers[i]['value'] = value;
			if (value === 0 && i < this.count - 1) {
				this.setNextActive();
			}
		} else {
			this.answers[i]['value'] = value;
			this.answers[i]['name'] = optionID;
			if (i < this.count - 1) {
				this.setNextActive();
			}
		}
		this.focusOnFirst();
	}

	onCancel() {
		this.router.navigateByUrl('/app/assessment');
	}


	onResourceClick(contact) {
		window.open(contact.website, "_blank");
		this.api.post('assessment/resourceclick', {
			resourceGroup: contact
		}).subscribe(
			(result: any) => {
			},
			(error: any) => {
				this.log.error('Error logging link click');
			}
		);
	}

	onResourceInternalClick(contact) {
		this.api.post('assessment/resourceclick', {
			resourceGroup: contact
		}).subscribe(
			(result: any) => {
				window.open(contact.internal, "_blank");
			},
			(error: any) => {
				this.log.error('Error logging link click');
			}
		);
	}

	focusOnFirst() {
		setTimeout(function () {
			jQuery('.question-button:visible').first().focus();
		}, 500);
	}

	resilienceCalculate() {
		this.translate.get('resilience').subscribe((res: any) => {
			let score = 0;
			const totalQuestions = 6;
			let i = 0;
			for (let answer of this.answers) {
				if (i === totalQuestions)
					break;
				i++;
				score += answer['value'];
			}
			if (score / 6 <= 2.99) {
				this.resiliencyLevel = res.alert.titles.reactive;
				this.resiliencyDescription = res.alert.descriptions.reactive;
				this.alert = true;
			} else if (score / 6 <= 4.30) {
				this.resiliencyLevel = res.alert.titles.inthemoment;
				this.resiliencyDescription = res.alert.descriptions.inthemoment;
				this.alert = false;
			} else if (score / 6 <= 5.00) {
				this.resiliencyLevel = res.alert.titles.proactive;
				this.resiliencyDescription = res.alert.descriptions.proactive;
				this.alert = false;
			} else {
				this.resiliencyLevel = res.alert.titles.reactive;
				this.resiliencyDescription = res.alert.descriptions.reactive;
				this.alert = true;
			}

		});
	}

}
