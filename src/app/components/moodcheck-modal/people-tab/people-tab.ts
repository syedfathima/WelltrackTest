import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MoodcheckOptionsService } from '../../../lib/moodcheck-options.service';
import { MoodcheckService } from '../../../lib/moodcheck.service';
import { LogService } from '../../../lib/log.service';


@Component({
	selector: 'page-people-tab',
	templateUrl: 'people-tab.html',
	styleUrls: ['./people-tab.scss']
})
export class PeopleTab implements OnInit {
	@Input() options;
	category = 'people';

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
			this.mcService.setPeople(option.Key);
			this.log.event('moodcheck_select_people');
		} else {
			this.mcService.setPeople(null);
		}
	}

	onNext() {
		//this.tabCtrl.slideTo('placeTab');
		//this.events.publish('mood-tab-slide:next', 3);
	}

	onMore() {
		this.onMoreClicked.emit({ options: this.options });
	}


	ngOnInit() {
		this.log.event('moodcheck_enter_people_tab');
	}

}
