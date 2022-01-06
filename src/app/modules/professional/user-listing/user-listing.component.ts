import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { LogService } from '../../../lib/log.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { CounselorUser } from '../../../models/counselor-user';
import { Organization } from '../../../models/organization';
import { UserService } from '../../../lib/user.service';
import { ModalService } from '../../../lib/modal.service';
import { Invite } from '../../../components/invite/invite';
import { TranslateService } from '@ngx-translate/core';
import Debounce from 'debounce-decorator'

import * as _ from 'lodash';

@Component({
	selector: 'user-listing.component',
	templateUrl: 'user-listing.component.html',
	styleUrls: ['./user-listing.scss']
})
export class UserListingPage implements OnInit {
	user: User;
	users: User[] = [];
	pendingUsers: CounselorUser[] = [];
	activeusers: User[] = [];
	popup: any;
	syncPopup: any;
	isLoaded = false;
	isAdmin = false;
	cols: Array<string> = ['', '', '', ''];
	userShare: boolean = false;
	userListing: boolean = false;
	inviteSubscribe: boolean = false;
	offset: number = 0;
	invites: any;
	statuses: any;
	organization: Organization;

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private modalService: ModalService,
		private log: LogService,
		private translate: TranslateService,
		private userService: UserService
	) {
		this.user = this.userService.getUser();
		if (this.user.permissions) {
			this.userListing = this.user.permissions.userListing;
			this.userShare = this.user.permissions.userShare;
			this.inviteSubscribe = this.user.permissions.inviteSubscribe;
		}
	}

	ngOnInit() {

		this.translate.stream('userListing.popup').subscribe((res: any) => {
			this.popup = res;
		});

		this.translate.stream('userListing.statuses').subscribe((res: any) => {
			this.statuses = res;
		});

		this.translate.stream('sync.popup').subscribe((res: any) => {
			this.syncPopup = res;
		});

		if (this.router.url.slice(1, 6) === 'admin') {
			this.isAdmin = true;
			this.loadMore();
		} else {
			this.isAdmin = false;

			let orgId;
			if (this.storage.get('orgselect')) {
				orgId = this.storage.get('orgselect')
			}
			else {
				this.user.primaryOrganization;
				orgId = this.user.primaryOrganization.id;
			}

			if (orgId) {
				this.api.get('organizations/' + orgId).subscribe(
					(result: any) => {
						this.organization = new Organization(result.data);
						this.getUserspaired();
						this.getUsersPending();
					},
					(error: any) => {
						this.log.error('Error getting organizations. ' + error.message);
					},
					() => {
					});
			}
			else {
				this.organization = this.user.primaryOrganization;
				this.getUserspaired();
				this.getUsersPending();
			}
		}
	}

	getUserspaired() {
		this.api.get('userspaired', { OrgID: this.organization.id }).subscribe(
			(results: any) => {
				this.users = User.initializeArray(results.data);
			},
			(error: any) => {
				this.log.error('Error loading. ' + error.message);
			}
		);
		this.getInvites();
	}

	getUsersPending() {
		this.api.get('pendingusers', { OrgID: this.organization.id }).subscribe(
			(results: any) => {
				this.pendingUsers = CounselorUser.initializeArray(results.data);
			},
			(error: any) => {
				this.log.error('Error loading. ' + error.message);
			}
		);
	}

	onAccept(userId) {

		this.api.post('counselors/counseloraccept', { UserID: userId }).subscribe(
			(result: any) => {
				let index = _.findIndex(this.pendingUsers, { 'id': userId });
				this.pendingUsers[index]['confirmed'] = true;
				this.modalService.showAlert(this.syncPopup.successtitle, result.message);
				this.getUserspaired();
			},
			(error: any) => {
				this.modalService.showAlert(this.syncPopup.errortitle, this.syncPopup.acceptError);
			}
		);

	}

	onReject(userId) {
		this.api.post('counselors/counselorreject', { UserID: userId }).subscribe(
			(result: any) => {
				let index = _.findIndex(this.pendingUsers, { 'id': userId });
				this.pendingUsers[index]['isPaired'] = false;
				this.modalService.showAlert(this.syncPopup.successtitle, result.message);
			},
			(error: any) => {
				this.modalService.showAlert(this.syncPopup.errortitle, this.syncPopup.rejectError);
			}
		);
	}


	invite() {
		let inviteInfo = {
			'type': 'professional',
			'endpoint': 'userinvite',
			'orgId': this.organization.id,
		};
		const dialogRef = this.modalService.showComponent(Invite, inviteInfo);
		dialogRef.afterClosed().subscribe(() => {
			this.getInvites();
		});
	}

	inviteShare() {
		let inviteInfo = {
			'type': 'professional',
			'endpoint': 'userinvite',
			'forceShare': true,
			'orgId': this.organization.id,
		};
		const dialogRef = this.modalService.showComponent(Invite, inviteInfo);
		dialogRef.afterClosed().subscribe(() => {
			this.getInvites();
		});
	}

	inviteSubscribeUser() {
		let inviteInfo = {
			'type': 'professional',
			'endpoint': 'usersubscribeinvite',
			'orgId': this.organization.id,
			'subscribe': true,
		};
		const dialogRef = this.modalService.showComponent(Invite, inviteInfo);
		dialogRef.afterClosed().subscribe(() => {
			this.getInvites();
		});
	}

	reloadInvitations(){
		this.getUsersPending();
	}

	resendInvitation(id) {

		this.api.post('invitations/sendreminder', {
			ID: id,
			Endpoint: 'userinvite'
		}).subscribe(
			(result: any) => {
				let index = _.findIndex(this.invites, { ID: id });
				this.invites[index].ReminderCount++;
				this.modalService.showAlert(this.popup.successtitle, result.message);
			},
			(error: any) => {
				this.modalService.showAlert(this.popup.errortitle, error.message);
				this.log.error('Error sending invite. ' + error.message);
			}
		);
	}

	deleteInvitation(id) {
		this.api.delete('invitations/' + id).subscribe(
			(result: any) => {
				let index = _.findIndex(this.invites, { ID: id });
				this.invites.splice(index, 1);
				this.modalService.showAlert(this.popup.successtitle, result.message);
			},
			(error: any) => {
				this.modalService.showAlert(this.popup.errortitle, error.message);
				this.log.error('Error sending invite. ' + error.message);
			}
		);
	}

	getInvites() {
		this.api.get('invites', { OrgID: this.organization.id }).subscribe(
			(results: any) => {
				this.invites = results.data;
				this.log.debug(this.invites);
				this.isLoaded = true;
			},
			(error: any) => {
				this.log.error('Error loading. ' + error.message);
				this.isLoaded = true;
			}
		);
	}

	valueChange(i) {

		let filterValue = this.cols[i].toLowerCase();

		/*
		let key = '';
		if (i == 0) {
			key = 'name';
		}
		else if (i == 1) {
			key = 'email';
		}
		else if (i == 2) {
			key = 'organizationStr';
		}
		else if (i == 3) {
			key = 'userType';
		}
		else {
			return;
		}
		let empty = this.reset();
		if (!empty) {
			let cols = this.cols;
			let resp = _.filter(this.activeusers, function (o) {
				for (let i = 0; i < cols.length; i++) {
					if (o[key] != undefined) {
						if (o[key].toLowerCase().search(filterValue) === -1) {
							return false;
						}
					}
				}
				return true;
			});
			this.activeusers = resp;
		}
		else {
			this.activeusers = this.users;
		}
		*/
		this.loadMore();
	}

	reset() {
		let valid = true;

		for (let i = 0; i < this.cols.length; i++) {

			if (this.cols[i] !== '') {
				valid = false;
			}
		}
		return valid;
	}

	@Debounce(500)
	loadMore() {
		this.offset = this.users.length;

		if (this.cols[0] && this.cols[1] && this.cols[2]) {

		}

		this.api.get('admin/users', {
			Limit: 100,
			Offset: this.offset,
			Name: this.cols[0],
			Email: this.cols[1],
			OrganizationName: this.cols[2]
		}).subscribe(
			(results: any) => {
				let users = [];
				for (let user of results.data) {
					users.push(new User(user));
				}
				this.activeusers = users;
				this.isLoaded = true;
			},
			(error: any) => {

				this.log.error('Error loading. ' + error.message);
				this.isLoaded = true;
			}
		);
	}

}
