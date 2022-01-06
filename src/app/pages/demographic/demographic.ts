import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { LogService } from '../../lib/log.service';
import { Organization } from '../../models/organization';


@Component({
	selector: 'page-demographic',
	templateUrl: 'demographic.html',
	styleUrls: ['./demographic.scss']
})
export class DemographicPage implements OnInit {
	checked = false;
	indeterminate = false;
	labelPosition = 'after';
	disabled = false;
	step: number;
	steps: number[];
	
	organizations: Organization[];

	constructor(
		private api: ApiService,
		private log: LogService
	) {

	}

	ngOnInit() {

		this.api.get('admin/organizations').subscribe(
			(results: any) => {
				this.organizations = Organization.initializeArray(results.data);
			},
			(error: any) => {
				
				this.log.error('Error loading. ' + error.message);

			}
		);
	}
}
