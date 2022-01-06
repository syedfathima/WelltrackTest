import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MoodcheckOptionsService } from '../../../lib/moodcheck-options.service';
import { MoodcheckService } from '../../../lib/moodcheck.service';
import { LogService } from '../../../lib/log.service';


@Component({
	selector: 'page-place-tab',
	templateUrl: 'place-tab.html',
	styleUrls: ['./place-tab.scss']
})
export class PlaceTab implements OnInit {
	@Input() options;
	category = 'places';

	@Output() onMoreClicked: EventEmitter<any> = new EventEmitter();

	constructor(private mcOptions: MoodcheckOptionsService, private log: LogService, private mcService: MoodcheckService) {
		
		this.mcOptions.watcher.subscribe((updatedData: any) => {
			if (updatedData.category && updatedData.category === this.category) {
				this.options = updatedData.options;
			}
		});
	}

	toggleOption(option) {
		option.isSelected = !option.isSelected;

		//deselect all other options
		this.options.forEach(opt => {
			if (opt.Key !== option.Key) {
				opt.isSelected = false;
			}
		});

		if (option.isSelected) {
			this.mcService.setPlace(option.Key);
			this.log.event('moodcheck_select_place');
		} else {
			this.mcService.setPlace(null);
		}
	}

	onNext() {
		//this.tabCtrl.slideTo('noteTab');
		//this.events.publish('mood-tab-slide:next', 4);
	}

	onMore() {
		this.onMoreClicked.emit({ options: this.options });
	}

	ionViewDidLoad() {
		this.log.trace('ionViewDidLoad PlaceTab');
	}

	ngOnInit() {
		this.log.event('moodcheck_enter_place_tab');
	}

}
