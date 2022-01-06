import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { Moodcheck } from '../../models/moodcheck';
import { Activity } from '../../models/activity';
import { UserService } from '../../lib/user.service';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../../../environments/all';
import { LocalDataSource } from 'ng2-smart-table';

import * as _ from 'lodash';

@Component({
	selector: 'activity-info.component',
	templateUrl: 'activity-info.component.html',
	styleUrls: ['./activity-info.component.scss'],
})
export class ActivityInfoPage  {
	isLoaded = false;
	activity: Activity[]; 
	activeactivity:  Activity[]; 
	source: any;
	settings: any; 
	cols: any = []; 
	
	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private log: LogService,
		private userService: UserService,
		private activatedRoute: ActivatedRoute,
		private translate: TranslateService
	) {

	}
}
