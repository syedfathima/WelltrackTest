import { Component, OnInit, Output, EventEmitter, AfterViewChecked, Input,ViewEncapsulation } from '@angular/core';
import { MoodcheckOptionsService } from '../../../lib/moodcheck-options.service';
import { MoodcheckService } from '../../../lib/moodcheck.service';
import { LogService } from '../../../lib/log.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../lib/storage.service';
import { config } from '../../../../environments/all';


@Component({
	selector: 'activity-select',
	templateUrl: 'activity-select.html',
	styleUrls: ['./activity-select.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ActivitySelect implements AfterViewChecked, OnInit {

	isFrench = false;
	activities: any;
	placeholder = '';
	customOption = '';
	selected: any;

	@Input() activityType = 0;

	@Output() activity = new EventEmitter<any>();

	constructor(
		private translate: TranslateService,
		private storage: StorageService
	) {

	}

	ngOnInit() {

		this.translate.stream('lang').subscribe((res: any) => {

			if (res === 'en') {
				this.isFrench = false;
				let act1 = this.storage.get('activities1', true) || false;

				if (!act1) {
					let activities1 = config.activities.pleasure_en;
					this.storage.set('activities1', activities1, true);
				}
				let act2 = this.storage.get('activities2', true) || false;
				if (!act2) {
					let activities2 = config.activities.social_en;
					this.storage.set('activities2', activities2, true);
				}
				let act3 = this.storage.get('activities3', true) || false;
				if (!act3) {
					let activities3 = config.activities.achievement_en;
					this.storage.set('activities3', activities3, true);
				}
			} else {
				this.isFrench = true;
				let act1 = this.storage.get('activities1fr', true) || false;
				if (!act1) {
					let activities1 = config.activities.pleasure_fr;
					this.storage.set('activities1fr', activities1, true);
				}
				let act2 = this.storage.get('activities2fr', true) || false;
				if (!act2) {
					let activities2 = config.activities.social_fr;
					this.storage.set('activities2fr', activities2, true);
				}
				let act3 = this.storage.get('activities3fr', true) || false;
				if (!act3) {
					let activities3 = config.activities.achievement_fr;
					this.storage.set('activities3fr', activities3, true);
				}
			}
			if (res === 'en') {
				this.isFrench = false;
				if (this.activityType === 1) {
					let storageActivity = { 'activities': this.storage.get('activities1', true) };
					this.activities = storageActivity.activities;
				
				} else if (this.activityType === 2) {
					let storageActivity = { 'activities': this.storage.get('activities2', true) };
					this.activities = storageActivity.activities;
				
				} else if (this.activityType === 3) {
					let storageActivity = { 'activities': this.storage.get('activities3', true) };
					this.activities = storageActivity.activities;
					
				}
			} else {
				this.isFrench = true;
				if (this.activityType === 1) {
					let storageActivity = { 'activities': this.storage.get('activities1fr', true) };
					this.activities = storageActivity.activities;
				
				} else if (this.activityType === 2) {
					let storageActivity = { 'activities': this.storage.get('activities2fr', true) };
					this.activities = storageActivity.activities;
					
				} else if (this.activityType === 3) {
					let storageActivity = { 'activities': this.storage.get('activities3fr', true) };
					this.activities = storageActivity.activities;
					
				}
			}
		});
	
		
		for (let i = 0; i < this.activities.length; i++) {
			this.activities[i].isSelected = false;
		}
	}

	ngAfterViewChecked() {
	}


	onAddCustomOption() {
		if (this.customOption.length > 0) {
			let activity = { 'text': this.customOption, 'isSelected': false };
			this.activities.unshift(activity);
			if (this.activityType === 1) {
				if (this.isFrench) {
					this.storage.set('activities1fr', this.activities, true);
				} else {
					this.storage.set('activities1', this.activities, true);
				}

			} else if (this.activityType === 2) {
				if (this.isFrench) {
					this.storage.set('activities2fr', this.activities, true);
				} else {
					this.storage.set('activities2', this.activities, true);
				}

			} else if (this.activityType === 3) {
				if (this.isFrench) {
					this.storage.set('activities3fr', this.activities, true);
				} else {
					this.storage.set('activities3', this.activities, true);
				}

			}
			this.customOption = '';
			this.toggleOption(activity);
		}

	}

	toggleOption(activity: any) {

		for (let i = 0; i < this.activities.length; i++) {
			this.activities[i].isSelected = false;
		}
		activity.isSelected = true;
		this.selected = activity;
		
		
		this.activity.emit({ 'data': this.selected });
	}

}
