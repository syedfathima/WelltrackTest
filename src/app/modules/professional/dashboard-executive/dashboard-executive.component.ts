import { Component, OnInit, AfterViewInit } from '@angular/core';

//import { AboutPage } from '../about/about';


import { Chart, ChartData, ChartConfiguration } from 'chart.js';

import * as jQuery from 'jquery';
import * as _ from 'lodash';

import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { User } from '../../../models/user';
import { UserService } from '../../../lib/user.service';
import { MoodcheckService } from '../../../lib/moodcheck.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../../../../environments/all';

@Component({
	selector: 'app-dashboard-executive',
	templateUrl: './dashboard-executive.component.html',
	styleUrls: ['./dashboard-executive.component.scss']
})
export class DashboardPageExecutive implements OnInit {


	user: User;
	popup: any;

	constructor(
		private userService: UserService,
		private translate: TranslateService) {
		this.user = this.userService.getUser();

		this.userService.watcher.subscribe((user: User) => {
			this.user = user;
		});

	}

	ngOnInit() {

		this.translate.stream('error').subscribe((res: any) => {
			this.popup = res.title;
		});
	}
}
