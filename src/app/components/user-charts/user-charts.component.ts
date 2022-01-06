import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
//import { AboutPage } from '../about/about';
import { Chart, ChartData, ChartConfiguration } from 'chart.js';

import * as jQuery from 'jquery';
import * as _ from 'lodash';

import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { Moodcheck } from '../../models/moodcheck';
import { MoodcheckService } from '../../lib/moodcheck.service';
import { LogService } from '../../lib/log.service';
import { ModalService } from '../../lib/modal.service';
import { TutorialPage } from '../../components/tutorial/tutorial';
import { HistoryPage } from '../../components/moodcheck-history/moodcheck-history';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'user-charts',
	templateUrl: './user-charts.component.html',
	styleUrls: ['./user-charts.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UserChartsComponent implements OnInit {

	translation: string;
	heatmapChart: Chart;
	heatmapMode: string;
	moodPercentageChart: Chart;
	moodcheckCountChart: Chart;
	isEmpty = true;
	isLoaded = false;
	rendered: boolean;
	moodchecks: Moodcheck[];
	totalMoodchecks: number;
	averageMoodchecks: number;
	moodPercentageMode: string;
	moodPercentage: number;
	moodCategories: any;
	moodcheckData: any;

	showPreviousBtn: boolean;
	showNextBtn: boolean;
	currentDate: Date;
	selectedDate: Date;
	userLastMoodCheck: Date;
	dateIndicator = '30 days';
	dateIndicatorLast = 'Last 30 days';
	isDateRangeData = false;
	dateRangeRequestType = 0;
	meta: any;
	fromDate: Date;
	toDate: Date;

	@Input() user: User;

	chartIcon: string;
	listIcon: string;
	moodcheckText: any;

	constructor(
		private api: ApiService,
		private userService: UserService,
		private mcService: MoodcheckService,
		private modalService: ModalService,
		private log: LogService,
		private storage: StorageService,
		private translate: TranslateService) {

		//this.user = this.userService.getUser();

		// this.userService.watcher.subscribe((user: User) => {
		// 	this.user = user;
		// });

		this.moodchecks = [];
		this.mcService.refresh.subscribe(() => {
			this.refreshContent();
		});

		this.rendered = false;
		this.heatmapMode = 'all';
		this.moodPercentageMode = 'good';

		this.currentDate = new Date();
		this.selectedDate = new Date();

		this.chartIcon = 'tabIconActive';
		this.listIcon = 'tabIconInActive';

		this.translate.stream('moodcheck').subscribe((res: any) => {
			this.moodcheckText = res;
		});
	}

	ngOnInit() {
		this.translate.stream('dashboard').subscribe((res: any) => {
			this.translation = res.click;
		});


		Chart.defaults.global.responsive = false;
		this.resizeMoodPercentage();
		this.refreshContent();
		setTimeout(function(){
			jQuery('#page a').eq(1).focus();
		}, 500);

	}

	refreshContent() {

		if (!this.user) {
			return;
		}
		this.onPerformDateRangeRequest(0);
	}


	onResize(event) {
		this.resizeMoodPercentage();
		this.heatmapChart.resize();
		this.moodPercentageChart.resize();
		this.moodcheckCountChart.resize();
	}

	resizeMoodPercentage() {
		jQuery('#mood-percentage').each(function () {
			let width = jQuery(this).parent().width();
			let height = jQuery(this).parent().height();
			jQuery(this).width(width);
			jQuery(this).height(height);

		});
	}


	setMoodPercentageMode(mode) {
		this.moodPercentageMode = mode;
		this.moodPercentageChart.config.data = <ChartData>this.moodPercentageData();
		this.moodPercentageChart.update();

		this.log.event('dashboard_filter_moods');
	}

	moodPercentageData() {
		let canvas = <HTMLCanvasElement>document.getElementById('mood-percentage');
		let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
		let gradient = ctx.createLinearGradient(0, 0, 0, 400);


		if (this.moodPercentageMode === 'good') {
			gradient.addColorStop(0, '#d77600');
			gradient.addColorStop(1, '#f83600');
		} else {
			gradient.addColorStop(0, '#87112e');
			gradient.addColorStop(1, '#551A8B');
		}

		let mcData = this.mcService.getMoodcheckPercentageData(this.moodchecks, this.moodPercentageMode);
		this.log.debug('mood percentage data');
		this.log.debug(mcData);
		this.moodPercentage = mcData.percentage;
		this.moodCategories = mcData.categories;

		let data: ChartData = {
			labels: [],
			datasets: [
				{
					data: [this.moodPercentage, 100 - this.moodPercentage],
					borderWidth: 0,
					backgroundColor: [
						gradient,
						'rgba(240,240,240,1)'
					]
				}]
		};

		return data;
	}

	renderMoodPercentage() {
		let canvas = <HTMLCanvasElement>document.getElementById('mood-percentage');
		let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

		let data = <ChartData>this.moodPercentageData();

		let options = {
			cutoutPercentage: 80,
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

		let params: ChartConfiguration = {
			type: 'doughnut',
			data: data,
			options: options
		};

		this.moodPercentageChart = new Chart(ctx, params);
	}

	setHeatmapMode(mode) {

		this.heatmapMode = mode;
		this.heatmapChart.config.data = this.moodcheckData = this.mcService.getHeatmapData(this.moodchecks, this.heatmapMode, this.toDate);
		this.heatmapChart.update();

		this.log.event('dashboard_filter_heatmap');
	}

	renderHeatmap() {
		//var ctx = document.getElementById("myChart");

		this.moodcheckData = this.mcService.getHeatmapData(this.moodchecks, this.heatmapMode, this.toDate);

		let options = this.moodcheckoptions();
		this.heatmapChart = new Chart('heatmap', {
			type: 'bubble',
			data: this.moodcheckData,
			options: options
		});
	}

	moodcheckoptions() {
		type ModeTypes = "nearest" | "label" | "y" | "point" | "single" | "index" | "x-axis" | "dataset" | "x";
		let feelings = ['', 'Awful', 'Very Bad', 'Bad', 'Not Great', 'Ok', 'Fine', 'Good', 'Happy', 'Very Happy', 'Fantastic'];
		let lastDate = this.moodchecks.length > 0 ? this.mcService.lastDate(this.moodchecks) : this.toDate;
		let gridLines = {
			color: '#e7e5dc',
			drawBorder: false
		};
		let baseDate = this.currentDate;
		let options = {
			responsive: true,
			maintainAspectRatio: false,
			legend: {
				display: false
			},
			scales: {
				yAxes: [{
					ticks: {
						max: 24,
						min: 0,
						stepSize: 5,
						fontSize: 10,
						fontColor: '#707070',
						callback: function (value) { return value + ':00'; }
					},
					gridLines: gridLines
				}],
				xAxes: [{
					ticks: {
						max: 30,
						min: 1,
						stepSize: 6,
						fontSize: 10,
						maxRotation: 0,
						fontColor: '#707070',
						callback: function (value) {
							var priorDate: Date = new Date(baseDate);
							priorDate.setMonth(priorDate.getMonth() + 1);
							priorDate.setDate(baseDate.getDate() - (30 - value));
							return (priorDate.getMonth() + 1) + '/' + priorDate.getDate();
						}
					},
					gridLines: gridLines,

				}]
			},
			tooltips: {
				enabled: true,
				mode: 'point' as ModeTypes,
				yPadding: 15,
				xPadding: 15,
				caretSize: 9,
				multiKeyBackground: '#111',
				backgroundColor: 'rgba(250,250,250,250)',
				titleFontFamily: 'Nunito Sans',
				titleFontColor: '#9E9D9E',
				titleFontSize: 14,
				titleMarginBottom: 8,
				bodyFontFamily: 'Nunito Sans',
				bodyFontColor: '#9E9D9E',
				bodyFontSize: 14,
				bodySpacing: 5,
				footerFontFamily: 'Nunito Sans',
				footerFontColor: '#9E9D9E',
				footerMarginTop: 8,
				callbacks: {
					label: (tooltipItem, points) => {
						let id = points.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].id;
						let date = this.moodchecks.find(x => x.id === id).created;
						return feelings[points.datasets[tooltipItem.datasetIndex].label] + ', ' + date.toLocaleTimeString();
					},
					title: () => {
						return 'MoodChecks';
					},
					footer: () => {
						return this.translation;
					}

				},
			},
			onClick: (evt) => {
				let points = [];
				let element = [];
				element = <any>this.heatmapChart.getElementAtEvent(evt) || [];
				if (element.length > 0) {
					let point = element[0];
					let x = this.moodcheckData.datasets[point._datasetIndex].data[point._index].x;
					let y = this.moodcheckData.datasets[point._datasetIndex].data[point._index].y;
					for (let i = 0; i < this.moodcheckData.datasets.length; i++) {
						for (let k = 0; k < this.moodcheckData.datasets[i].data.length; k++) {
							if (this.moodcheckData.datasets[i].data[k].x === x) {
								if (this.moodcheckData.datasets[i].data[k].y === y) {
									let info = this.moodchecks.find(p => p.id === this.moodcheckData.datasets[i].data[k].id);
									points.push(info);
								}
							}
						}
					}
					this.modalService.showComponent(HistoryPage, points, 'default moodcheck-history', false, '400px');
				}
			}
		}
		return options;
	}

	moodcheckCountData() {
		let mcData = this.mcService.getMoodcheckCountData(this.moodchecks, '', this.toDate);

		this.totalMoodchecks = mcData.total;
		this.averageMoodchecks = mcData.average;

		let canvas = <HTMLCanvasElement>document.getElementById('moodcheckCount');
		let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

		let gradient = ctx.createLinearGradient(0, 0, 0, 400);

		gradient.addColorStop(0, '#6DADF5');
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

	renderMoodcheckCount() {

		let canvas = <HTMLCanvasElement>document.getElementById('moodcheckCount');
		let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

		let data = this.moodcheckCountData();
		let lastDate = this.moodchecks.length > 0 ? this.mcService.lastDate(this.moodchecks) : this.toDate

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
					ticks: {
						stepSize: 2,
						fontSize: 10,
						fontColor: '#999'
						//callback: function(value) { return value + ':00'; }
					},
					gridLines: gridLines
				}],
				xAxes: [{
					//type: 'linear',
					ticks: {
						max: 30,
						min: 1,
						fontSize: 10,
						maxRotation: 60,
						fontColor: '#999',
						callback: function (value) {
							if (value % 2 === 0) {
								let priorDate: Date = new Date();
								priorDate.setDate(lastDate.getDate() - (30 - value));
								return (priorDate.getMonth() + 1) + '/' + priorDate.getDate();
							} else {
								return '';
							}
						}
					},
					gridLines: gridLines,

				}]
			},
			tooltips: {
				enabled: false
			}
		}

		this.moodcheckCountChart = new Chart(ctx, {
			type: 'bar',
			data: data,
			options: options
		});
	}

    /**
    * Request to get a new array of moodcheck data based from the start and end date.
    *
    * @example
    * refreshGraphWithDate(2018-9-01, 2018-10-01, 1)
    *
    * @param {Date} from Starting date.
    * @param {Date} to End date.
    * @param {any} type Just indicator for the previous and next button.
    */

	refreshGraphWithDate(from: String, to: String, type: any) {
		this.log.debug('params: from' + from + 'to' + to);
		this.api.get('moodcheck/' + this.user.id + '?From=' + from + '&To=' + to).subscribe(
			(result: any) => {
				let meta: any = result.meta;
				this.meta = meta;
				this.hideOrShowDateRangeButtons(meta);

				this.moodchecks = Moodcheck.initializeArray(result.data);
				if (this.moodchecks.length > 0) {
					this.isEmpty = false;

					if (type == 0) {
						this.userLastMoodCheck = this.mcService.lastDate(this.moodchecks);
						this.currentDate = new Date(this.mcService.lastDate(this.moodchecks));
						this.selectedDate = this.currentDate;
						this.selectedDate.setMonth(this.currentDate.getMonth() - 1);
						this.dateIndicator = '30 days';
						this.toDate = new Date(this.mcService.lastDate(this.moodchecks));
					}
				}
			},
			(error: any) => {
				this.moodchecks = [];
				this.log.error('Error getting moodchecks. ' + error.message);
				this.moodchecks = [];
				this.initializeGrapForEmptyMoodcheck();
			},
			() => {
				if (!this.rendered) {
					this.renderHeatmap();
					this.renderMoodPercentage();
					this.renderMoodcheckCount();
					this.rendered = true;
				} else {
					this.heatmapChart.config.data = this.moodcheckData = this.mcService.getHeatmapData(this.moodchecks, this.heatmapMode, this.toDate);
					this.heatmapChart.config.options = this.moodcheckoptions();
					this.heatmapChart.update();

					this.moodcheckCountChart.config.data = this.moodcheckCountData();
					this.moodcheckCountChart.update();

					this.moodPercentageChart.config.data = this.moodPercentageData();
					this.moodPercentageChart.update();
				}
				this.isLoaded = true;

			}
		);
	}

	/**
    * This method will render graph even if it has empty moodcheck. This is needed if theres no data being returned from the API.
    *
    * @example
    * initializeGrapForEmptyMoodcheck()
    *
    */

	initializeGrapForEmptyMoodcheck() {
		this.toDate = new Date();
		if (!this.rendered) {
			this.renderHeatmap();
			this.renderMoodPercentage();
			this.renderMoodcheckCount();
			this.rendered = true;
		} else {
			this.heatmapChart.config.data = this.moodcheckData = this.mcService.getHeatmapData(this.moodchecks, this.heatmapMode, this.toDate);
			this.heatmapChart.config.options = this.moodcheckoptions();
			this.heatmapChart.update();

			this.moodcheckCountChart.config.data = this.moodcheckCountData();
			this.moodcheckCountChart.update();

			this.moodPercentageChart.config.data = this.moodPercentageData();
			this.moodPercentageChart.update();
		}
		this.isLoaded = true;
	}

    /**
    * This method will allow user to show the previous month moodchecks.
    *
    * @example
    * onPreviousMonth(1)
    *
    * @param {any} type Just indicator for the previous and next button.
    */

	onPreviousMonth(type: any) {
		this.onPerformDateRangeRequest(type);
	}

	/**
	* This method will allow user to show the next month moodchecks.
	*
	* @example
	* onPreviousMonth(1)
	*
	* @param {any} type Just indicator for the previous and next button.
	*/

	onNextMonth(type: any) {
		this.onPerformDateRangeRequest(type);
	}
	/**
	* Initialize a request to get a new array of moodcheck data based from the start and end date.
	*
	* @example
	* onPerformDateRangeRequest(2018-9-01, 2018-10-01, 1)
	*
	* @param {any} type Just indicator for the previous and next button.
	*/

	onPerformDateRangeRequest(type: any) {
		var mDate: Date = this.selectedDate;
		this.isDateRangeData = true;
		this.dateRangeRequestType = type;

		if (type == 1) {
			mDate.setMonth(this.selectedDate.getMonth() - 1);
			this.selectedDate = mDate;

			this.dateIndicator = this.generateDateLabel(mDate);
			this.dateIndicatorLast = this.generateDateLabel(mDate);

			this.showNextBtn = true;

			let from = this.createNewDateWithFormat('-', this.selectedDate);
			let toDate = new Date(mDate);
			toDate.setMonth(mDate.getMonth() + 1);

			this.fromDate = this.selectedDate;
			this.toDate = toDate;

			let to = this.createNewDateWithFormat('-', toDate);
			this.refreshGraphWithDate(from, to, 1);

		} else if (type == 2) {
			mDate.setMonth(this.selectedDate.getMonth() + 1);
			this.selectedDate = mDate;

			this.dateIndicator = this.generateDateLabel(mDate);
			this.dateIndicatorLast = this.generateDateLabel(mDate);

			this.showPreviousBtn = true;

			let checkDate = new Date(mDate);
			checkDate.setMonth(checkDate.getMonth() + 1);

			this.fromDate = this.selectedDate;
			this.toDate = checkDate;

			let from = this.createNewDateWithFormat('-', this.selectedDate);
			let to = this.createNewDateWithFormat('-', checkDate);
			this.refreshGraphWithDate(from, to, 2);

			if (checkDate > this.userLastMoodCheck) {
				this.showNextBtn = false;
				this.dateIndicator = "30 days"
				this.dateIndicatorLast = "Last 30 days"
				this.isDateRangeData = false;
				this.dateRangeRequestType = 0;
			}
		} else if (type == 3) {

			let postCount = this.meta["postCount"];

			if (postCount > 0) {
				this.dateIndicator = this.generateDateLabel(mDate);
				this.dateIndicatorLast = this.generateDateLabel(mDate);
			} else {
				this.showNextBtn = false;
				this.dateIndicator = "30 days"
				this.dateIndicatorLast = "Last 30 days"
				this.isDateRangeData = false;
				this.dateRangeRequestType = 0;
			}

			let checkDate = new Date(this.toDate);
			checkDate.setDate(checkDate.getDate() + 1);

			let from = this.createNewDateWithFormat('-', this.fromDate);
			let to = this.createNewDateWithFormat('-', checkDate);
			this.refreshGraphWithDate(from, to, 3);

		} else {
			let dateNow = new Date();
			let checkDate = new Date();
			dateNow.setMonth(dateNow.getMonth() - 1);

			let from = this.createNewDateWithFormat('-', dateNow);
			let to = this.createNewDateWithFormat('-', new Date());
			this.fromDate = dateNow;
			this.refreshGraphWithDate(from, to, 0);
		}
	}

	/**
	* Generate a date range within 30 days.
	*
	* @example
	* Call and pass the date.
	* generateDateLabel(Aug 23, 2018)
	*
	* @param {Date} startDate Starting date to generate the range.
	* @returns String generated format.
	*/

	generateDateLabel(startDate: Date) {
		let strStartDate = startDate.toDateString();
		let endDate = new Date();

		endDate.setDate(startDate.getDate());
		endDate.setMonth(startDate.getMonth() + 1);

		let strEndDate = endDate.toDateString();
		let splitStartDate = strStartDate.split(" ");
		let splitEndDate = strEndDate.split(" ");

		return splitStartDate[1] + " " + splitStartDate[2] + " - " + splitEndDate[1] + " " + splitEndDate[2];
	}

	/**
	* Generate a date with a basic format.
	*
	* @example
	* createNewDateWithFormat('-',Aug 23, 2018)
	*
	* @param {Date} startDate Starting date to generate the range.
	* @returns String generated format.
	*/

	createNewDateWithFormat(format: String, date: Date) {
		let month = (date.getMonth() + 1).toString();
		let day = date.getDate().toString();
		let year = date.getFullYear().toString();

		return year + format + month + format + day;
	}

	/**
	* Hide Or show date range buttons.
	*
	* @example
	* hideOrShowDateRangeButtons(meta)
	*
	* @param {any} meta Meta parameter fetched from the backend.
	*/

	hideOrShowDateRangeButtons(meta: any) {
		let postCount = meta["postCount"];
		let preCount = meta["preCount"];
		this.showNextBtn = (postCount > 0) ? true : false;
		this.showPreviousBtn = (preCount > 0) ? true : false;
	}

	/**
	* Calculate the number of days between 2 dates.
	*
	* @calculateNumberOfDays
	* hideOrShowDateRangeButtons(Aug 2, 2018,Aug 31, 2018)
	*
	* @param {Date} start Start date.
	* @param {Date} end End date.
	*/

	calculateNumberOfDays(start, end) {
		//Get 1 day in milliseconds
		var one_day = 1000 * 60 * 60 * 24;

		// Convert both dates to milliseconds
		var date1_ms = start.getTime();
		var date2_ms = end.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = date2_ms - date1_ms;

		// Convert back to days and return
		return Math.round(difference_ms / one_day);
	}

	tabChanged(tabChangeEvent: MatTabChangeEvent): void {
	
		if (tabChangeEvent.index === 0) {
			this.chartIcon = 'tabIconActive';
			this.listIcon = 'tabIconInActive';

			//refresh graph
			this.heatmapChart.config.data = this.moodcheckData = this.mcService.getHeatmapData(this.moodchecks, this.heatmapMode, this.toDate);
			this.heatmapChart.config.options = this.moodcheckoptions();
			this.heatmapChart.update();

			this.moodcheckCountChart.config.data = this.moodcheckCountData();
			this.moodcheckCountChart.update();

			this.moodPercentageChart.config.data = this.moodPercentageData();
			this.moodPercentageChart.update();

		} else {
			this.chartIcon = 'tabIconInActive';
			this.listIcon = 'tabIconActive';
		}
	}

	onDelete(id) {
		this.modalService.showConfirmation("Delete", this.moodcheckText.popups.deleteBody).afterClosed().subscribe(result => {
			if (result) {
				this.api.delete('moodcheck/' + id).subscribe(
					(result: any) => {
						this.mcService.triggerRefresh();
					},
					(error: any) => {

					}
				);
			}
		});
	}
}
