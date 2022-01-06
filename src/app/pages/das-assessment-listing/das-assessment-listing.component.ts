import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { TranslateService } from '@ngx-translate/core';
import { Assessment } from '../../models/assessment';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { ModalService } from '../../lib/modal.service';
import { GraphService } from '../../lib/graph.service';
import { Chart, ChartData, ChartConfiguration } from 'chart.js';

@Component({
	selector: 'page-assessment-listing',
	templateUrl: 'das-assessment-listing.component.html',
	styleUrls: ['./das-assessment-listing.component.scss']
})
export class DasAssessmentListingPage implements OnInit {

	title: string;
	back: string;
	user: User;
	assessments: Assessment[];
	stressConfig: any;
	depressionConfig: any;
	anxietyConfig: any;
	isLoaded: boolean = false;

	level = ['Fine', 'Moderate', 'Severe'];
	moods = ['stress', 'depression', 'anxiety'];

	anxietyFine: any;
	anxietyModerate: any;
	anxietySevere: any;

	stressFine: any;
	stressModerate: any;
	stressSevere: any;

	depressionFine: any;
	depressionModerate: any;
	depressionSevere: any;

	rendered: boolean;
	popup: any;
	backLink: string;

	stressGraph: Chart;
	depressionGraph: Chart;
	anxietyGraph: Chart;

	constructor(private api: ApiService,
		private log: LogService,
		private storage: StorageService,
		private translate: TranslateService,
		private userService: UserService,
		private modalService: ModalService,
		private graphService: GraphService
	) {
		this.user = this.userService.getUser();
		if (this.user.primaryOrganization && this.user.primaryOrganization.settings['assessment'] === 'resilience'){
			this.backLink == '/app/assessments';
		} else{
			this.backLink == '/app';
		}
		this.stressFine = [];
		this.stressModerate = [];
		this.stressSevere = [];

		this.depressionFine = [];
		this.depressionModerate = [];
		this.depressionSevere = [];

		this.anxietyFine = [];
		this.anxietyModerate = [];
		this.anxietySevere = [];

		this.stressConfig = {}
		this.depressionConfig = {}
		this.anxietyConfig = {}

	}

	ngOnInit() {
		this.translate.stream('das').subscribe((res: any) => {
			this.title = res.title;
			this.back = res.back;
		});

		this.translate.stream('error').subscribe((res: any) => {
			this.popup = res.title;
		});

		this.api.get('assessments').subscribe(
			(result: any) => {
				this.assessments = Assessment.initializeArray(result.data);
				this.renderGraph();
				this.isLoaded = true;
			},
			(error: any) => {
				this.log.error('Error getting assessment questions. ' + error.message);
				this.isLoaded = true;
			},
		);

	}

	getCount(data: [any], level: String) {
		let objects = data.filter(function (el) {
			return el.label === level;
		});

		return objects.length;
	}

	renderGraph() {
		let stressData = this.generalGraphData(this.moods[0]);
		let depressionData = this.generalGraphData(this.moods[1]);
		let anxietyData = this.generalGraphData(this.moods[2]);

		this.stressConfig = {
			id: 'assessments-stress-graph',
			header: 'Stress',
			subheader: '',
			graphData: stressData,
			titles: [],
			legend: ['Fine', 'Moderate', 'High'],
			colors: ['#F9A287', '#712675', '#E32929'],
			info: '',
			width: '100%',
			height: '300px',
			className: 'chart'
		};

		this.depressionConfig = {
			id: 'assessments-depression-graph',
			header: 'Depression',
			subheader: '',
			graphData: depressionData,
			titles: [],
			legend: ['Fine', 'Moderate', 'High'],
			colors: ['#F9A287', '#712675', '#E32929'],
			info: 'L',
			width: '100%',
			height: '300px',
			className: 'chart'
		};

		this.anxietyConfig = {
			id: 'assessments-anxiety-graph',
			header: 'Anxiety',
			subheader: '',
			graphData: anxietyData,
			titles: [],
			legend: ['Fine', 'Moderate', 'High'],
			colors: ['#F9A287', '#712675', '#E32929'],
			info: '',
			width: '100%',
			height: '300px',
			className: 'chart'
		};

		this.rendered = true;
	}

	renderAssessmentGraph(type: String) {
		type DistributionType = "linear" | "series";
		type SourceType = "auto" | "data" | "labels";
		let e_id = '';
		let data: any;

		if (type === this.moods[0]) {
			e_id = 'stress-graph';
			data = this.generalGraphData(this.moods[0]);
		} else if (type === this.moods[1]) {
			e_id = 'depression-graph';
			data = this.generalGraphData(this.moods[1]);
		} if (type === this.moods[2]) {
			e_id = 'anxiety-graph';
			data = this.generalGraphData(this.moods[2]);
		}

		let canvas = <HTMLCanvasElement>document.getElementById(e_id);
		let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

		let gridLines = {
			display: true,
			drawBorder: true
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
					gridLines: { display: true },
				}],
			}
		};

		let params: ChartConfiguration = {
			type: 'line',
			data: data,
			options: options
		};

		if (type === this.moods[0]) {
			this.stressGraph = new Chart(ctx, params);
		} else if (type === this.moods[1]) {
			this.depressionGraph = new Chart(ctx, params);
		} if (type === this.moods[2]) {
			this.anxietyGraph = new Chart(ctx, params);
		}
	}

	generalGraphData(type: String) {

		let fine = [];
		let moderate = [];
		let severe = [];

		if (type === this.moods[0]) {
			this.assessments.forEach(function (obj) {
				if (obj.stresslevellabel === this.level[0]) {
					fine.push({ x: new Date(obj.created), y: obj.stress });
				} else if (obj.stresslevellabel === this.level[1]) {
					moderate.push({ x: new Date(obj.created), y: obj.stress });
				} else if (obj.stresslevellabel === this.level[2]) {
					severe.push({ x: new Date(obj.created), y: obj.stress });
				}
			}.bind(this));
		}

		if (type === this.moods[1]) {
			this.assessments.forEach(function (obj) {
				if (obj.depressionlevellabel === this.level[0]) {
					fine.push({ x: new Date(obj.created), y: obj.depression });
				} else if (obj.depressionlevellabel === this.level[1]) {
					moderate.push({ x: new Date(obj.created), y: obj.depression });
				} else if (obj.depressionlevellabel === this.level[2]) {
					severe.push({ x: new Date(obj.created), y: obj.depression });
				}
			}.bind(this));
		}

		if (type === this.moods[2]) {
			this.assessments.forEach(function (obj) {
				if (obj.anxietylevellabel === this.level[0]) {
					fine.push({ x: new Date(obj.created), y: obj.anxiety });
				} else if (obj.anxietylevellabel === this.level[1]) {
					moderate.push({ x: new Date(obj.created), y: obj.anxiety });
				} else if (obj.anxietylevellabel === this.level[2]) {
					severe.push({ x: new Date(obj.created), y: obj.anxiety });
				}
			}.bind(this));
		}
		return {

			datasets: [{
				label: 'Fine',
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
				data: fine,
				bezierCurve: true,
				tension: 0
			},
			{
				label: 'Moderate',
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
				data: moderate,
				bezierCurve: true,
				tension: 0
			},
			{
				label: 'High',
				borderColor: '#E32929',
				pointBorderColor: '#E32929',
				pointBackgroundColor: '#E32929',
				pointHoverBackgroundColor: '#E32929',
				pointHoverBorderColor: '#E32929',
				pointBorderWidth: 3,
				pointHoverRadius: 3,
				pointHoverBorderWidth: 1,
				pointRadius: 2,
				fill: false,
				borderWidth: 2,
				data: severe,
				bezierCurve: true,
				tension: 0
			}
			]
		};

	}

}
