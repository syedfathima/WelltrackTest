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
	templateUrl: 'challenge-public-listing.html',
	styleUrls: ['./challenge-public-listing.scss'],
})
export class ChallengePublicListing implements OnInit, AfterViewInit {

	user: User;
	isLoaded: boolean;
	challenges: Challenge[];

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private log: LogService,
		private userService: UserService,
		private translate: TranslateService
	) {


	}


	ngOnInit() {
		this.translate.stream('challenges').subscribe((res: any) => {

		});

		this.api.get('challenges/public').subscribe(
			(result: any) => {
				this.challenges = Challenge.initializeArray(result.data);

			},
			(error: any) => {
				this.log.error('Error getting challenges. ' + error.message);
			},
			() => {
			}
		);
	}
	ngAfterViewInit() {

	}

	refreshContent() {

	}


}
