import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../app/lib/api.service';
import { LogService } from '../../../app/lib/log.service';
import { CounselorUser } from '../../../app/models/counselor-user';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../../lib/modal.service';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { Invite } from '../../components/invite/invite';
import { Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
	selector: 'page-sync-menu',
	templateUrl: 'counselor-sync.html',
	styleUrls: ['./counselor-sync.scss']
})
export class CounselorSyncPage implements OnInit {

	hasLoaded: boolean = false;
	counselors: CounselorUser[];
	syncEnabled: boolean = false;
	popup: any;
	toSync: boolean = false;
	counselorChosen: number = -1;
	syncType: string = 'counselor';
	user: User;
	showEmpty: boolean = false;
	orgId: number;

	constructor(
		private api: ApiService,
		private log: LogService,
		private translate: TranslateService,
		private userService: UserService,
		private modalService: ModalService,
		private router: Router
		) {

		this.user = this.userService.getUser();
		this.translate.stream('sync.popup').subscribe((res: any) => {
			this.popup = res;
		});

		this.user = this.userService.getUser();
		if (this.user.primaryOrganization) {
			if (this.user.primaryOrganization.settings && this.user.primaryOrganization.settings['hasCounselors'] === false) {
				this.showEmpty = true;
			}
			this.orgId = this.user.primaryOrganization.id;
		}
	}

	ngOnInit() {

		this.api.get('counselors').subscribe(
			(result: any) => {
				this.log.debug('Counselor data fetched');
				this.counselors = CounselorUser.initializeArray(result.data);
				this.log.debug('After init');
				this.log.debug(this.counselors);

				//enable sync if currently syncing with any counselors
				this.counselors.forEach(counselor => {
					if (counselor.isPaired) {
						this.syncEnabled = true;
						this.counselorChosen = counselor.id;
						return;
					}
				});

				this.hasLoaded = true;
			},
			(error: any) => {
				this.log.error('Error fetching counselors: ' + error.message);
				this.modalService.showAlert(this.popup.title, this.popup.fetch);
			}
		);

	}

	onToggleSync() {
		//if sync is disabled, unpair with all counselors
		if (this.syncEnabled) {
			this.counselors.forEach(counselor => {
				if (counselor.isPaired) {
					this.onPair(counselor);
				}
			});
		}

		this.syncEnabled = !this.syncEnabled;
	}

	onPair(counselor: CounselorUser) {
		//bork if sync isn't enabled
		if (!this.syncEnabled) {
			return;
		}

		counselor.isPaired = !counselor.isPaired;
		/*
			this.api.post('counselors/pair', {
				CounselorID: counselor.id,
				Pair: counselor.isPaired
			}).subscribe(
				(result: any) => {
					if (counselor.isPaired) {
						this.log.event('counselors_pair');
					} else {
						this.log.event('counselors_unpair');
					}
				},
				(error: any) => {
			
					this.log.error('Error pairing/unpairing with counselor. ' + error.message);
					this.errorService.showAlert(this.popup.errortitle, this.popup.pair);
				}
				);
		*/
	}

	onSelect() {
		this.api.post('counselors/pairwithone', {
			CounselorID: this.counselorChosen,
			Pair: true
		}).subscribe(
			(result: any) => {
				this.log.debug(this.popup);
				this.modalService.showAlert(this.popup.successtitle, this.popup.waiting);
			},
			(error: any) => {

				this.log.error('Error pairing/unpairing with counselor. ' + error.message);
				this.modalService.showAlert(this.popup.errortitle, error.message);
			}
		);
	}

	onConfirm() {

		this.api.post('counselors/sync', CounselorUser.forApi(this.counselors)).subscribe(
			(result: any) => {

			},
			(error: any) => {

				this.log.error('Error pairing/unpairing with counselor. ' + error.message);
				this.modalService.showAlert(this.popup.errortitle, this.popup.pair);
			}
		);
	}

	onAccept(counselorId) {

		this.api.post('counselors/useraccept', { CounselorID: counselorId }).subscribe(
			(result: any) => {
				let index = _.findIndex(this.counselors, { 'id': counselorId });
				this.counselors[index]['confirmed'] = true;
				this.modalService.showAlert(this.popup.successtitle, result.message);
			},
			(error: any) => {
				this.modalService.showAlert(this.popup.errortitle, this.popup.acceptError);
			}
		);

	}

	onReject(counselorId) {
		this.api.post('counselors/userreject', { CounselorID: counselorId }).subscribe(
			(result: any) => {
				let index = _.findIndex(this.counselors, { 'id': counselorId });
				this.counselors[index]['isPaired'] = false;
				this.modalService.showAlert(this.popup.successtitle, result.message);
			},
			(error: any) => {
				this.modalService.showAlert(this.popup.errortitle, this.popup.rejectError);
			}
		);
	}

	onCancel(counselorId) {
		let confirmResult;

		this.modalService.showConfirmation("Delete", this.popup.confirmCancel).afterClosed().subscribe(result => {
			if (result) {
				this.api.post('counselors/usercancel', { CounselorID: counselorId }).subscribe(
					(result: any) => {
						let index = _.findIndex(this.counselors, { id: counselorId });
						this.counselors[index].isPaired = false;
						this.modalService.showAlert(this.popup.successtitle, result.message);
					},
					(error: any) => {
						this.modalService.showAlert(this.popup.errortitle, error.message);
					}
				);
			}
		});
	}

	onInvite() {
		let inviteInfo = {
			'type': 'user',
			'endpoint': 'counselorinvite',
			'orgId': this.orgId
		};
		this.modalService.showComponent(Invite, inviteInfo);
	}

	onSubscribe(){
		this.router.navigateByUrl('/app/settings');
	}
}