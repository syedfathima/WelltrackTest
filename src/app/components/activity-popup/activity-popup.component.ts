import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../lib/auth.service';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { DialogPreset } from 'ngx-modialog/plugins/vex';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as _ from 'lodash';

@Component({
	selector: 'activity-popup',
	templateUrl: 'activity-popup.component.html',
	styleUrls: ['./activity-popup.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ActivityPopup implements OnInit {
	date: any;
	placeholder = '';
	color = '';
	active = '';
	newActivities = [];
	result: any;

	constructor(public auth: AuthService,
		public dialog: DialogRef<DialogPreset>,
		public translate: TranslateService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.data = data.data;
		this.data.activities[0].forEach(element => {
			element.isSelected = false;
		});
		this.data.activities[1].forEach(element => {
			element.isSelected = false;
		});
		this.data.activities[2].forEach(element => {
			element.isSelected = false;
		});

		this.date = new Date(this.data.date);
		this.date = this.date.toLocaleTimeString() + ' ' + this.date.toLocaleDateString();
		this.color = '';
	}

	ngOnInit() {
		this.translate.stream('as.select').subscribe((res: any) => {
			this.placeholder = res.placeholder2;
		});
	}

	onFinish() {
		if (this.result) {
			this.color = '#B8B7AF';
			this.data.activities[0].forEach(element => {
				if (this.result.text === element.text) {
					this.color = '#F6DB72';
				}
			});
			this.data.activities[1].forEach(element => {
				if (this.result.text === element.text) {
					this.color = '#B9EB9E';
				}
			});
			this.data.activities[2].forEach(element => {
				if (this.result.text === element.text) {
					this.color = '#80C7DC';
				}
			});

			let returnObj = {
				active: this.result.text,
				color: this.color,
				category: this.result.category,
				custom: this.result.custom
			};

			this.dialog.close(returnObj);
		}
	}

	addNewActivity() {
		this.data.activities[0].forEach(element => {
			element.isSelected = false;
		});
		this.data.activities[1].forEach(element => {
			element.isSelected = false;
		});
		this.data.activities[2].forEach(element => {
			element.isSelected = false;
		});
		this.newActivities.forEach(element => {
			element.isSelected = false;
		});
		let newActive = { 'text': this.active, 'isSelected': true, 'custom': true };
		this.newActivities.push(newActive);
		this.result = newActive;
		this.active = '';
	}

	toggleOption(option) {
		this.data.activities[0].forEach(element => {
			element.isSelected = false;
		});
		this.data.activities[1].forEach(element => {
			element.isSelected = false;
		});
		this.data.activities[2].forEach(element => {
			element.isSelected = false;
		});
		this.newActivities.forEach(element => {
			element.isSelected = false;
		});
		option.isSelected = !option.isSelected;
		if (option.isSelected === true) {
			this.result = option;
		}
	}

}
