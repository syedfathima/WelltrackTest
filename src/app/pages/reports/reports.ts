import { Component, OnInit } from '@angular/core';
import { User } from '../../../app/models/user';
import { Organization } from '../../../app/models/organization';
import { UserService } from '../../../app/lib/user.service';
import { ApiService } from '../../../app/lib/api.service';
import { LogService } from '../../../app/lib/log.service';

import { ModalService } from '../../../app/lib/modal.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { MultiAutoItem } from '../../models/multiautoitem';

declare var window;
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
	selector: 'page-reports',
	templateUrl: 'reports.html',
	styleUrls: ['./reports.scss'],

})
export class ReportsPage implements OnInit {

	user: User;
	organizationIds: Array<any> = [];
	from: Date;
	to: Date;
	organizations: Organization[];
	isLoaded: boolean = false;
	loading: boolean = false;
	resultsLoadedGeneral: boolean = false;
	resultsLoadedEffectiveness: number = 0;
	resultsLoadedAggregate: boolean = false;
	generalData: any;
	effectivenessData: any;
	effectivenessDataYear1: any;
	effectivenessDataYearHigher: any;
	effectivenessDataYearMale: any;
	effectivenessDataYearFemale: any;
	effectivenessDataYearReferred: any;
	effectivenessDataYearSynched: any;
	aggregateData: any;
	columnCount: number;
	multiSelOrgs: Array<MultiAutoItem> = [];

	constructor(
		private userService: UserService,
		private log: LogService,
		private api: ApiService,
		private modalService: ModalService
	) {
		this.user = this.userService.getUser();
		this.from = new Date();
		this.from.setFullYear(this.from.getFullYear() - 1);
		this.to = new Date();
	}

	ngOnInit() {

		this.api.get('admin/organizations').subscribe(
			(results: any) => {
				this.organizations = Organization.initializeArray(results.data);
				this.organizations.forEach((org) => {
					this.multiSelOrgs.push(new MultiAutoItem(org.id, org.name));
				});
				this.isLoaded = true;
			},
			(error: any) => {

				this.log.error('Error loading. ' + error.message);
				this.isLoaded = true;

			}
		);

	}

	onSelectOrgs(items: MultiAutoItem[]) {
		this.organizationIds = [];
		this.organizationIds = items.map((item) => item.id);
	}

	onGenerate() {
		/*
			if (this.organizationIds.length == 0) {
				this.modalService.showAlert('Error', 'Please select at least one organization');
				return;
			}
		*/

		let fromFormatted = moment.parseZone(this.from).format('YYYY-MM-DD');
		let toFormatted = moment.parseZone(this.to).format('YYYY-MM-DD');
		this.loading = true;

		this.onGeneral(fromFormatted, toFormatted);
		this.onEffectiveness(fromFormatted, toFormatted);
		this.onAggregate(fromFormatted, toFormatted);

	}

	onGeneral(fromFormatted, toFormatted) {
		this.api.post('reports/general', {
			From: fromFormatted,
			To: toFormatted,
			OrgID: this.organizationIds,
		}).subscribe(
			(results: any) => {
				this.loading = false;
				this.resultsLoadedGeneral = true;
				this.generalData = results.data;
			},
			(error: any) => {

				this.loading = false;
			},
			() => {

			}
		);
	}


	onEffectiveness(fromFormatted, toFormatted) {
		this.resultsLoadedEffectiveness = 0;

		this.api.post('reports/effectiveness', {
			From: fromFormatted,
			To: toFormatted,
			OrgID: this.organizationIds,
		}).subscribe(
			(results: any) => {
				this.loading = false;
				this.effectivenessData = results;
				this.columnCount = this.effectivenessData.data.length;
				this.resultsLoadedEffectiveness++;
			},
			(error: any) => {
				this.loading = false;
			},
			() => {

			}
		);

		this.api.post('reports/effectiveness', {
			From: fromFormatted,
			To: toFormatted,
			OrgID: this.organizationIds,
			demographic_year: 1
		}).subscribe(
			(results: any) => {
				this.effectivenessDataYear1 = results;
				this.resultsLoadedEffectiveness++;
			},
			(error: any) => {

				this.loading = false;
			},
			() => {

			}
		);

		this.api.post('reports/effectiveness', {
			From: fromFormatted,
			To: toFormatted,
			OrgID: this.organizationIds,
			demographic_year: 'higher'
		}).subscribe(
			(results: any) => {
				this.effectivenessDataYearHigher = results;
				this.resultsLoadedEffectiveness++;
			},
			(error: any) => {

				this.loading = false;
			},
			() => {

			}
		);

		this.api.post('reports/effectiveness', {
			From: fromFormatted,
			To: toFormatted,
			OrgID: this.organizationIds,
			gender: 'Male'
		}).subscribe(
			(results: any) => {
				this.effectivenessDataYearMale = results;
				this.resultsLoadedEffectiveness++;
			},
			(error: any) => {

				this.loading = false;
			},
			() => {

			}
		);

		this.api.post('reports/effectiveness', {
			From: fromFormatted,
			To: toFormatted,
			OrgID: this.organizationIds,
			gender: 'Female'
		}).subscribe(
			(results: any) => {
				this.effectivenessDataYearFemale = results;
				this.columnCount = this.effectivenessData.data.length;
				this.resultsLoadedEffectiveness++;
			},
			(error: any) => {

				this.loading = false;
			},
			() => {

			}
		);

		this.api.post('reports/effectiveness', {
			From: fromFormatted,
			To: toFormatted,
			OrgID: this.organizationIds,
			referred: true
		}).subscribe(
			(results: any) => {
				this.effectivenessDataYearReferred = results;
				this.columnCount = this.effectivenessData.data.length;
				this.resultsLoadedEffectiveness++;
			},
			(error: any) => {

				this.loading = false;
			},
			() => {

			}
		);

		this.api.post('reports/effectiveness', {
			From: fromFormatted,
			To: toFormatted,
			OrgID: this.organizationIds,
			synched: true
		}).subscribe(
			(results: any) => {
				this.effectivenessDataYearSynched = results;
				this.columnCount = this.effectivenessData.data.length;
				this.resultsLoadedEffectiveness++;
			},
			(error: any) => {
				this.loading = false;
			},
			() => {

			}
		);
	}

	onAggregate(fromFormatted, toFormatted) {
		this.api.post('reports/aggregate', {
			From: fromFormatted,
			To: toFormatted,
			OrgID: this.organizationIds,
			synched: true
		}).subscribe(
			(results: any) => {
				this.loading = false;
				this.resultsLoadedAggregate = true;
				this.aggregateData = results;
			},
			(error: any) => {

				this.loading = false;
			},
			() => {

			}
		);
	}

	onGeneralExport() {
		let fromFormatted = moment.parseZone(this.from).format('YYYY-MM-DD');
		let toFormatted = moment.parseZone(this.to).format('YYYY-MM-DD');
		var data = [];
		let options = this.exportOptions();
		let title = 'Data export for ' + ' ';
		let organizationName = '';
		for (let i = 0; i < this.organizationIds.length; i++) {
			let index = _.findIndex(this.organizations, { 'id': this.organizationIds[i] });
			organizationName += this.organizations[index].name + ' ';
		}
		title += organizationName;

		data.push({ 'name': 'General stats' });
		data.push({ 'name': 'Total users (all time)', 'value': this.generalData.totalusers });
		data.push({ 'name': 'Signups', 'value': this.generalData.signups });
		data.push({ 'name': 'Logins', 'value': this.generalData.logins });
		data.push({ 'name': 'MoodCheck users', 'value': this.generalData.moodcheckUsers });
		data.push({ 'name': 'MoodCheck alerts', 'value': this.generalData.moodalerts });
		data.push({ 'name': 'Users synched', 'value': this.generalData.pairedCount });
		data.push({ 'name': 'Returning Users', 'value': this.generalData.returningUsers });
		data.push({ 'name': 'Invites Accepted/Sent', 'value': this.generalData.inviteAcceptedCount + '/' + this.generalData.inviteCount + '(' + this.generalData.inviteAcceptedCount / this.generalData.inviteCount * 100 + '%)' });

		data.push({ 'name': '' });
		data.push({ 'name': 'Courses and tools completed' });
		data.push({ 'name': 'MoodCheck count', 'value': this.generalData.moodcheckCount });
		data.push({ 'name': 'Assessment count', 'value': this.generalData.dasCount });
		data.push({ 'name': 'Depression courses viewed', 'value': this.generalData.depressionCount });
		data.push({ 'name': 'Anxiety courses viewed', 'value': this.generalData.anxietyCount });
		data.push({ 'name': 'Fun achievement submitted', 'value': this.generalData.funachievementCount });
		data.push({ 'name': 'Thought diary submitted', 'value': this.generalData.thoughtCount });
		data.push({ 'name': 'Activity scheduler submitted', 'value': this.generalData.activityscheduleCount });

		data.push({ 'name': '' });
		data.push({ 'name': 'DAS Improvement' });
		data.push({ 'name': 'Number users got better', 'value': this.generalData.gotbetter.improvementon1 });
		data.push({ 'name': 'Number users got better on 2 levels', 'value': this.generalData.gotbetter.improvementon2 });
		data.push({ 'name': 'Number users got better on 3 levels', 'value': this.generalData.gotbetter.improvementon3 });
		data.push({ 'name': 'Number users got better on depression', 'value': this.generalData.gotbetter.improvementDepression });
		data.push({ 'name': 'Number users got better on anxiety', 'value': this.generalData.gotbetter.improvementAnxiety });
		data.push({ 'name': 'Number users got better on stress', 'value': this.generalData.gotbetter.improvementStress });
		data.push({ 'name': 'Depression level changes', 'value': 'From ' + this.generalData.das.depression.firstlevel.level + ' (' + this.generalData.das.depression.firstavg + ' )' + ' to ' + this.generalData.das.depression.lastlevel.level + ' (' + this.generalData.das.depression.lastavg + ')' });
		data.push({ 'name': 'Anxiety level changes', 'value': 'From ' + this.generalData.das.anxiety.firstlevel.level + ' (' + this.generalData.das.anxiety.firstavg + ' )' + ' to ' + this.generalData.das.anxiety.lastlevel.level + ' (' + this.generalData.das.anxiety.lastavg + ')' });
		data.push({ 'name': 'Stress level changes', 'value': 'From ' + this.generalData.das.stress.firstlevel.level + ' (' + this.generalData.das.stress.firstavg + ' )' + ' to ' + this.generalData.das.stress.lastlevel.level + ' (' + this.generalData.das.stress.lastavg + ')' });

		title += 'from ' + fromFormatted;
		title += ' to ' + toFormatted;
		new AngularCsv(data, title, options);
	}

	onEffectivenessExport() {
		let fromFormatted = moment.parseZone(this.from).format('YYYY-MM-DD');
		let toFormatted = moment.parseZone(this.to).format('YYYY-MM-DD');
		let data = [];
		let options = this.exportOptions();

		let title = 'Data export for ' + ' ';
		let organizationName = '';
		for (let i = 0; i < this.organizationIds.length; i++) {
			let index = _.findIndex(this.organizations, { 'id': this.organizationIds[i] });
			organizationName += this.organizations[index].name + ' ';
		}
		title += organizationName;

		data.push({ 'name': 'Total signups', 'value': this.effectivenessData.totals.userCount });
		data.push({ 'name': 'Total logins', 'value': this.effectivenessData.totals.loginCount });
		data.push({ 'name': 'Total assessment users', 'value': this.effectivenessData.totals.dasUsers });
		data.push({ 'name': 'Total improved users', 'value': this.effectivenessData.totals.improvementCount });

		data.push({ spacer: '' });
		data.push({ spacer: 'All' });
		data = this.effectiveDataFormat(data, this.effectivenessData);
		data.push({ spacer: '' });
		data.push({ spacer: 'Year 1' });
		data = this.effectiveDataFormat(data, this.effectivenessDataYear1);
		data.push({ spacer: '' });
		data.push({ spacer: 'Higher than year 1' });
		data = this.effectiveDataFormat(data, this.effectivenessDataYearHigher);
		data.push({ spacer: '' });
		data.push({ spacer: 'Female' });
		data = this.effectiveDataFormat(data, this.effectivenessDataYearFemale);
		data.push({ spacer: '' });
		data.push({ spacer: 'Male' });
		data = this.effectiveDataFormat(data, this.effectivenessDataYearMale);
		data.push({ spacer: '' });
		data.push({ spacer: 'Referred by counselor' });
		data = this.effectiveDataFormat(data, this.effectivenessDataYearReferred);
		data.push({ spacer: '' });
		data.push({ spacer: 'Synched with counselor' });
		data = this.effectiveDataFormat(data, this.effectivenessDataYearSynched);

		title += 'from ' + fromFormatted;
		title += ' to ' + toFormatted;
		new AngularCsv(data, title, options);
	}

	effectiveDataFormat(data, effectivenessData) {

		let row0 = { field0: '' };
		let row1 = { field0: 'New Account' };
		let row2 = { field0: 'Logins' };
		let row3 = { field0: 'People helped - Depression' };
		let row4 = { field0: 'People helped - Anxiety' };
		let row5 = { field0: 'People helped - Stress' };
		let row6 = { field0: 'People helped total' };
		let row7 = { field0: 'Assessment users' };
		let row8 = { field0: 'Total people helped' };

		row7['total'] = effectivenessData.totals.dasUsers;
		row8['total'] = effectivenessData.totals.improvementCount;

		var key = 1;
		for (let datarow of effectivenessData.data) {
			row0['field' + key] = datarow.date;
			row1['field' + key] = datarow.userCount;
			row2['field' + key] = datarow.loginCount;
			row3['field' + key] = datarow.depressionImprovement;
			row4['field' + key] = datarow.anxietyImprovement;
			row5['field' + key] = datarow.stressImprovement;
			row6['field' + key] = datarow.totalImprovement;
			key++;
		}
		data[data.length] = row0;
		data.push(row1);
		data.push(row2);
		data.push(row3);
		data.push(row4);
		data.push(row5);
		data.push({ spacer: '' });
		data.push(row6);
		data.push(row7);
		return data;
	}

	exportOptions() {
		return {
			fieldSeparator: ',',
			quoteStrings: '"',
			decimalseparator: '.',
			showLabels: true,
			showTitle: false,
			useBom: true,
			noDownload: false,
		};
	}

}
