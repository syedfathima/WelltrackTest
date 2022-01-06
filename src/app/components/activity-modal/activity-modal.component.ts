import { Component, ViewChild, ViewEncapsulation, OnInit,Inject } from '@angular/core';
import { AuthService } from '../../lib/auth.service';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { DialogPreset } from 'ngx-modialog/plugins/vex';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../lib/storage.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as _ from 'lodash';

@Component({
	selector: 'activity-modal',
	templateUrl: 'activity-modal.component.html',
	styleUrls: ['./activity-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ActivityModal implements OnInit {

	category: any;
	placeholder = '';
	isFrench = false;
	activities: any;
	customOption = '';

	constructor(public auth: AuthService,
		public dialog: DialogRef<DialogPreset>,
		public translate: TranslateService,
		public storage: StorageService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.category = data.data;
	}

	ngOnInit() {
		this.translate.stream('as.modal').subscribe((res: any) => {
			this.placeholder = res.placeholder;

		});
		this.translate.stream('lang').subscribe((res: any) => {
			if (res === 'en') {
				this.isFrench = false;
				if (this.category === 1) {
					this.activities = this.storage.get('activities1', true);
				} else if (this.category === 2) {
					this.activities = this.storage.get('activities2', true);
				} else if (this.category === 3) {
					this.activities = this.storage.get('activities3', true);
				}
			} else {
				this.isFrench = true;
				if (this.category === 1) {
					this.activities = this.storage.get('activities1fr', true);
				} else if (this.category === 2) {
					this.activities = this.storage.get('activities2fr', true);
				} else if (this.category === 3) {
					this.activities = this.storage.get('activities3fr', true);
				}
			}
		});
	}

	onFinish() {
			this.dialog.close(this.activities);
	}

	addNewActivity() {

		if (!this.customOption) {
			return;
		}
		let cat = '';
		if ( this.category === 1) {
			cat = 'pleasurable';
		} else if ( this.category === 2) {
			cat = 'social';
		} else if ( this.category === 3) {
			cat = 'achievement';
		}

		const option = {
			text: this.customOption,
			key: this.customOption,
			custom: true,
			disabled: false,
			category: cat
		};

		this.activities.unshift(option);
		this.sync();
	}

	toggleOption(option) {
		option.isSelected = !option.isSelected;
		this.sync();
	}

	sync() {
		if (!this.isFrench) {
			if ( this.category === 1) {
				this.storage.set('activities1', this.activities, true);
			} else if ( this.category === 2) {
				this.storage.set('activities2', this.activities, true);
			} else if ( this.category === 3) {
				this.storage.set('activities3', this.activities, true);
			}
		} else {
			if ( this.category === 1) {
				this.storage.set('activities1fr', this.activities, true);
			} else if ( this.category === 2) {
				this.storage.set('activities2fr', this.activities, true);
			} else if ( this.category === 3) {
				this.storage.set('activities3fr', this.activities, true);
			}
		}

	}
}
