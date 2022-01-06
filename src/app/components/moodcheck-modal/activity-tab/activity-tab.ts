import { Component, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { MoodcheckOptionsService } from '../../../lib/moodcheck-options.service';
import { MoodcheckService } from '../../../lib/moodcheck.service';
import { LogService } from '../../../lib/log.service';
import { EventManagerService } from '../../../lib/event-manager.service'

@Component({
	selector: 'page-activity-tab',
	templateUrl: 'activity-tab.html',
	styleUrls: ['./activity-tab.scss']
})
export class ActivityTab implements OnDestroy {

	category = 'activities';
	gridClass = 'grid-buttons col3';

	@Output() onMoreClicked: EventEmitter<any> = new EventEmitter();
    @Input() options;
	constructor(
		private mcOptions: MoodcheckOptionsService,
		private log: LogService,
		private mcService: MoodcheckService,
		private eventService: EventManagerService) {

		this.mcOptions.watcher.subscribe((updatedData: any) => {
			if (updatedData.category && updatedData.category === this.category) {
				this.options = updatedData.options;
			}
		});

		this.eventService.registerEvent('animateGridActivity', this, () => {
			this.animateGridActivity();
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
			this.mcService.setActivity(option.Key);
			this.log.event('moodcheck_select_activity');
		} else {
			this.mcService.setActivity(null);
		}
	}

	onNext() {
		//this.tabCtrl.slideTo(2);
		//this.events.publish('mood-tab-slide:next', 2);
	}

	onMore() {
		this.onMoreClicked.emit({ options: this.options });
	}

	animateGridActivity() {

		this.gridClass = 'grid-buttons col3 fivePhasesFadeIn';

		setTimeout(() => {
			this.gridClass = 'grid-buttons col3';
		}, 4000);
	}

	ngOnDestroy() {
		this.eventService.unregisterEvent('animateGridActivity', this)
	}

}
