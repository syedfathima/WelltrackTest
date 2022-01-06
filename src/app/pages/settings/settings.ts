import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../app/lib/user.service';
import { User } from '../../../app/models/user';
import { Organization } from '../../../app/models/organization';
import { ApiService } from '../../../app/lib/api.service';
import { LogService } from '../../lib/log.service';
import { StorageService } from '../../lib/storage.service';
import { ModalService } from '../../lib/modal.service';
import { UtilityService } from '../../lib/utility.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
	styleUrls: ['./settings.scss']
})
export class SettingsPage implements OnInit {

	watcher = new Subject();

	user: User;
	password: String;
	passwordConfirmation: String;
	emailAddress: string;
	avatarUrl: string;
	accessCode: string;
	reminders: boolean;
	popups: any;
	popupsEmail: any;
	organizations: Organization[];
	orgId: number;
	disablePassword: boolean = false;
	activeOrg: boolean;
	emailChange: string;
    wellnesstrackerNotification:any;
	wellnessNotification:any;
	storedUser:any;
	constructor(
		private modalService: ModalService,
		private api: ApiService,
		private storage: StorageService,
		private log: LogService,
		private userService: UserService,
		private utilityService: UtilityService,
		private translate: TranslateService) {

		this.user = this.userService.getUser();
		this.avatarUrl = this.user.getAvatarUrl();
		this.reminders = this.user.preferences.notificationOn;
		this.wellnesstrackerNotification = this.user.preferences.WellnessTrackerNotification;
		this.wellnessNotification = this.user.preferences.WellnessNotifications;
		this.storedUser = this.storage.get('user', true);
		this.setConfig();
	}

	ngOnInit() {
		this.translate.stream('setting.popups').subscribe((res: any) => {
			this.popups = res;
		});

		this.translate.stream('start.popups').subscribe((res: any) => {
			this.popupsEmail = res;
		});

		if(this.user.primaryOrganization  &&  this.user.primaryOrganization.settings.assessment !== 'resilience'){
			this.compileChildren();
		}
	}

	setConfig() {
		if (this.user.primaryOrganization && this.user.primaryOrganization.id) {
			this.orgId = this.user.primaryOrganization.id;
			this.disablePassword = this.user.primaryOrganization.enableSso;
		}
		this.activeOrg = this.user.primaryOrganization !== null ? this.user.primaryOrganization.active : false;


		if (!this.emailChange) {
			this.emailChange = this.user.email;
		}
	}


	updateAvatar() {
		this.avatarUrl = this.user.getAvatarUrl();
	}


	onLoadUser() {

		this.api.get('users/me').subscribe(
			(result: any) => {
				this.user = new User(result.data);
				this.userService.setUser(this.user);
			});
	}

	onSave() {
		//validate
		if (!this.user.fullName || !this.user.email) {
			this.modalService.showAlert(this.popups[0].title, this.popups[0].body);
			return;
		}

		if (this.password && this.password !== this.passwordConfirmation) {
			this.modalService.showAlert(this.popups[1].title, this.popups[1].body);
			return;
		}

		let params: any = {
			Name: this.user.fullName
		};

		if (this.password) {
			params.Password = this.password;
		}

		if (this.utilityService.demoMode()) {
			return;
		}

		if (this.emailChange !== this.user.email) {
			//save
			this.api.put('users', { Email: this.emailChange }).subscribe(
				(data: any) => {
					this.modalService.showAlert(this.popups[11].title, data.message);
				},
				(error: any) => {
					this.modalService.showAlert(this.popups[7].title, error.message);
				}
			);
		} else {
			//save
			this.api.put('users', params).subscribe(
				(data: any) => {
					this.userService.setUser(this.user);
					this.modalService.showAlert(this.popups[2].title, this.popups[2].body);
				},
				(error: any) => {
					this.modalService.showAlert(this.popups[7].title, error.message);
				}
			);
		}


	}

	onPair() {
		//validate
		if (!this.accessCode && !this.emailAddress) {
			this.modalService.showAlert(this.popups[8].title, this.popups[8].body);
			return;
		}

		if (this.accessCode && this.emailAddress) {
			this.modalService.showAlert(this.popups[9].title, this.popups[9].body);
			return;
		}

		if (this.utilityService.demoMode()) {
			return;
		}

		if (this.accessCode && !this.emailAddress) {
			//make call to server
			this.api.post('users/updateorganization', {
				Code: this.accessCode
			}).subscribe(
				(result: any) => {
					this.api.get('users/me').subscribe(
						(result: any) => {
							this.user = new User(result.data);
							this.userService.setUser(this.user);
							this.setConfig();
						});

					this.storage.setFlag('entered-access-code');
					this.log.event('accesscode_complete');
				},
				(error: any) => {

					this.log.error('Error submitting access code. ' + error.message);
					this.modalService.showAlert(this.popups[7].title, error.message);
				}
			);
		}

		if (!this.accessCode && this.emailAddress) {
			//make call to server
			this.api.post('sendaccesscode', {
				Email: this.emailAddress
			}).subscribe(
				(result: any) => {
					this.modalService.showAlert(this.popupsEmail.success, this.popupsEmail.inbox);
					this.log.event('accesscode_emailed');
				},
				(error: any) => {
					this.modalService.showAlert(this.popupsEmail.error, error.message);
					this.log.error('Error emailing access code. ' + error.message);
				}
			);
		}
	}

	onUnpair() {

		if (this.utilityService.demoMode()) {
			return;
		}

		//make call to server
		this.api.delete('users/removeorganizations').subscribe(
			(result: any) => {
				this.api.get('users/me').subscribe(
					(result: any) => {
						this.user = new User(result.data);
						this.userService.setUser(this.user);
						this.setConfig();
						this.modalService.showAlert(this.popups[5].title, this.popups[5].body);
					});

			},
			(error: any) => {

				this.log.error('Error disconnecting. ' + error.message);
				this.modalService.showAlert(this.popups[6].title, this.popups[6].body);
			}
		);
	}

	onToggleReminders(key,value) {
		this.user.preferences[key] =value ? 1 : 0;
		this.storedUser['preferences'].key = value ? 1 : 0;
		key = key === 'notificationOn' ? 'NotificationOn': key;
		this.setPreference(key, value);
	}

	setPreference(pref, value) {

		let params = {};
		params[pref] = value ? 1 : 0;

		if (this.utilityService.demoMode()) {
			return;
		}
		//sync changes to server
		this.api.put('users/preferences', params).subscribe(
			(result: any) => {
				this.modalService.showAlert('Success','Notification updated Succesfully');
				//update stored user object with new preferences
				this.userService.setUser(this.user);

				//load the dashboard, and update user information
				this.log.event('preference_change', 'Settings', { preference: pref });
			},
			(error: any) => {

				this.log.error('Error updating preferences. ' + error.message);
				this.modalService.showAlert(this.popups[7].title, this.popups[7].body);
			}
		);
	}

	onCancelSubscription() {

		this.modalService.showConfirmation("Cancel", "Are you sure you want to cancel your subscription?").afterClosed().subscribe(result => {
			if (result) {
				if (this.utilityService.demoMode()) {
					return;
				}
				else {
					this.api.delete('users/removesubscription/' + this.user.id).subscribe(
						(result: any) => {
							this.onLoadUser();
						},
						(error: any) => {

							this.modalService.showAlert(this.popups[6].title, 'Error unsubscribing.');
						}
					);
				}
			}
		});

	}

	compileChildren() {
		this.api.get('organizations/children', { includeParent: 0 }).subscribe(
			(result: any) => {
				this.organizations = Organization.initializeArray(result.data);
			},
			(error: any) => {
				this.log.error('Error getting organizations. ' + error.message);

			},
			() => {

			});
	}

	onChangeOrg() {

		if (this.utilityService.demoMode()) {
			return;
		}

		this.api.post('organizations/saveorg', { OrgID: this.orgId }).subscribe(
			(result: any) => {
				this.modalService.showAlert(this.popups[10].title, this.popups[10].body);
			},
			(error: any) => {
				this.log.error('Error getting organizations. ' + error.message);

			},
			() => {

			});

	}

}
