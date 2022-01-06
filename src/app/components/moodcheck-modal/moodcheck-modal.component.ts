import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
// import { MoodTab } from './mood-tab/mood-tab';
// import { ActivityTab } from './activity-tab/activity-tab';
import { StorageService } from '../../lib/storage.service';
//import { TutorialPage } from '../tutorial/tutorial';
// import { PlaceTab } from './place-tab/place-tab';
// import { PeopleTab } from './people-tab/people-tab';
// import { NoteTab } from './note-tab/note-tab';
import { MoodcheckService } from '../../lib/moodcheck.service';
import { ApiService } from '../../lib/api.service';
import { Moodcheck } from '../../models/moodcheck';
import { LogService } from '../../lib/log.service';

declare var jQuery;
import * as _ from 'lodash';
import { ModalService } from '../../lib/modal.service';
import { MoodcheckOptionsPage } from './moodcheck-options/moodcheck-options';
import { MoodcheckOptionsService } from '../../lib/moodcheck-options.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EventManagerService } from '../../lib/event-manager.service';
import { UtilityService } from '../../lib/utility.service';
import { UserService } from '../../lib/user.service';

@Component({
	selector: 'app-moodcheck-modal',
	templateUrl: './moodcheck-modal.component.html',
	styleUrls: ['./moodcheck-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class MoodcheckModalComponent implements OnInit {

	tabIndex: number;
	activeTab: string;
	saveEnabled: boolean;
	showOptions: boolean;
	tabs = ['mood', 'activity', 'people', 'place', 'notes'];
	popup: any;
	demo: boolean = false;
	submitting: boolean;
	moodLabels: any;
	hideNotes: boolean;
    moodOptions ={
		feelings :'',
		emotions:'',
		activities:'',
		place:'',
		people:''
	}
	lang:any;
	moreOptions: any;
	constructor(public storage: StorageService,
		public api: ApiService,
		private log: LogService,
		private mcService: MoodcheckService,
		private mcOptions: MoodcheckOptionsService,
		private modalService: ModalService,
		public dialogRef: MatDialogRef<MoodcheckModalComponent>,
		private router: Router,
		private translate: TranslateService,
		private utilityService: UtilityService,
		private userService: UserService,
		private eventService: EventManagerService) {

		this.tabIndex = 0;
		this.activeTab = this.tabs[this.tabIndex];
		this.saveEnabled = false;
		this.showOptions = false;
		this.lang = this.storage.get('lang');
		
		// events.subscribe('mood-tab-slide:next', (tabId) => {
		//     this.superTabs.onToolbarTabSelect(tabId);
		// });

		this.mcService.updates.subscribe((isValid: boolean) => {
			this.saveEnabled = isValid;
		});

		this.demo = this.utilityService.isDemoMode();
		this.submitting = false;
		this.getAllMoodOptions();
	}

	ngOnInit() {
		this.log.screen('MoodCheck');
		this.log.event('moodcheck_open');
		this.translate.stream('moodcheck.popups').subscribe((res: any) => {
			this.popup = res;
		});

		this.hideNotes = false;
		let user = this.userService.getUser();
		if (user.primaryOrganization && user.primaryOrganization.settings && user.primaryOrganization.settings.hideNotes) {
			this.hideNotes = user.primaryOrganization.settings.hideNotes;
			this.tabs.pop();
		}


	}

	isTabActive(tabId) {
		return (tabId === this.activeTab);
	}

	isTabLast() {
		if (this.tabIndex === (this.tabs.length - 1)) {
			return true;
		} else {
			return false;
		}
	}

	onChangeTab(tabId) {
		this.tabIndex = _.indexOf(this.tabs, tabId);
		this.activeTab = tabId;
	}

	onNextTab() {

		//do nothing if we are on the last tab
		if (this.tabIndex === (this.tabs.length - 1)) {
			return;
		}

		this.tabIndex++;
		this.activeTab = this.tabs[this.tabIndex];
	}

	onDismiss() {
		this.log.event('moodcheck_cancel');
		this.mcService.reset();
		this.dialogRef.close();
	}

	onMore(data: any) {
		const moreOptionsData = this.mcOptions.formatData(data.options);
		this.storage.set('moodcheckOptionsCategory', moreOptionsData);
		this.moreOptions = moreOptionsData;
		this.showOptions = true;
		setTimeout(function () {
			jQuery('#moodcheck-modal input:visible').first().focus();
		}, 500);
	}

	onCloseOptions() {
		this.showOptions = false;
		this.mcOptions.refreshData();

		setTimeout(function () {
			jQuery('#moodcheck-modal .featured:visible').focus();
		}, 500);

	}

	onSave() {
		if (!this.saveEnabled) {
			let checkMood: Moodcheck = this.mcService.getMoodcheck();
			if (checkMood.value === undefined) {
				let alert = this.modalService.showAlert(this.popup.incomplete, this.popup.dial);
				alert.afterClosed().subscribe(result => {
					if (this.tabIndex === 0) {
						this.eventService.emit('animateMoodSlider');

					}
					if (this.tabIndex === 1) {
						if (checkMood.activity === '') {
							this.eventService.emit('animateGridActivity');
						} else {
							this.tabIndex = 0;
							this.onChangeTab('mood');
							this.eventService.emit('animateMoodSlider');
						}
					}
				});

			} else {
				this.tabIndex = 1;
				this.eventService.emit('animateGridActivity');
				this.onChangeTab('activity');
			}
			return;
		}
		this.saveEnabled = false;
		let moodcheck: Moodcheck = this.mcService.getMoodcheck();

		//make call to server
		if (this.demo) {
			/*
			* If demo mode is detected, do not save the note. 
			*/
			moodcheck.notes = null;
		}
		this.submitting = true;
		this.api.post('moodcheck', moodcheck.forApi()).subscribe(
			(data: any) => {
				this.log.event('moodcheck_complete', 'MoodCheck', { moodValue: moodcheck.value });
				this.mcService.reset();

				//Trigger a data refresh
				this.mcService.triggerRefresh();
				this.dialogRef.close();
				this.storage.setFlag('first-moodcheck');

				this.router.navigateByUrl('/app');
				this.submitting = false;
			},
			(error: any) => {

				this.log.error('moodcheck_error');
				this.modalService.showAlert(this.popup.error, error.message);
				this.submitting = false;
			}
		);
	}

	onTabSelect(ev: any) {
		this.tabIndex = ev.index;
	}

	/**
	 * Get all Mood Options
	 */
	 getAllMoodOptions(){
		this.api.get(`config/options/${this.lang}/moodcheck`).subscribe(
			(data: any) => {
				const moodOptions = data;
				this.moodOptions.emotions = moodOptions.emotions.filter(emotions =>emotions.Language = this.lang);
				this.moodOptions.feelings = moodOptions.feelings.filter(feelings =>feelings.Language = this.lang)
				this.moodOptions.people = moodOptions.people.filter(people =>people.Language = this.lang)
				this.moodOptions.place = moodOptions.places.filter(place =>place.Language = this.lang)
				this.moodOptions.activities = moodOptions.activities.filter(activities =>activities.Language = this.lang)
			},
			(error: any) => {
				this.log.error('moodcheck_error');
			}
		);
	 }

}
