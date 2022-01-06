import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { StorageService } from '../../../lib/storage.service';
import { LogService } from '../../../lib/log.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'page-moodcheck-options',
	templateUrl: 'moodcheck-options.html',
	styleUrls: ['./moodcheck-options.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MoodcheckOptionsPage implements OnInit {

	//params: any = {};
	//category: string;
	customOption: string;
	options: any;
	activeOptions: any;

	@Input() category; 
    @Input() moreOptions;
	
	constructor(
		private storage: StorageService, 
		private log: LogService, 
		public dialogRef: MatDialogRef<MoodcheckOptionsPage>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.options = <any>this.storage.get('moodcheckOptions', true) || {};

		//get category
		this.category = this.storage.get('moodcheckOptionsCategory');
		this.activeOptions = this.options[this.category];
	}

	onAddCustomOption() {
		this.log.trace('Add' + this.customOption);
		this.log.event('moodcheck_add_custom_option', 'MoodCheck', { category: this.category });

		if (!this.customOption) {
			return;
		}

		const option = {
			Key: this.customOption,
			custom: true,
			enabled: true,
			usedCount: 0
		};

		this.moreOptions.unshift(option);
		delete this.customOption;
		this.sync();
	}

	toggleOption(option) {
		option.enabled = !option.enabled;
		this.sync();
	}

	sync() {
		this.options[this.category] = this.moreOptions;
		this.storage.set('moodcheckOptions', this.options, true);
	}

	ngOnInit() {
		this.log.event('moodcheck_enter_custom_option', 'MoodCheck', { category: this.category });
	}
}
