import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { MoodcheckService } from '../../lib/moodcheck.service';
import { LogService } from '../../lib/log.service';
import { ModalService } from '../../lib/modal.service';
import { PermissionsService } from '../../lib/permissions.service';
import { CalendarService } from '../../lib/calendar.service';
import { TutorialPage } from '../../components/tutorial/tutorial';
import { Invite } from '../../components/invite/invite';
import { MoodcheckModalComponent } from '../../components/moodcheck-modal/moodcheck-modal.component';
import { DemographicComponent } from '../../components/demographic/demographic.component';
import { DemographicResilienceComponent } from '../../components/demographic-resilience/demographic-resilience';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardPage implements OnInit, AfterViewInit {

	user: User;
	showGeneralNotice: boolean = false;
	showNotice: boolean = false;
	usersPaired: User[];
	activeUsers: User[];
	activeUser: User;
	professionalLoaded: boolean = false;
	activeUsersIds: Array<number>;
	events: Event[];
	pickedDate: any;
	donotLoad: boolean = false;
	endUser: boolean = true;
	enableBuddy: boolean = false;
	enableScheduler: boolean = false;
	showAdminDashboard: boolean = false;
	showExecDashboard: boolean = false;
	showProfessionalDashboard: boolean = false;
	showEndUserDashboard: boolean = false;
	locked: boolean = false;

	constructor(
		private api: ApiService,
		private userService: UserService,
		private permissionService: PermissionsService,
		private mcService: MoodcheckService,
		private modalService: ModalService,
		private log: LogService,
		private storage: StorageService,
		private calendarService: CalendarService
	) {
		this.user = this.userService.getUser();

		this.log.screen('Dashboard');

		//listen for data changes
		this.userService.watcher.subscribe((user: User) => {
			this.user = user;
			this.showNotice = false;
		});

		if (this.user.noticeOn) {
			this.showNotice = true;
		}

		if (!this.storage.get('challenge_notification')) {
			this.showGeneralNotice = (this.user.totalChallengesCount > 0) ? true : false;
		}

	}

	ngOnInit() {
		(this.user.isFullAccess || this.user.userType === 'admin') ? this.locked = false : this.locked = true;
		this.permissionService.setUser(this.user);

		if (this.user.userType === 'admin') {
			this.showAdminDashboard = true;
		} else {
			if (this.permissionService.canViewScheduler()) {
				this.api.get('userspaired').subscribe(
					(results: any) => {
						this.activeUsers = User.initializeArray(results.data);
						this.professionalLoaded = true;
					},
					(error: any) => {
						this.log.error('Error loading. ' + error.message);
						this.professionalLoaded = true;
					}
				);
				this.enableScheduler = true;
				if(this.permissionService.isExecutive() && this.permissionService.canViewOldExecutiveDashboard){
					this.showExecDashboard = true;
				}

			} else if (this.permissionService.isExecutive() && this.permissionService.canViewOldExecutiveDashboard) {
				this.showExecDashboard = true;
			} else {
				this.showEndUserDashboard = true;
			}
		}
	}

	ngAfterViewInit() {
		this.checkPopUps();
	}

	checkPopUps() {
		if ((this.user.userType === 'user') && !this.locked) {
		
			let assessmentCount = this.user.assessmentCount;
			let resilienceCount = this.user.resilienceCount;
			/*
			*  If the organization is configured to force assessment
			*/
			let showAssessmentOrg = assessmentCount == 0 && this.user.primaryOrganization && this.user.primaryOrganization.settings['showAssessment'] === true;
			let showResilienceOrg = resilienceCount == 0 && this.user.primaryOrganization && this.user.primaryOrganization.settings['showAssessment'] === true;
			if (this.user.userType === 'user' && this.user.showDemographic) {
				setTimeout(() => {
					if (this.user.primaryOrganization && this.user.primaryOrganization.settings.assessment === 'resilience' ) {
						this.modalService.showComponent(DemographicResilienceComponent, null, '', true).afterClosed().subscribe(result => {
							if (result) {
								this.user.showDemographic = false;
								this.userService.setUser(this.user);
								this.checkPopUps();
							}
						});
					} else {
						this.modalService.showComponent(DemographicComponent, null, '', true).afterClosed().subscribe(result => {
							if (result) {
								this.user.showDemographic = false;
								this.userService.setUser(this.user);
								this.checkPopUps();
							}
						});
					}

				}, 500);
			} else if (this.user.userType === 'user' &&  this.user.forceAssessment) {
				if (this.user.primaryOrganization && this.user.primaryOrganization.settings.assessment === 'resilience' ) {
					setTimeout(() => {
						this.modalService.showComponent(TutorialPage, 'resilienceforce', '', true);
					}, 500);
				} else{
				
					setTimeout(() => {
						this.modalService.showComponent(TutorialPage, 'assessmentforce', '', true);
					}, 500);
				}
			} else if (!this.storage.checkFlag('finished-tutorial-welcome')) {
				setTimeout(() => {
					this.modalService.showComponent(TutorialPage, 'welcome').afterClosed().subscribe(result => {
						if (!this.storage.checkFlag('finished-tutorial-moodcheck')) {
							this.storage.setFlag('finished-tutorial-moodcheck')
							this.displayMoodcheck();
						}
					});
				}, 500);
			} else if (!this.storage.checkFlag('finished-tutorial-moodcheck')) {
				this.storage.setFlag('finished-tutorial-moodcheck')
				this.displayMoodcheck();
			} else if (!this.storage.checkReminder('reminder-practice') && this.user.primaryOrganization) {
				setTimeout(() => {
					this.modalService.showComponent(TutorialPage, 'practice');
				}, 500);
				this.storage.setReminder('reminder-practice');
			} else {
				
				//do nothing
			}
			/*
				else {
					if (!this.storage.checkReminder('reminder-assessment')) {
						setTimeout(() => {
							this.modalService.showComponent(TutorialPage, null, 'assessment');
						}, 500);
					}
				}
			*/
		}
	}

	displayMoodcheck() {
		this.modalService.showComponent(TutorialPage, 'moodcheck').afterClosed().subscribe(result => {
			this.modalService.showComponent(MoodcheckModalComponent);
		});
	}

	updateUsers(event) {
		this.activeUsers = event;
		this.activeUsersIds = [];
		this.activeUsers.forEach(user => {
			this.activeUsersIds.push(user.id);
		});
	}

	updateUser(event) {
		if (event) {
			this.activeUser = event;
		} else {
			this.activeUser = null;
		}
	}

	updateEvents(event) {
		this.events = event.events;
		this.pickedDate = event.date;
	}


	inviteShare() {
		let inviteInfo = {
			'type': 'professional',
			'endpoint': 'userinvite',
			'forceShare': true,
			'orgId': this.user.primaryOrganization.id
		};
		this.modalService.showComponent(Invite, inviteInfo);
	}

}
