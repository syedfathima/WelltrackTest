import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { CounselorUser } from '../../models/counselor-user';
import { Organization } from '../../models/organization';
import { UserService } from '../../lib/user.service';
import { ModalService } from '../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import Debounce from 'debounce-decorator'

import * as _ from 'lodash';
import { UserCreateComponent } from 'app/components/admin/user-create/user-create.component';

@Component({
  selector: 'app-internal-user-listing',
  templateUrl: './internal-user-listing.component.html',
  styleUrls: ['./internal-user-listing.component.scss']
})
export class InternalUserListingComponent implements OnInit {

  user: User;
	users: User[] = [];
	pendingUsers: CounselorUser[] = [];
	activeusers: User[] = [];
	popup: any;
	syncPopup: any;
	isLoaded = false;
	isAdmin = false;
	cols: Array<string> = ['', '', '', '', ''];
	userShare: boolean = false;
	userListing: boolean = false;
	inviteSubscribe: boolean = false;
	offset: number = 0;
	invites: any;
	statuses: any;
	organization: Organization;
	zoomUsers: any;
	roles: Array<string> = [];
	userStatuses: Array<string> = [];
	usersLoading: boolean = true;

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
    console.log('user----',this.user)
		if (this.user.permissions) {
			this.userListing = this.user.permissions.userListing;
			this.userShare = this.user.permissions.userShare;
			this.inviteSubscribe = this.user.permissions.inviteSubscribe;
		}

		this.roles = [
			"user",
			"professional",
			"orgadmin",
			"admin",
			"superadmin"
		  ];
		  this.userStatuses = [
			"approved",
			"unconfirmed",
			"disabled"
		  ];
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

		this.loadMore();
		this.listZoomAccounts();
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
			if(filterValue !== 'all){
				key = 'userType';
			}
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
		this.usersLoading = true;
		this.offset = this.users.length;

		if (this.cols[0] && this.cols[1] && this.cols[2]) {

		}

		this.api.get('admin/users', {
			Limit: 100,
			Offset: this.offset,
			Name: this.cols[0],
			Email: this.cols[1],
			OrganizationName: this.cols[2],
			UserType: this.cols[3] || '',
			Status: this.cols[4] || '',
		}).subscribe(
			(results: any) => {
				let users = [];
				for (let user of results.data) {
					users.push(new User(user));
				}
				this.activeusers = users;
        this.filterUserOnRole();
				this.isLoaded = true;
				this.usersLoading = false;
			},
			(error: any) => {

				this.log.error('Error loading. ' + error.message);
				this.isLoaded = true;
				this.usersLoading = false;
			}
		);


	}


  /**
   * Filter user based on roles
   */
   filterUserOnRole(){
     console.log('inside filter')
     if(this.user.userType === 'superadmin'){
       this.activeusers = this.activeusers.filter(allUsers =>allUsers['userType'] === 'admin' || allUsers['userType'] === 'relationshipmanager');
     } else if(this.user.userType === 'admin'){
        this.activeusers = this.activeusers.filter(allUsers =>allUsers['userType'] === 'relationshipmanager');
     }
   }


	listZoomAccounts(){
		this.api.get('zoom/listusers').subscribe(
			(results: any) => {
				this.zoomUsers = results.users;
			},
			(error: any) => {
				this.log.error('Error loading. ' + error.message);
			}
		);
	}


	createUser(){
		this.modalService.showComponent(UserCreateComponent);
	}


}
