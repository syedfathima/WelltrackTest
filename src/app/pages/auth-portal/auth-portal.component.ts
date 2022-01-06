import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AuthService } from '../../lib/auth.service';
import { Router } from '@angular/router';
import { ModalService } from '../../lib/modal.service';
import { UserService } from '../../lib/user.service';
import { MoodcheckModalComponent } from '../../components/moodcheck-modal/moodcheck-modal.component';
import { StorageService } from '../../lib/storage.service';
import { ApiService } from '../../lib/api.service';
import { TutorialPage } from '../../components/tutorial/tutorial';
import { config } from '../../../environments/all';
import { User } from '../../models/user';
import { TranslateService } from '@ngx-translate/core';
import { LogService } from '../../lib/log.service';
import { DemographicComponent } from '../../components/demographic/demographic.component';
import { DemographicResilienceComponent } from '../../components/demographic-resilience/demographic-resilience';
import { IfStmt } from '@angular/compiler';
import { environment } from '../../../environments/environment';
import { UtilityService } from '../../lib/utility.service';
import { PermissionsService } from '../../lib/permissions.service';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { SupportComponent } from '../../components/support/support';
import { MenuService } from '../../lib/menu.service';

declare var jQuery: any;

@Component({
	selector: 'app-auth-portal',
	templateUrl: './auth-portal.component.html',
	styleUrls: ['./auth-portal.component.scss']
})
export class AuthPortalTemplate implements AfterViewInit, OnInit {

	navIn: boolean;
	userType: string;
	playStore: string;
	appStore: string;
	user: User;
	english: boolean = true;
	enableResources: boolean = false;
	enableCoreContributors: boolean = false;
	enableVideo: boolean = false;
	enableMessages: boolean = false;
	hasCounselors: boolean = true;
	userDetailsShow: boolean = false;
	practiceShow: boolean = true;
	theoryShow: boolean = true;
	moodcheckShow: boolean = true;
	assessmentShow: boolean = true;
	calendarShow: boolean = true;
	disabled: boolean = false;
	modal: any;
	locked: boolean = true;
	messagesActive: boolean = false;
	pathActive: string = '';
	demoMode: boolean = false;
	demoClose: boolean = false;
	showDemoClose: boolean = false;
	showCalendar: boolean;
	defaultAssessment: string;
	disableLanguage: boolean;
	podcastsShow: boolean;

	constructor(
		private auth: AuthService,
		private router: Router,
		private storage: StorageService,
		private modalService: ModalService,
		private userService: UserService,
		private translate: TranslateService,
		private logService: LogService,
		private api: ApiService,
		private utilityService: UtilityService,
		private permissionService: PermissionsService,
		private menuService: MenuService
	) {

		this.navIn = false;
		this.user = this.userService.getUser();

		this.appStore = config.appStore;
		this.playStore = config.playStore;

		this.userService.watcher.subscribe((user: User) => {
			this.user = user;
			(this.user.isFullAccess || this.user.userType === 'admin') ? this.locked = false : this.locked = true;
			this.initPermissions();
		});
		this.userType = this.user.userType;
		this.practiceShow = this.user.permissions.practice;
		this.theoryShow = this.user.permissions.theory;
		this.moodcheckShow = this.user.permissions.moodcheck;
		this.assessmentShow = this.user.permissions.assessment;
		this.userDetailsShow = this.user.permissions.userDetails;
		this.pathActive = this.router.url;

		this.demoMode = this.utilityService.isDemoMode();

		// this.menuService.setNavIn(false);
		// this.menuService.setUser(this.userService.getUser());
		// this.menuService.setAppStore(config.appStore);
		// this.menuService.setPlayStore(config.playStore);
		// this.menuService.setUserType(this.user.userType);
		// this.menuService.setPracticeShow(this.user.permissions.practice);
		// this.menuService.setTheoryShow(this.user.permissions.theory);
		// this.menuService.setMoodCheckShow(this.user.permissions.moodcheck);
		// this.menuService.setAssessmentShow(this.user.permissions.assessment);
		// this.menuService.setUserDetailsShow(this.user.permissions.userDetails);
		// this.menuService.setPathActive(this.router.url);
		// this.menuService.setDemoMode(this.utilityService.isDemoMode());
	}

	ngOnInit() {
		this.permissionService.setUser(this.user);

		//A calendar is already shown on the dashboard.
		//we can hide it for counselor's
		if (this.permissionService.canViewScheduler()) {
			this.calendarShow = false;
		} else {
			if (this.user.permissions.calendar) {
				this.calendarShow = true;
			}
		}

		this.initPermissions();
	}

	initPermissions() {

		this.disableLanguage = false;

		if (this.user.primaryOrganization && this.user.primaryOrganization.settings.assessment) {
			this.defaultAssessment = this.user.primaryOrganization.settings.assessment;
		} else {
			this.defaultAssessment = 'das';
		}

		if (this.user.primaryOrganization) {
			if (this.user.primaryOrganization.enableResources) {
				if (this.user.primaryOrganization && this.user.primaryOrganization.settings.assessment === 'resilience') {
					this.enableCoreContributors = this.user.primaryOrganization.enableResources;
				} else {
					this.enableResources = this.user.primaryOrganization.enableResources;
				}
			}

			if (this.user.primaryOrganization.settings && this.user.primaryOrganization.settings.hasCounselors) {
				this.hasCounselors = this.user.primaryOrganization.settings.hasCounselors;
			}

			if (this.user.primaryOrganization.settings && this.user.primaryOrganization.settings.enableVideo) {
				this.enableVideo = this.user.primaryOrganization.settings.enableVideo;
			}

			if(this.user.primaryOrganization.settings && this.user.primaryOrganization.settings.enableMessages) {
				this.enableMessages = this.user.primaryOrganization.settings.enableMessages;
			}

			if (this.user.primaryOrganization && this.user.primaryOrganization.settings['assessment'] === 'resilience') {
				this.disableLanguage = true;
			}

			this.user.primaryOrganization.settings['assessment'] === 'resilience' ? this.podcastsShow = true: this.podcastsShow = false;
		}

		(this.user.isFullAccess || this.user.userType === 'admin') ? this.locked = false : this.locked = true;
	}

	ngAfterViewInit() {
		this.translate.stream('lang').subscribe((res: any) => {
			if (res === 'en') {
				this.english = true;
			} else {
				this.english = false;
			}
		});
		//Close the menu when a link is clicked
		jQuery(document).ready(() => {
			jQuery('#nav li a').click(() => {
				this.navIn = false;
			});
		});
	}

	onMoodCheck() {
		//show moodcheck tutorial
		let assessmentCount = this.user.assessmentCount;
		let resilienceCount = this.user.resilienceCount;
		let showAssessmentOrg = assessmentCount == 0 && this.user.primaryOrganization && this.user.primaryOrganization.settings['showAssessment'] === true;
		let showResilienceOrg = resilienceCount == 0 && this.user.primaryOrganization && this.user.primaryOrganization.settings['showAssessment'] === true;

		if (this.locked) {
			this.ondisabled();
		} else if (this.user.userType === 'user' && (this.user.forceAssessment && (showAssessmentOrg || showResilienceOrg))) {
			setTimeout(() => {
				this.modalService.setCloseOnClickAway(false);
				this.modalService.showComponent(TutorialPage, 'assessmentforce');
			}, 500);
		} else if (!this.storage.checkFlag('finished-tutorial-moodcheck')) {
			this.modalService.showComponent(TutorialPage, 'moodcheck').afterClosed().subscribe(result => {
				this.displayMoodcheck();
			});

		} else {
			this.displayMoodcheck();
		}
	}

	displayMoodcheck() {
		this.modalService.showComponent(MoodcheckModalComponent).afterClosed().subscribe(result => {
			//TODO: refresh data?
		});
	}

	onInviteUser() {

	}

	onNavToggle() {
		this.navIn = !this.navIn;
		if (this.navIn) {
			setTimeout(function () {
				jQuery('nav a').first().focus();
			}, 500);
		} else {
			setTimeout(function () {
				jQuery('.navbar-toggle').focus();
			}, 500);
		}
	}

	onNavClose() {
		this.navIn = false;
		setTimeout(function () {
			jQuery('.navbar-toggle').focus();
		}, 500);
	}

	onLogout() {
		let url = '/';
		if (this.user.primaryOrganization) {
			if (environment.production) {
				let subdomain = this.user.primaryOrganization.subdomain;
				let domain = environment.domain;
				if (subdomain) {
					url = 'https://' + subdomain + '.' + domain;
				} else {
					url = 'https://' + 'app' + '.' + domain;
				}
			}
		}
		if (this.demoMode) {
			this.auth.logout();
			window.open(url, '_self');
		} else {
			this.api.post('users/logout', {}).subscribe(
				(result: any) => {
					if (result.data && result.data.hasOwnProperty("logoutLink")) {
						let urlRedirect = decodeURIComponent(result.data.logoutLink);
						window.open(urlRedirect, '_self');
					}
					else {
						window.open(url, '_self');
					}
					this.auth.logout();
				},
				(error: any) => {
					this.auth.logout();
					window.open(url, '_self');
				}
			);
		}
	}

	nav(path) {

		this.messagesActive = false;
		let assessmentCount = this.user.assessmentCount;
		let resilienceCount = this.user.resilienceCount;

		let allowedUrls = (path === '/app' || path === '/' || path.search('settings') !== -1 || path.search('support') !== -1);
		let showAssessmentOrg = assessmentCount == 0 && this.user.primaryOrganization && this.user.primaryOrganization.settings['showAssessment'] === true;
		let showResilienceOrg = resilienceCount == 0 && this.user.primaryOrganization && this.user.primaryOrganization.settings['showAssessment'] === true;

		if (this.user.userType === 'admin' || path.search('settings') !== -1 || path.search('emergency-contact') !== -1) {
			this.pathActive = path;
			setTimeout(() => {
				this.router.navigate([path]);
				this.onNavClose();
			}, 100);
		} else if (!this.demoMode && this.user.userType === 'user' && this.user.showDemographic && !allowedUrls) {
			setTimeout(() => {
				this.modalService.showComponent(DemographicComponent, null, '', true).afterClosed().subscribe(result => {
					if (result) {
						this.user.showDemographic = false;
						this.userService.setUser(this.user);
						this.pathActive = path;
						setTimeout(() => {
							this.router.navigate([path]);
							this.onNavClose();
						}, 100);
					}
				});


				if (this.user.primaryOrganization && this.user.primaryOrganization.settings.assessment === 'resilience') {
					this.modalService.showComponent(DemographicResilienceComponent, null, '', true).afterClosed().subscribe(result => {
						if (result) {
							this.user.showDemographic = false;
							this.userService.setUser(this.user);
							this.pathActive = path;
							setTimeout(() => {
								this.router.navigate([path]);
								this.onNavClose();
							}, 100);
						}
					});
				} else {
					this.modalService.showComponent(DemographicComponent, null, '', true).afterClosed().subscribe(result => {
						if (result) {
							this.user.showDemographic = false;
							this.userService.setUser(this.user);
							this.pathActive = path;
							setTimeout(() => {
								this.router.navigate([path]);
								this.onNavClose();
							}, 100);
						}
					});
				}
			}, 500);
		} else if (!this.demoMode && !this.locked && this.user.userType === 'user' && (this.user.forceAssessment && (showAssessmentOrg || showResilienceOrg))) {
			if (path.search('assessment') === -1) {
				if (this.user.primaryOrganization && this.user.primaryOrganization.settings.assessment === 'resilience') {
					setTimeout(() => {
						this.modalService.showComponent(TutorialPage, 'resilienceforce', '', true);
					}, 500);
				} else {

					setTimeout(() => {
						this.modalService.showComponent(TutorialPage, 'assessmentforce', '', true);
					}, 500);
				}
			}
		} else if (allowedUrls) {
			this.pathActive = path;
			setTimeout(() => {
				this.router.navigate([path]);
				this.onNavClose();
			}, 100);
		} else if (this.locked) {
			this.ondisabled();
		} else {
			this.pathActive = path;
			setTimeout(() => {
				this.router.navigate([path]);
				this.onNavClose();
			}, 100);
		}
	}

	ondisabled() {
		this.modalService.showAlert("Error", 'You must associate your account with an organization or purchase full-access to access all of WellTrack\'s features. Please go to "My settings".');
	}

	onDemoClose() {
		this.demoClose = true;
	}

	onSupportClick() {
		this.modalService.showComponent(SupportComponent);
	}

	onSkipNav() {
		setTimeout(function () {
			jQuery('#page a').eq(1).focus();
		}, 500);

	}
}
