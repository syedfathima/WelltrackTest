import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { TranslateService } from '@ngx-translate/core';
import { Assessment } from '../../models/assessment';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { ModalService } from '../../lib/modal.service';

@Component({
	selector: 'page-resilience-listing',
	templateUrl: 'resilience-listing.html',
	styleUrls: ['./resilience-listing.scss'],
})
export class ResilienceListingPage implements OnInit {

	title: string;
	back: string;
	user: User;
	assessments: Assessment[];

	rendered: boolean;
	popup: any;
	backLink: string = '/app/assessments';

	stressGraph: Chart;
	depressionGraph: Chart;
	anxietyGraph: Chart;

	constructor(private api: ApiService,
		private log: LogService,
		private storage: StorageService,
		private translate: TranslateService,
		private userService: UserService,
		private modalService: ModalService
	) {
		this.user = this.userService.getUser();
	}

	ngOnInit() {
		this.translate.stream('resilience').subscribe((res: any) => {
			this.title = res.title;
			this.back = res.back;
		});

		this.translate.stream('error').subscribe((res: any) => {
			this.popup = res.title;
		});

		this.api.get('assessments/resilience').subscribe(
			(result: any) => {
				this.assessments = Assessment.initializeArray(result.data);
			},
			(error: any) => {
				this.log.error('Error getting assessment questions. ' + error.message);
			},
		);
	}

	getCount(data: [any], level: String) {
		let objects = data.filter(function (el) {
			return el.label === level;
		});

		return objects.length;
	}


}
