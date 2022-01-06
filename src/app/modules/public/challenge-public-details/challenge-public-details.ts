import { Component, OnInit, ElementRef, ViewChildren, Input, AfterViewInit, Pipe } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import * as _ from 'lodash';
import { LogService } from '../../../lib/log.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user';

import { Challenge } from '../../../models/challenge';
import { UserService } from '../../../lib/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartData, ChartConfiguration } from 'chart.js';
import * as jQuery from 'jquery';



@Component({
	selector: 'page-challenge-listing',
	templateUrl: 'challenge-public-details.html',
	styleUrls: ['./challenge-public-details.scss'],
})
export class ChallengePublicDetails implements OnInit {

	user: User;
	isLoaded: boolean = false;
	id: number;
	challenge: Challenge;
	challengeChart: Chart;
	days: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private log: LogService,
		private userService: UserService,
		private translate: TranslateService
	) {


	}


	ngOnInit() {

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
		});


		this.activatedRoute.params.subscribe(params => {
			if (!params['id']) {
				return;
			}
			this.id = params['id'];
		
		});

		this.refresh();

	}

	refresh(){

		this.api.get('challenges/' + this.id).subscribe(
			(result: any) => {
				this.challenge = new Challenge(result.data)
				this.isLoaded = true;
				setTimeout(() => {
					this.showGraph();
				}, 1000);
				
			},
			(error: any) => {
				this.log.error('Error getting moodchecks. ' + error.message);
			},
			() => {
			
			}
		);


	}

	showGraph() {
		let canvas = <HTMLCanvasElement>document.getElementById('challenge');
		let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
		let flat = [];
		let max = 5;

		let range = {
			'high': this.challenge.checkIns.length - 1,
			'low': 0
		}; 

		let data = this.moodcheckCountData(this.challenge);
		let firstDay = this.challenge.start;
		let lastDay =  this.challenge.end; 

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
						max: range.high,
						min: range.low,
						fontSize: 12,
						maxRotation: 0,
						fontColor: '#999',
						callback: (value) => {
							let priorDate = new Date(this.challenge.start).getDay();
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

		this.challengeChart = new Chart(ctx, {
			type: 'bar',
			data: data,
			options: options
		});
	}

	moodcheckCountData(challenge: Challenge) {

		let canvas = <HTMLCanvasElement>document.getElementById('challenge');
		let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

		let gradient = ctx.createLinearGradient(0, 0, 0, 400);

		gradient.addColorStop(0, '#DBE982');
		gradient.addColorStop(1, '#96E5BF');
		let countData = this.getMoodcheckCountData(challenge);
		let data = {
			labels: _.map(countData, 'day'),
			datasets: [
				{
					label: 'Moodcheck Count',
					backgroundColor: gradient,
					hoverBackgroundColor: gradient,
					borderColor: 'rgba(255,255,255,1)',
					borderWidth: 0,
					data: _.map(countData, 'count'),
				}
			]
		};
		return data;
	}

	getMoodcheckCountData(challenge: Challenge) {
		let data = [];
		

		for (let i = 0; i < challenge.checkIns.length; i++) {
			data.push({
				day: i,
				count: challenge.checkIns[i]
			});
		}
		this.log.debug('days');
		this.log.debug(data);
		return data;
	}

}
