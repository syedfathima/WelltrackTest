import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { LogService } from '../../../lib/log.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../lib/modal.service';
import { ResultsComponent } from '../../../components/results-modal/results-modal.component';
import { AnswerComponent } from '../../../components/answer-modal/answer-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'page-quiz',
	templateUrl: 'cd-quiz.component.html',
	styleUrls: ['./cd-quiz.component.scss']
})
export class CognitiveQuiz implements OnInit {

	active: number;
	maxactive: number;
	count: number;
	alerts: string;

	questions: Array<Object> = [];
	responses: Array<Object> = [];
	answers: Array<Object> = [];

	title: string;
	cssModule: string;
	backLink: string;
	backText: string;

	start: boolean;

	avgScore: string;
	bestScore: string;

	isChecked: Array<boolean>;

	score: number;
	showScore: boolean;
	popups: any;
	thinkingStyles: Array<Object> = [];
	thinkingStylesKeys: Array<string> = [];
	displayHelp: boolean = false;

	constructor(private api: ApiService,
		private modalService: ModalService,
		private log: LogService,
		private storage: StorageService,
		private router: Router,
		private translate: TranslateService
	) {
		this.translate.stream('cdQuiz').subscribe((res: any) => {
			this.backText = res.back;
			this.title = res.title;
		});
		this.showScore = false;
		this.start = true;
		this.active = 0;
		this.maxactive = 0;

		this.isChecked = [false, false, false, false, false, false];

		this.score = 0;

		/* tslint:disable:max-line-length */
		this.questions = [
			{ 'name': 100, 'comment': '' },
			{ 'name': 101, 'comment': '' },
			{ 'name': 102, 'comment': '' },
			{ 'name': 103, 'comment': '' },
			{ 'name': 104, 'comment': '' },
			{ 'name': 105, 'comment': '' },
			{ 'name': 106, 'comment': '' }
		];

		this.answers = [{
			'answer': 0,
			'true': '',
			'false': '',
			'value': null
		},
		{
			'answer': 5,
			'true': '',
			'false': '',
			'value': null
		},
		{
			'answer': 4,
			'true': '',
			'false': '',
			'value': null
		},
		{
			'answer': 3,
			'true': '',
			'false': '',
			'value': null
		},
		{
			'answer': 2,
			'true': '',
			'false': '',
			'value': null
		},
		{
			'answer': 1,
			'true': '',
			'false': '',
			'value': null
		},
		{
			'answer': 0,
			'true': '',
			'false': '',
			'value': null
		}

		]

		this.responses = [{ 'name': '', 'value': -1 }, { 'name': '', 'value': -1 },
		{ 'name': '', 'value': -1 }, { 'name': '', 'value': -1 },
		{ 'name': '', 'value': -1 }, { 'name': '', 'value': -1 }, { 'name': '', 'value': -1 }];
		this.count = this.questions.length;
		this.cssModule = 'quiz';
		this.title = 'Cognitive Distortions Quiz';
		this.backText = 'Go Back';
		this.backLink = '/app/practice/';

		//TODO: calculate scores
		this.avgScore = null;
		this.bestScore = null;
	}

	ngOnInit() {
		this.translate.stream('cdQuiz').subscribe((res: any) => {

			for (let i = 0; i < this.questions.length; i++) {
				this.questions[i]['comment'] = res.questions[i];
				this.answers[i]['true'] = res.responses[i].true;
				this.answers[i]['false'] = res.responses[i].false;
			}
			this.title = res.title;
			this.backText = res.back;
			this.popups = res.popups;
		});

		this.translate.stream('thoughtDiary').subscribe((res: any) => {

			let thinkingStyles = res.thinkingStyles;

			for (let thinkingStyle of thinkingStyles) {
				this.thinkingStylesKeys.push(thinkingStyle.key);
				this.thinkingStyles[thinkingStyle.key] = { 'info': thinkingStyle.info, 'text': thinkingStyle.text };
			}
		});

		this.onInitializeScores();

	}

	onInitializeScores() {
		this.api.get('quizzes/cognitivebest').subscribe(
			(results: any) => {
				if (results.data.result >= 0 && results.data.result != null) {
					this.bestScore = results.data.result;
					this.showScore = true;
				}
			},
			(error: any) => {
				this.log.error('Error registering. ' + error.message);
			}
		);


		this.api.get('quizzes/cognitivelast').subscribe(
			(results: any) => {
				if (results.data.result >= 0 && results.data.result != null) {
					this.avgScore = results.data.result;
					this.showScore = true;
				}
			},
			(error: any) => {
				this.log.error('Error registering. ' + error.message);
			}
		);
	}

	onSubmit() {

		this.api.post('quizzes/cognitive', {
			Data: JSON.stringify(this.responses)
		}).subscribe(
			(data: any) => {
				this.score = 0;
				for (let i = 0; i < this.questions.length; i += 1) {
					if (this.responses[i]['value'] === this.answers[i]['answer']) {
						this.score += 1;
					}
				}
				this.score = Math.round((this.score / this.questions.length) * 100);
				this.modalService.showComponent(ResultsComponent, this.score, '', true);
				this.onInitializeScores();
			},
			(error: any) => {

				//this.errorService.showAlert('Error', error.message);
				this.log.error('Error registering. ' + error.message);
			}
		);
		//this.router.navigateByUrl('/app');


	}

	scrollToTop() {
		let element = document.getElementById('top');
		element.scrollIntoView();
	}

	setNextActive() {
		if (this.responses[this.active]['value'] !== -1) {
			if (this.maxactive === this.active) {
				this.maxactive = this.maxactive + 1;
			}

			this.scrollToTop();
			this.active = this.active + 1;

			this.isChecked = [false, false, false, false, false, false];
			this.isChecked[this.responses[this.active]['value']] = true;


		}
	}

	setPreviousActive() {
		this.active = this.active - 1;
		this.scrollToTop();
		this.isChecked = [false, false, false, false, false, false];
		if (this.responses[this.active]['value'] !== -1) {
			this.isChecked[this.responses[this.active]['value']] = true;
		}
	}

	onSelectionChange(i, name, value) {
		this.responses[i]['value'] = value;
		this.responses[i]['name'] = name;
		if (i < this.count - 1) {
			this.setNextActive();
		}
	}

	begin() {
		this.start = false;
	}

	showAnswer(i) {
		let answer = this.answers[i];
		if (this.active === this.maxactive) {
			if (this.responses[i]['value'] === this.answers[i]['answer']) {
				answer['value'] = true;
				this.modalService.showComponent(AnswerComponent, answer);
			} else {
				answer['value'] = false;
				this.modalService.showComponent(AnswerComponent, answer);
			}
		}
	}

	showHelp() {
		this.displayHelp = !this.displayHelp;
	}

}
