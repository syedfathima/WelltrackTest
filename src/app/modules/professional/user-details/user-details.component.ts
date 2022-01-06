import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { LogService } from '../../../lib/log.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { Moodcheck } from '../../../models/moodcheck';
import { Activity } from '../../../models/activity';
import { UserService } from '../../../lib/user.service';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../../../../environments/all';
import { ModalService } from '../../../lib/modal.service';
import { Assessment } from '../../../models/assessment';

@Component({
	selector: 'user-details.component',
	templateUrl: 'user-details.component.html',
	styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsPage implements OnInit {
	isloaded: boolean = false;
	user: User;
	userViewed: User;
	fullName: string;
	loginOn: string = '';
	id: number;
	paramsSub: any;
	activity: Array<Object> = [];
	moodchecks: Array<Object> = [];
	moodcheckimage: string = '';
	avgmoodcheck: number = 0;
	error: any;
	showMore: boolean = false;
	appointment: boolean = false;
	alerts: number = 0;
	avg: number = 0;
	emotion: string = '';
	isAdmin = false;
	userType = '';
	organization = '';
	popup: any;
	assessments: Assessment[];
	showAssessment: boolean = false;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private log: LogService,
		private userService: UserService,
		private activatedRoute: ActivatedRoute,
		private translate: TranslateService,
		private modalService: ModalService
	) {

	}

	ngOnInit() {

		this.translate.stream('error').subscribe((res: any) => {
			this.error = res.title;
		});

		this.translate.stream('userDetails.popup').subscribe((res: any) => {
			this.popup = res;
		});

		if (this.router.url.slice(1, 6) === 'admin') {
			this.isAdmin = true;
		} else {
			this.isAdmin = false;
		}

		this.paramsSub = this.activatedRoute.params.subscribe(params => {
			this.id = parseInt(params['id'], 10);
			this.initData();
		}
		);

	}

	initData() {

		this.api.get('users/' + this.id, {
		}).subscribe(
			(result: any) => {
				this.user = new User(result.data);
				this.fullName = this.user.fullName;
				this.loginOn = this.user.loginOn;
				this.alerts = this.user.alertsCount;
				this.userType = this.user.userType;
				if (this.user.primaryOrganization) {
					this.organization = this.user.primaryOrganization.name;
				}

				if (this.user.avgMoodcheck) {
					this.avg = this.user.avgMoodcheck;
					this.moodcheckimage = './assets/img/moodcheck/' + (10 - this.avg) + '@2x.png'
					this.emotion = this.user['avgMoodcheckText'];
				}

				this.isloaded = true;
			},
			(error: any) => {
				this.log.error('Error fetching user. ' + error.message);
			}
		);


		this.api.post('users/activity', {
			UserID: this.id,
			Limit: 10
		}).subscribe(
			(result: any) => {
				this.activity = Activity.initializeArray(result.data);
			},
			(error: any) => {
				this.log.error('Error fetching activity. ' + error.message);
			}
		);

		this.api.get('moodcheck/latest/' + this.id, {
			Limit: 10
		}).subscribe(
			(result: any) => {
				this.moodchecks = Moodcheck.initializeArray(result.data);
				this.log.debug('moodcheck fetch');
				this.log.debug(this.moodchecks);
			},
			(error: any) => {
				this.log.error('Error fetching activity. ' + error.message);
			}
		);

		this.api.get('assessments', { 'UserID': this.id }).subscribe(
			(result: any) => {
				this.assessments = Assessment.initializeArray(result.data);
				this.showAssessment = true;
			},
			(error: any) => {
				this.log.error('Error getting assessment questions. ' + error.message);
			},
		);

	}

	onCancelShare(userId) {
		let confirmResult;
		this.modalService.showConfirmation("Cancel", this.popup.cancelSharing).afterClosed().subscribe(result => {
			if (result) {
				this.api.delete('counselors/' + userId).subscribe(
					(result: any) => {
						this.modalService.showAlert(this.popup.successtitle, this.popup.success);
						this.router.navigate(['professional/users']);
					},
					(error: any) => {
						this.modalService.showAlert(this.popup.errortitle, this.popup.error);
					}
				);
			}
		});
	}

}
