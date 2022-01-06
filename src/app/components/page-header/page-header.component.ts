import { Component, OnInit, Input } from '@angular/core';

import { Chart, ChartData, ChartConfiguration } from 'chart.js';

import * as jQuery from 'jquery';
import * as _ from 'lodash';

import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { LogService } from '../../lib/log.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'page-header',
	templateUrl: './page-header.component.html',
	styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

	@Input() headerText: string;
	@Input() subheaderText = '';
	@Input() midheaderText = '';
	@Input() headerImage: string;
	@Input() backLink: string;
	@Input() routerText: string;
	@Input() cssClass: string;
	@Input() backText: string;
	@Input() underHeader: string;


	constructor(
		private api: ApiService,
		private userService: UserService,
		private log: LogService,
		private storage: StorageService) {

	}

	ngOnInit() {

	}
}
