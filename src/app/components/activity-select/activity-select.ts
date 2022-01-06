import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../lib/storage.service';
import { config } from '../../../environments/all';
// import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { AfterViewChecked } from '@angular/core';

import * as _ from 'lodash';

@Component({
	selector: 'activity-select',
	templateUrl: 'activity-select.html',
	styleUrls: ['./activity-select.scss'],
})
export class ActivitySelect implements OnInit, AfterViewChecked {

	activities: any = [];
	pleasure: any = [];
	social: any = [];
	achievement: any = [];
	allactivities: any = [];
	placeholder = "";
	customOption = '';
	selected: any;
	@Input() selectedOption: string = '';
	@Input() activityType: number = 0;
	@Output() activity = new EventEmitter<any>();
	activeOptions: any = {pleasure: '', social: '', achievement: ''};
	activeOption: string;

	constructor(
		private translate: TranslateService,
		private storage: StorageService
	) {

	}

	ngAfterViewChecked() {


	}

	ngOnInit() {

		this.translate.get('lang').subscribe((res: any) => {
			let all;
			if (this.storage.get('activityOptions', true)) {
				all = this.storage.get('activityOptions', true);
				this.activeOptions.pleasure = all.pleasure;
				this.activeOptions.social =	all.social;
				this.activeOptions.achievement = all.achievement;
			}
			else {
				all = config;
				if (res === 'en') {
					this.activeOptions.pleasure = all.activities.pleasure_en;
					this.activeOptions.social = all.activities.social_en;
					this.activeOptions.achievement = all.activities.achievement_en;
				}
				else {
					this.activeOptions.pleasure = all.activities.pleasure_fr;
					this.activeOptions.social = all.activities.social_fr;
					this.activeOptions.achievement = all.activities.achievement_fr;
				}
			}

			let index = -1;
			let foundindex = -1;

			if ((index = _.findIndex(this.activeOptions.pleasure, { text: this.selectedOption })) !== -1) {
				this.activities = this.activeOptions.pleasure;
				this.activeOption = 'pleasure';
				foundindex = index;
			}

			if ((index = _.findIndex(this.activeOptions.social, { text: this.selectedOption })) !== -1) {
				this.activities = this.activeOptions.social;
				this.activeOption = 'social';
				foundindex = index;
			}

			if ((index = _.findIndex(this.activeOptions.achievement, { text: this.selectedOption })) !== -1) {
				this.activities = this.activeOptions.achievement;
				this.activeOption = 'achievement';
				foundindex = index;
			}

			if (foundindex === -1) {
				if (this.activityType === 1) {
					this.activities = this.activeOptions.pleasure;
				}
				else if (this.activityType === 2) {
					this.activities = this.activeOptions.social;
				}
				else if (this.activityType === 3) {
					this.activities = this.activeOptions.achievement;
				}
			}

			for (let i = 0; i < this.activities.length; i++) {
				if (i === foundindex) {
					this.activities[i].isSelected = true;
				}
				else {
					this.activities[i].isSelected = false;
				}
			}

		});

		this.translate.get("as").subscribe((res) => {
			this.placeholder = res.select.placeholder
		});

	}

	onAddCustomOption() {
		if (this.customOption.length > 0) {
			let activity = { 'text': this.customOption, 'isSelected': false };
			this.toggleOption(activity);
			this.activities.unshift(activity);
			this.activities
			this.customOption = '';
		}

	}

	toggleOption(activity: any) {

		for (let i = 0; i < this.activities.length; i++) {
			this.activities[i].isSelected = false;
		}
		activity.isSelected = true;
		this.selected = activity;
		this.activity.emit({ 'data': this.selected });
		this.sync();
	}

	sync() {
		this.activeOptions[this.activeOption] = this.activities;
		this.storage.set('activiyScheduler', this.activeOptions, true);
	}
}
