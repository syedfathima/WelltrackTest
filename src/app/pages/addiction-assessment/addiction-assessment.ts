import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from '../../lib/modal.service';
import { AssessmentAlert } from '../../components/assessment-alert/assessment-alert';
import { User } from '../../models/user';
import { Organization } from '../../models/organization';
import { Assessment } from '../../models/assessment';
import { UserService } from '../../lib/user.service';
import { TranslateService } from '@ngx-translate/core';

import * as jQuery from 'jquery';

@Component({
	selector: 'page-addiction',
	templateUrl: 'addiction-assessment.html',
	styleUrls: ['./addiction-assessment.scss']
})
export class AddictionAssessmentPage implements OnInit {
	isLoaded = false;
	questions: Array<Object> = [];
	answers: Array<Object> = [];
	active = 0;
	count = 5;
	alerts: string;
	user: User;
	popup: any;
	quizType: string = 'das';
	showExplain: boolean = false;
	showIntro: boolean = true;
	assessment: Assessment;
	organization: Organization;
	forced: boolean;
	submitting: boolean;
	demographic: Object;
	submitted: boolean; 

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
		this.demographic = this.user.demographic; 
		this.submitting = false;
		this.submitted = false; 


		//fetch demographic information
	}

	ngOnInit() {
		this.translate.stream('error').subscribe((res: any) => {
			this.popup = res.title;
		});

		this.focusOnFirst();
	}

	onSubmit() {

		//this.submitting = true;
		this.submitted = true; 
		/*
		this.api.post('assessment', {
			Type: this.quizType,
			Data: JSON.stringify(this.answers),
			OrgQuestions: {}
		}).subscribe(
			(results: any) => {
				this.assessment = new Assessment(results.data);
				this.modalService.showComponent(AssessmentAlert, this.assessment, null, true);
				this.submitting = false;
			},
			(error: any) => {
				this.modalService.showAlert(this.popup, error.message);
				this.log.error('Error registering. ' + error.message);
				this.submitting = false;
			}
		);
		*/

	}

	scrollToTop() {
		let element = document.getElementById('page-addiction-assessment');
		element.scrollIntoView();
	}

	setNextActive() {
		this.active = this.active + 1;
		this.scrollToTop();
	}

	setPreviousActive() {
		if (this.active === 0) {
			return;
		}
		this.submitted = false;
		this.active = this.active - 1;
		this.scrollToTop();
	}
	/*
	* question position, answer position,  type of question (1,2), question ID
	type 1: single answer
	type 2: multiple answers
	type 3: yes/no
	*/
	onSelectionChange() {
		this.setNextActive();
		this.focusOnFirst();
	}

	onCancel() {
		this.router.navigateByUrl('/app/addiction-assessment');
	}


	focusOnFirst() {
		setTimeout(function () {
			jQuery('.question-button:visible').first().focus();
		}, 500);
	}

}
