import { Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';

//import { AboutPage } from '../about/about';


import { Chart, ChartData, ChartConfiguration } from 'chart.js';
import * as _ from 'lodash';

import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { User } from '../../models/user';
import { Organization } from '../../models/organization';
import { UserService } from '../../lib/user.service';
import { MoodcheckService } from '../../lib/moodcheck.service';
import { LogService } from '../../lib/log.service';
import { ModalService } from '../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../../../environments/all';
import { GraphService } from '../../lib/graph.service';

@Component({
	selector: 'dashboard-executive',
	templateUrl: './dashboard-executive.component.html',
	styleUrls: ['./dashboard-executive.component.scss']
})
export class DashboardExecutiveComponent implements OnInit {
	dashboardExecutiveStrings: any;
	isloaded: boolean = false;
	totalSignups: number;
	totalLogins: number;
	totalusers: number = 100;
	activeusers: number;
	men: number;
	women: number;
	unconfirmed: number = 0;
	moodalerts: number = 0;
	user: User;
	rendered: boolean;
	pairedCount: number
	avgmoodcheck: number;
	moodcheckcolor: string;
	emotion: string;
	moodcheckimage: string;
	generalMoodcheckChart: Chart;
	dasImprovementStressChart: Chart;
	dasImprovementAnxietyChart: Chart;
	dasImprovementDepressionChart: Chart;
	dasImprovementGeneralChart: Chart;
	dasImprovementAvgChart: Chart;
	dasImprovement: any;
	gotBetter: any = [];
	improvementTotalPercent: number;
	improvementDepression: number;
	improvementAnxiety: number;
	improvementStress: number;
	depressionpositionfirst: number;
	depressionpositionlast: number;
	stresspositionfirst: number;
	stresspositionlast: number;
	anxietypositionfirst: number;
	anxietypositionlast: number;
	depressionfirstavg: number;
	stressfirstavg: number;
	anxietyfirstavg: number;
	depressionlastavg: number;
	stresslastavg: number;
	anxietylastavg: number;
	depressionfirstclass: string;
	depressionlastclass: string;
	stressfirstclass: string;
	stresslastclass: string;
	anxietyfirstclass: string;
	anxietylastclass: string;
	assessmentCount: number;
	assessmentHighCount: number;
	assessmentHighPercent: number;
	returningUsers: number;
	inviteCount: number;
	inviteAcceptedCount: number;
	moodcheckUsers: number;

	popup: any;
	activeTab: string;
	tabs = ['good', 'normal', 'bad'];
	tabIndex: number;
	filterIndex: number;
	activeFilter: string;
	filters = ['30days', '60days', '90days', 'alltime'];
	filtersText = { '30days': 30, '60days': 60, '90days': 90, 'alltime': 'All time' };
	moodcheckslow: any;
	moodchecksnormal: any;
	moodcheckshigh: any;
	loadedCallCount = 0;
	signupsLogins: any;
	assessmentSeverity: any;

	renderedLoginsSignups: boolean = false;

	datefilter: string;
	from: Date;
	to: Date;

	@Input() organization?: Organization;
	@Input() orgId?: Organization;
	@Input() showTitle: boolean = true;

	constructor(
		private api: ApiService,
		private userService: UserService,
		private graphService: GraphService,
		private mcService: MoodcheckService,
		private modalService: ModalService,
		private log: LogService,
		private storage: StorageService,
		private translate: TranslateService) {
		this.user = this.userService.getUser();

		this.userService.watcher.subscribe((user: User) => {
			this.user = user;
		});

		this.rendered = false;
		this.activeTab = 'good';
		this.activeFilter = '30days';
		this.to = new Date();
		let d = new Date();
		d.setDate(d.getDate() - 30);
		this.from = d;
	}

	ngOnInit() {

		this.translate.stream('error').subscribe((res: any) => {
			this.popup = res.title;
		});

		this.translate.stream('dashboardExecutive').subscribe((res: any) => {
			this.dashboardExecutiveStrings = res;
		});
		this.onChangeFilter('30days');
	}



	initData() {
		let orgID;

		if (this.organization) {
			orgID = this.organization.id;
		}
		else if (this.storage.get('orgselect')) {
			orgID = this.storage.get('orgselect');
			this.api.get('organizations/' + orgID).subscribe(
				(result: any) => {
					this.organization = new Organization(result.data);
				},
				(error: any) => {
					this.log.error('Error getting organizations. ' + error.message);
				},
				() => {

				});
		}
		else {
			orgID = this.user.primaryOrganization.id;
			this.organization = this.user.primaryOrganization;
		}

		this.api.post('stats/general', {
			OrgID: orgID,
			Date: this.datefilter,
			From: this.from,
			To: this.to
		}).subscribe(
			(result: any) => {
				this.totalSignups = result.data.totalSignups;
				this.totalLogins = result.data.totalLogins;
				this.men = result.data.male;
				this.women = result.data.female;
				this.moodalerts = result.data.moodalerts;
				this.unconfirmed = result.data.unconfirmed;
				this.activeusers = result.data.activeusers;
				this.totalusers = result.data.totalusers;
				this.returningUsers = result.data.returningUsers;
				this.inviteCount = result.data.inviteCount;
				this.inviteAcceptedCount = result.data.inviteAcceptedCount;
				this.moodcheckUsers = result.data.moodcheckUsers;
				this.avgmoodcheck = Math.round(result.data.avgmoodcheck);
				this.pairedCount = result.data.pairedCount;
				this.moodcheckimage = './assets/img/moodcheck/' + (10 - this.avgmoodcheck) + '@2x.png';
				let colors = ['#f9a287', '#f8c17b', '#f6db72', '#dbe982', '#b9eb9e', '#96e5bf', '#80c7dc', '#6dadf5', '#8f7cc2', '#ba4d82'];
				this.moodcheckcolor = colors[(10 - this.avgmoodcheck)];
				this.emotion = this.user['avgMoodcheckText'];
				this.resizeCharts();
			},
			(error: any) => {
				this.modalService.showAlert(this.popup, error.message);
				this.log.error('Error fetching stats. ' + error.message);
			},
			() => {
				this.loadedCallCount++;
			}
		);

		this.api.post('stats/daschanges', {
			OrgID: orgID,
			Date: this.datefilter,
			From: this.from,
			To: this.to
		}).subscribe(
			(result: any) => {
				this.dasImprovement = result.data;
				this.improvementTotalPercent = this.dasImprovement.gotbetter.improvementTotalPercent;
				this.improvementDepression = this.dasImprovement.gotbetter.improvementDepressionPercent;
				this.improvementAnxiety = this.dasImprovement.gotbetter.improvementAnxietyPercent;
				this.improvementStress = this.dasImprovement.gotbetter.improvementStressPercent;

				this.depressionpositionfirst = this.dasImprovement.das.depression.firstlevel.position;
				this.depressionpositionlast = this.dasImprovement.das.depression.lastlevel.position;
				this.stresspositionfirst = this.dasImprovement.das.stress.firstlevel.position;
				this.stresspositionlast = this.dasImprovement.das.stress.lastlevel.position;
				this.anxietypositionfirst = this.dasImprovement.das.anxiety.firstlevel.position;
				this.anxietypositionlast = this.dasImprovement.das.anxiety.lastlevel.position;

				this.depressionfirstclass = this.dasLeveltoGradient(this.depressionpositionfirst);
				this.depressionlastclass = this.dasLeveltoGradient(this.depressionpositionlast);
				this.anxietyfirstclass = this.dasLeveltoGradient(this.anxietypositionfirst);
				this.anxietylastclass = this.dasLeveltoGradient(this.anxietypositionlast);
				this.stressfirstclass = this.dasLeveltoGradient(this.stresspositionfirst);
				this.stresslastclass = this.dasLeveltoGradient(this.stresspositionlast);

				this.depressionfirstavg = this.dasImprovement.das.depression.firstavg
				this.stressfirstavg = this.dasImprovement.das.stress.firstavg
				this.anxietyfirstavg = this.dasImprovement.das.anxiety.firstavg
				this.depressionlastavg = this.dasImprovement.das.depression.lastavg
				this.stresslastavg = this.dasImprovement.das.stress.lastavg
				this.anxietylastavg = this.dasImprovement.das.anxiety.lastavg
				this.renderDasImprovement();
				this.resizeCharts();
			},
			(error: any) => {
				this.modalService.showAlert(this.popup, error.message);
				this.log.error('Error fetching stats. ' + error.message);
			},
			() => {
				this.loadedCallCount++;
			}
		);

		this.api.post('stats/moodcheckgeneral', {
			OrgID: orgID,
			Date: this.datefilter,
			From: this.from,
			To: this.to
		}).subscribe(
			(result: any) => {
				this.log.debug(result.data);
				this.moodcheckslow = result.data.low;
				this.moodchecksnormal = result.data.normal;
				this.moodcheckshigh = result.data.good;
				this.renderGeneralMoodcheck();
				this.resizeCharts();
			},
			(error: any) => {
				this.modalService.showAlert(this.popup, error.message);
				this.log.error('Error fetching stats. ' + error.message);
			},
			() => {
				this.loadedCallCount++;
			}
		);


		this.api.post('stats/loginssignups', {
			OrgID: orgID,
			Date: this.datefilter,
			From: this.from,
			To: this.to
		}).subscribe(
			(result: any) => {
				this.log.debug(result.data);
				this.signupsLogins = result.data;
				if (this.renderedLoginsSignups) {
					this.graphService.setGraphData(this.signupsLogins);
					this.graphService.onRefresh();
				}
				else {
					this.renderedLoginsSignups = true;
				}
				this.resizeCharts();

			},
			(error: any) => {
				this.modalService.showAlert(this.popup, error.message);
				this.log.error('Error fetching stats. ' + error.message);
			},
			() => {
				this.loadedCallCount++;

			}
		);


		this.api.post('stats/assessmentseverity', {
			OrgID: orgID,
			Date: this.datefilter,
			From: this.from,
			To: this.to
		}).subscribe(
			(result: any) => {
				this.log.debug(result.data);
				this.assessmentSeverity = result.data;
				this.log.debug('severity');
				this.log.debug(this.assessmentSeverity);
				this.assessmentCount = this.assessmentSeverity.assessmentCount;
				this.assessmentHighCount = this.assessmentSeverity.assessmentHighCount;
				this.assessmentHighPercent = this.assessmentSeverity.assessmentHighPercentage;
				//this.renderAssessmentResults();
				this.resizeCharts();

			},
			(error: any) => {
				this.modalService.showAlert(this.popup, error.message);
				this.log.error('Error fetching stats. ' + error.message);
			},
			() => {
				this.loadedCallCount++;
			}
		);
		this.rendered = true;
	}


	renderGeneralMoodcheck() {
		type DistributionType = "linear" | "series";
		type SourceType = "auto" | "data" | "labels";
		let canvas = <HTMLCanvasElement>document.getElementById('general-moodcheck');
		let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

		let gridLines = {
			display: false,
			drawBorder: false
		};

		let options = {
			legend: {
				display: false,
			},
			scales: {
				yAxes: [{
					ticks: {
						fontColor: 'rgba(0,0,0,0.5)',
						fontStyle: 'bold',
						beginAtZero: true,
						maxTicksLimit: 5,
						padding: 20
					},
					gridLines: gridLines
				}],
				xAxes: [{
					type: 'time',
					distribution: 'series' as DistributionType,
					position: 'bottom',
					fontSize: 10,
					maxRotation: 0,
					unit: 'day',
					ticks: {
						source: 'data' as SourceType,
						maxRotation: 45,
						callback: function (value) {
							return value.substring(0, 6);
						},
					},
					time: {
						tooltipFormat: 'DD MMM'
					},
					gridLines: { display: false },
				}],
			}
		};

		let data = this.generalMoodcheckData();
		this.log.debug('data in executive');
		this.log.debug(data);
		let params: ChartConfiguration = {
			type: 'line',
			data: data,
			options: options
		};
		this.generalMoodcheckChart = new Chart(ctx, params);

	}

	generalMoodcheckData() {
		let datalow = [];
		let datanormal = [];
		let datahigh = [];


		if (this.moodcheckslow) {
			this.moodcheckslow.forEach(function (obj) {
				datalow.push({ x: new Date(obj.created), y: obj.count });
			});
		}

		if (this.moodchecksnormal) {
			this.moodchecksnormal.forEach(function (obj) {
				datanormal.push({ x: new Date(obj.created), y: obj.count });
			});
		}

		if (this.moodcheckshigh) {
			this.moodcheckshigh.forEach(function (obj) {
				datahigh.push({ x: new Date(obj.created), y: obj.count });
			});
		}

		return {

			datasets: [{
				label: 'Good Mood',
				borderColor: '#F9A287',
				pointBorderColor: '#F9A287',
				pointBackgroundColor: '#F9A287',
				pointHoverBackgroundColor: '#F9A287',
				pointHoverBorderColor: '#F9A287',
				pointBorderWidth: 3,
				pointHoverRadius: 3,
				pointHoverBorderWidth: 1,
				pointRadius: 2,
				fill: false,
				borderWidth: 2,
				data: datahigh
			},
			{
				label: 'Normal Mood',
				borderColor: '#BA4D82',
				pointBorderColor: '#BA4D82',
				pointBackgroundColor: '#BA4D82',
				pointHoverBackgroundColor: '#BA4D82',
				pointHoverBorderColor: '#BA4D82',
				pointBorderWidth: 3,
				pointHoverRadius: 3,
				pointHoverBorderWidth: 1,
				pointRadius: 2,
				fill: false,
				borderWidth: 2,
				data: datanormal
			},
			{
				label: 'Bad Mood',
				borderColor: '#B9EB9E',
				pointBorderColor: '#B9EB9E',
				pointBackgroundColor: '#B9EB9E',
				pointHoverBackgroundColor: '#B9EB9E',
				pointHoverBorderColor: '#B9EB9E',
				pointBorderWidth: 3,
				pointHoverRadius: 3,
				pointHoverBorderWidth: 1,
				pointRadius: 2,
				fill: false,
				borderWidth: 2,
				data: datalow
			}
			]
		};

	}

	renderDasImprovement() {

		let canvasgeneral = <HTMLCanvasElement>document.getElementById('das-improvement-general');
		let ctxgeneral: CanvasRenderingContext2D = canvasgeneral.getContext('2d');

		let canvas = <HTMLCanvasElement>document.getElementById('das-improvement-depression');
		let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

		let canvas2 = <HTMLCanvasElement>document.getElementById('das-improvement-anxiety');
		let ctx2: CanvasRenderingContext2D = canvas2.getContext('2d');

		let canvas3 = <HTMLCanvasElement>document.getElementById('das-improvement-stress');
		let ctx3: CanvasRenderingContext2D = canvas3.getContext('2d');

		let options = {
			cutoutPercentage: 90,
			animation: {
				animationRotate: true,
				duration: 2000
			},
			legend: {
				display: false
			},
			tooltips: {
				enabled: false
			}
		};

		let data = this.dasImprovementData(ctxgeneral, 'general', this.improvementTotalPercent);

		let params: ChartConfiguration = {
			type: 'doughnut',
			data: data,
			options: options
		};

		this.dasImprovementGeneralChart = new Chart(ctxgeneral, params);

		data = this.dasImprovementData(ctx, 'depression', this.improvementDepression);
		params = {
			type: 'doughnut',
			data: data,
			options: options
		};
		this.dasImprovementDepressionChart = new Chart(ctx, params);

		data = this.dasImprovementData(ctx2, 'anxiety', this.improvementAnxiety);
		params = {
			type: 'doughnut',
			data: data,
			options: options
		};
		this.dasImprovementAnxietyChart = new Chart(ctx2, params);

		data = this.dasImprovementData(ctx3, 'stress', this.improvementStress);
		params = {
			type: 'doughnut',
			data: data,
			options: options
		};
		this.dasImprovementStressChart = new Chart(ctx3, params);
	}

	resizeCharts() {

		if (this.dasImprovementGeneralChart) {
			this.dasImprovementGeneralChart.resize();
		}
		if (this.dasImprovementGeneralChart) {
			this.dasImprovementGeneralChart.resize();
		}
		if (this.dasImprovementStressChart) {
			this.dasImprovementStressChart.resize();
		}
		if (this.dasImprovementDepressionChart) {
			this.dasImprovementDepressionChart.resize();
		}
		if (this.dasImprovementAnxietyChart) {
			this.dasImprovementAnxietyChart.resize();
		}
		if (this.generalMoodcheckChart) {
			this.generalMoodcheckChart.resize();
		}
	}

	dasImprovementData(ctx, category, value) {

		let gradient = ctx.createLinearGradient(0, 0, 0, 400);
		if (category == 'general') {
			gradient.addColorStop(0, '#F6C772');
			gradient.addColorStop(1, '#EA4C50');
		}
		else if (category === 'depression') {
			gradient.addColorStop(0, '#EA4C50');
			gradient.addColorStop(1, '#E5506E');
		} else if (category === 'stress') {
			gradient.addColorStop(0, '#75DCAF');
			gradient.addColorStop(1, '#4FB9BC');
		} else {
			gradient.addColorStop(0, '#89C1EB');
			gradient.addColorStop(1, '#799DDD');
		}

		let data: ChartData = {
			labels: [],
			datasets: [
				{
					data: [value, 100 - value],
					borderWidth: 0,
					backgroundColor: [
						gradient,
						'rgba(240,240,240,1)'
					]
				}]
		};

		return data;
	}

	renderAssessmentResults() {

		let canvas = <HTMLCanvasElement>document.getElementById('assessment-results');
		let assessmentResults: CanvasRenderingContext2D = canvas.getContext('2d');


		let gradient1 = assessmentResults.createLinearGradient(0, 0, 0, 400);
		gradient1.addColorStop(0, '#F6C772');
		gradient1.addColorStop(1, '#FFF');

		let gradient2 = assessmentResults.createLinearGradient(0, 0, 0, 400);
		gradient2.addColorStop(0, '#EA4C50');
		gradient2.addColorStop(1, '#FFF');

		let gradient3 = assessmentResults.createLinearGradient(0, 0, 0, 400);
		gradient3.addColorStop(0, '#75DCAF');
		gradient3.addColorStop(1, '#FFF');

		var data = {
			labels: ["Normal", "Mild-Moderate", "High-Severe"],
			datasets: [
				{
					label: "Stress",
					backgroundColor: gradient1,
					data: [this.assessmentSeverity.lowstresscount, this.assessmentSeverity.mediumstresscount, this.assessmentSeverity.highstresscount]
				},
				{
					label: "Anxiety",
					backgroundColor: gradient2,
					data: [this.assessmentSeverity.lowanxietycount, this.assessmentSeverity.mediumanxietycount, this.assessmentSeverity.highanxietycount]

				},
				{
					label: "Depression",
					backgroundColor: gradient3,
					data: [this.assessmentSeverity.lowdepressioncount, this.assessmentSeverity.mediumdepressioncount, this.assessmentSeverity.highdepressioncount]
				}
			]
		};

		let gridLines = {
			display: false,
			drawBorder: false
		};

		var myBarChart = new Chart(assessmentResults, {
			type: 'bar',
			data: data,
			options: {
				legend: {
					display: false
				},
				scales: {
					yAxes: [{
						ticks: {
							min: 0
						},
						gridLines: gridLines,
						scaleLabel: {
							display: true,
							labelString: 'Number of assessments'
						}
					}],
					xAxes: [{
						gridLines: gridLines
					}]

				}
			}
		});

	}

	dasLeveltoGradient(level) {

		let levelresp;
		if (level == 0) {
			levelresp = 'normal';
		}
		else if (level == 1) {
			levelresp = 'mild';
		}
		else if (level == 2) {
			levelresp = 'moderate';
		}
		else if (level == 3) {
			levelresp = 'severe';
		}
		else if (level == 4) {
			levelresp = 'extremelysevere';
		}
		else {
			levelresp = 'normal';
		}

		return levelresp;
	}


	isTabActive(tabId) {
		return (tabId === this.activeTab);
	}

	onChangeTab(tabId) {
		this.tabIndex = _.indexOf(this.tabs, tabId);
		this.activeTab = tabId;
	}

	onChangeFilter(filterId) {
		this.filterIndex = _.indexOf(this.tabs, filterId);
		this.activeFilter = filterId;
		if (filterId == 'custom') {
			this.datefilter = '';
		}
		else {
			this.datefilter = filterId;
			this.initData();
		}

	}

	onSet() {
		this.onChangeFilter('custom');
		this.initData();
	}


	isFilterActive(filterId) {
		return (filterId === this.activeFilter);
	}
}
