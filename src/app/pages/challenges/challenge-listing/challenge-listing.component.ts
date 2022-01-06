import { Component, OnInit, ElementRef, ViewChildren, Input, AfterViewInit, Pipe } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import * as _ from 'lodash';
import { LogService } from '../../../lib/log.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { Moodcheck } from '../../../models/moodcheck';
import { Activity } from '../../../models/activity';
import { Challenge } from '../../../models/challenge';
import { UserService } from '../../../lib/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartData, ChartConfiguration } from 'chart.js';
import * as jQuery from 'jquery';


@Component({
	selector: 'page-challenge-listing',
	templateUrl: 'challenge-listing.component.html',
	styleUrls: ['./challenge-listing.component.scss'],
})
export class ChallengeListingPage implements OnInit, AfterViewInit {

	user: User;
	isLoaded: boolean = false;
	backLink: string;
	title: string;
	back: string;
	moodchecksCharts: Chart[];
	moodchecksMode: string;
	challengeData: any;
	dataFinished: any;
	dataUpcoming: any;
	dataInprogress: any;
	days: any[];
	progressExists = true;
	upcomingExists = true;
	finishedExists = true; 
	challenges: Challenge[];

	@ViewChildren('endOfForFinished') finishedList;
	@ViewChildren('endOfForUpcoming') upcomingList;
	@ViewChildren('endOfForProgress') progressList;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private log: LogService,
		private userService: UserService,
		private translate: TranslateService
	) {
		this.days = ['Sun',
			'Mon', 'Tue', 'Wed',
			'Thu', 'Fri', 'Sat'
		];
		this.moodchecksCharts = [];
		this.user = this.userService.getUser();
		this.isLoaded = false;
		this.backLink = '/app/practice';
		this.dataFinished = [];
		this.dataUpcoming = [];
		this.dataInprogress = [];
	}


	ngOnInit() {
		this.translate.stream('challenges').subscribe((res: any) => {
			this.title = res.title;
			this.back = res.back;
		});
		this.translate.stream('lang').subscribe((res: any) => {
			if (res === 'en') {
				this.days = [
					'Sun',
					'Mon', 'Tue', 'Wed',
					'Thu', 'Fri', 'Sat'
				]
			} else {
				this.days = [
					'Dim',
					'Lun', 'Mar', 'Mer',
					'Jeu', 'Ven', 'Sam'
				]
			}
			this.renderMoodcheckCount(0);
		});
		this.refreshContent();
	}
	ngAfterViewInit() {
		this.progressList.changes.subscribe(
			() => {
				this.renderMoodcheckCount(1);
			}
		);
		this.finishedList.changes.subscribe(
			() => {
				this.renderMoodcheckCount(0);
			});
		this.upcomingList.changes.subscribe(
			() => {
				this.renderMoodcheckCount(2);
			});
	}



	onResize(event) {
		for (let i = 0; i < this.moodchecksCharts.length; i++) {
			this.moodchecksCharts[i].resize();
		}
	}


	refreshContent() {

		if (!this.user) {
			return;
		}

		this.api.get('challenges').subscribe(
			(result: any) => {
				/* this.log.debug('Challenge data fetched');
				this.log.debug(result.data); */

				this.challenges = Challenge.initializeArray(result.data);
				this.log.debug(this.challenges);
				this.challenges = this.dataFormatter(this.challenges);
				this.dataFinished = _.filter(this.challenges, { 'status': 'finished' });
				this.dataInprogress = _.filter(this.challenges, { 'status': 'inprogress' });
				this.dataUpcoming = _.filter(this.challenges, { 'status': 'upcoming' });

				if (this.dataFinished.length) {
					this.finishedExists = true; 
				}
				else{
					this.finishedExists = false; 
				}

				if (this.dataInprogress.length) {
					this.progressExists = true;
				} else {
					this.progressExists = false;
				}

				if (this.dataUpcoming.length) {
					this.upcomingExists = true;
				} else {
					this.upcomingExists = false;
				}

				this.isLoaded = true;
			},
			(error: any) => {
				this.log.error('Error getting moodchecks. ' + error.message);
			},
			() => {

			

			}
		);
	}

	dataFormatter(data: any[]) {
		let format = [
		];
		for (let i = 0; i < data.length; i++) {
			//let scale = data[i].totalScore / 3;
			let flat = [];
			let max = 5;

			data[i].range = {
				'high': data[i].scores.length - 1,
				'low': 0
			}; 
			data[i].firstDay = data[i].start;
			data[i].lastDay = data[i].end; 
		}
		return data;
	}



	getMoodcheckCountData(index: number, challengeData: any) {
	
		let data = [];
		let scoreData = challengeData[index].checkIns
	
		for (let i = 0; i < scoreData.length; i++) {
			data.push({
				day: i,
				count: scoreData[i]
			});
		}
		return {
			data: data,
		};
	}

	moodcheckCountData(index: number, challengeData: any, className: string) {
	
		let mcData = this.getMoodcheckCountData(index, challengeData);

		let charts = <HTMLCollectionOf<HTMLCanvasElement>>document.getElementsByClassName(className);
		let ctx: CanvasRenderingContext2D = charts[index].getContext('2d');

		let gradient = ctx.createLinearGradient(0, 0, 0, 400);

		gradient.addColorStop(0, '#DBE982');
		gradient.addColorStop(1, '#96E5BF');

		let data = {
			labels: _.map(mcData.data, 'day'),
			datasets: [
				{
					label: 'Moodcheck Count',
					backgroundColor: gradient,
					hoverBackgroundColor: gradient,
					borderColor: 'rgba(255,255,255,1)',
					borderWidth: 0,
					data: _.map(mcData.data, 'count'),
				}
			]
		};

		return data;
	}

	renderMoodcheckCount(dataSet: number) {
	
		let challengeData: any;
		let className: string;
		if (dataSet === 0) {
			challengeData = this.dataFinished;
			className = 'finishedMoodchecks';
		}
		if (dataSet === 1) {
			challengeData = this.dataInprogress;
			className = 'inprogressMoodchecks';
		}
		if (dataSet === 2) {
			challengeData = this.dataUpcoming;
			className = 'upcomingMoodchecks';
		}
		let charts = <HTMLCollectionOf<HTMLCanvasElement>>document.getElementsByClassName(className);
		
		for (let i = 0; i < charts.length; i++) {
			let ctx: CanvasRenderingContext2D = charts[i].getContext('2d');

			let data = this.moodcheckCountData(i, challengeData, className);

			let gridLines = {
				display: false,
				drawBorder: false
			};
			let options = {
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					display: false
				},
				scales: {
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'MoodChecks'
						  },
						ticks: {
							beginAtZero: true,
							stepsize: 1,
							//stepSize: challengeData[i].scale,
							fontSize: 12,
							fontColor: '#999'

							//callback: function(value) { return value + ':00'; }
						},
						gridLines: gridLines
					}],
					xAxes: [{
						//type: 'linear',
						barThickness: 20,
						ticks: {
							max: challengeData[i].range.high,
							min: challengeData[i].range.low,
							fontSize: 12,
							maxRotation: 0,
							fontColor: '#999',
							callback: (value) => {
								let priorDate = new Date(challengeData[i].start).getDay();
								let newVal = (value + priorDate) % 7;
								return this.days[newVal];
							}
						},
						gridLines: gridLines,

					}]
				},
				tooltips: {
					enabled: false
				}
			}

			this.moodchecksCharts[i] = new Chart(ctx, {
				type: 'bar',
				data: data,
				options: options
			});
		}
	}

	setTeam(challenge){
		challenge.isPart = true; 
	}

}
