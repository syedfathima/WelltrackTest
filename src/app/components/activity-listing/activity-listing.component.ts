import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { Router } from '@angular/router';
import { Organization } from '../../models/organization';
import { Activity } from '../../models/activity';
import { UserService } from '../../lib/user.service';
import { TranslateService } from '@ngx-translate/core';


import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'activity-listing',
	styleUrls: ['./activity-listing.component.scss'],
	templateUrl: 'activity-listing.component.html'
})

export class ActivityListingComponent implements OnInit {
	isLoaded = false;
	activity: Activity[];
	activeactivity: Activity[];
	organizationId: any = [];
	activityTypeId: any = [];
	activityTypes: any;
	from: Date;
	to: Date;
	source: any;
	settings: any;
	cols: any = ['', '', ''];
	offset: number = 0;
	organizations: Organization[];
	loading: boolean = false;
	loadMoreLoading: boolean = false;

	@Input() userId: number = null;
	@Input() orgId: number = null;
	@Input() orgListingEnable: boolean = true;
	@Input() userListingEnable: boolean = true;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private log: LogService,
		private userService: UserService,
		private activatedRoute: ActivatedRoute,
		private translate: TranslateService
	) {
		this.from = new Date();
		this.from.setFullYear(this.from.getFullYear() - 1);
		this.to = new Date();
	}

	ngOnInit() {
		this.loading = true;
		let args = {};
		if (this.userId) {
			args['UserID'] = this.userId;
		}

		if (this.orgId) {
			args['OrgID'] = this.orgId;
		}

		if (this.cols[0]) {
			args['Message'] = this.cols[0];
		}

		if (this.cols[1]) {
			args['Name'] = this.cols[1];
		}

		if (this.cols[2]) {
			args['OrganizationName'] = this.cols[2];
		}

		this.api.get('admin/organizations', { Active: true }).subscribe(
			(results: any) => {
				this.organizations = Organization.initializeArray(results.data);
				this.isLoaded = true;
			},
			(error: any) => {

				this.log.error('Error loading. ' + error.message);
			}
		);


		this.api.get('admin/activityTypes').subscribe(
			(results: any) => {
				this.activity = this.activityTypes = results.data;
				this.isLoaded = true;
			},
			(error: any) => {
				this.log.error('Error loading. ' + error.message);
				this.isLoaded = false;
			}
		);


		this.api.get('admin/activity', args).subscribe(
			(results: any) => {
				this.activity = this.activeactivity = Activity.initializeArray(results.data);
				this.isLoaded = true;
				this.loading = false; 
			},
			(error: any) => {
				this.log.error('Error loading. ' + error.message);
				this.isLoaded = false;
				this.loading = false; 
			}
		);
	}

	valueChange(i) {

		let filterValue = this.cols[i].toLowerCase();
		let empty = this.reset();

		if (!empty) {
			let key = '';
			if (i == 0) {
				key = 'message';
			}
			else if (i == 1) {
				key = 'userId';
			}
			else {
				return;
			}
			let cols = this.cols;
			let resp = _.filter(this.activeactivity, function (o) {
				for (i = 0; i < cols.length; i++) {
					if (o[key].toLowerCase().search(filterValue) === -1) {
						return false;
					}
				}
				return true;
			});
			this.activeactivity = resp;
		}
		else {
			this.activeactivity = this.activity;
		}
	}

	reset() {

		if (this.cols[0] === '' && this.cols[1] === '' && this.cols[2] === '') {
			return true;
		}
		else {
			return false;
		}

	}


	loadMore(isBuild = false) {
		this.offset = this.activity.length;
		this.loading = isBuild;
		this.loadMoreLoading = true;
		let fromFormatted = moment.parseZone(this.from).format('YYYY-MM-DD');
		let toFormatted = moment.parseZone(this.to).format('YYYY-MM-DD');
		this.api.get('admin/activity', {
			Limit: 100,
			Offset: this.offset,
			organizationId: this.organizationId,
			activityTypeId: this.activityTypeId,
			from: fromFormatted,
			to: toFormatted
		}).subscribe(
			(results: any) => {
				for (let activityrow of results.data) {
					this.activity[this.activity.length] = new Activity(activityrow);
				}
				this.activeactivity = this.activity;
				this.loading = false;
				this.loadMoreLoading = false;
			},
			(error: any) => {

				this.log.error('Error loading. ' + error.message);
				this.isLoaded = true;
				this.loading = false;
				this.loadMoreLoading = false;
			}
		);
	}

	onGenerate() {
		this.activity = [];
		this.offset = 0;
		this.loadMore(true);
	}



}
