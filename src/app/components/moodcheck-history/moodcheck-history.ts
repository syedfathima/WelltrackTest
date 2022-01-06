import { Component, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { StorageService } from '../../lib/storage.service';
import { AuthService } from '../../lib/auth.service';
import { ApiService } from '../../lib/api.service';
import { ModalService } from '../../lib/modal.service';
import { UserService } from '../../lib/user.service';
import { MoodcheckService } from '../../lib/moodcheck.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as _ from 'lodash';

@Component({
	selector: 'page-history',
	templateUrl: 'moodcheck-history.html',
	styleUrls: ['./moodcheck-history.scss'],
	encapsulation: ViewEncapsulation.None
})
export class HistoryPage {
	info: any;
	image: string;
	time: Date;
	notes: string;
	moodchecks: any[];
	selected: number;
	displayed: boolean;
	moodcheckText: any;
	user: User;

	constructor(
		public storage: StorageService,
		public auth: AuthService,
		public modalService: ModalService,
		public userService: UserService,
		private api: ApiService,
		private mcService: MoodcheckService,
		private translate: TranslateService,
		public dialogRef: MatDialogRef<HistoryPage>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.selected = 0;
		this.displayed = false;

		this.translate.stream('moodcheck').subscribe((res: any) => {
			this.moodcheckText = res;
		});

		this.moodchecks = data.data;
		for (let i = 0; i < this.moodchecks.length; i++) {
			this.moodchecks[i].created = new Date(this.moodchecks[i].created);
		}
		this.moodchecks = _.sortBy(this.moodchecks, 'created').reverse();

		this.info = this.moodchecks[0];
		this.refresh();
		this.user = this.userService.getUser();
	}

	onFinish() {
		this.dialogRef.close();
	}

	select(value: number) {
		this.info = this.moodchecks[value];
		this.refresh();
		this.selected = value;
	}

	refresh() {
		this.time = this.info.created;
		this.notes = this.info.notes || '';
		this.image = './assets/img/moodcheck/' + (10 - this.info.value) + '@2x.png';
	}

	display() {
		this.displayed = !this.displayed;
	}


	onDelete(id) {
		this.modalService.showConfirmation("Delete", this.moodcheckText.popups.deleteBody).afterClosed().subscribe(result => {
			if (result) {
				this.api.delete('moodcheck/' + id).subscribe(
					(result: any) => {
						this.mcService.triggerRefresh();
						this.dialogRef.close();
					},
					(error: any) => {

					}
				);
			}
		});
	}
}
