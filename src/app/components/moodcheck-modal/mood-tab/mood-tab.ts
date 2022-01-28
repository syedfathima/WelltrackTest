import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MoodcheckOptionsService } from '../../../lib/moodcheck-options.service';
import { MoodcheckService } from '../../../lib/moodcheck.service';
import { LogService } from '../../../lib/log.service';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../../../../environments/all';
//import * as jQuery from 'jquery';
//import 'roundslider';
import { ModalService } from '../../../lib/modal.service';
import { EventManagerService } from '../../../lib/event-manager.service'
import { StorageService } from 'app/lib/storage.service';
import { ApiService } from 'app/lib/api.service';

declare var jQuery: any;

@Component({
	selector: 'page-mood-tab',
	templateUrl: 'mood-tab.html',
	styleUrls: ['./mood-tab.scss']
})
export class MoodTab implements OnInit, OnDestroy {

	touchStart: number;
	slider: any;
	currentMood: number;
	actualMood: number;
	category = 'emotions';
	moodIconUrl: string;
	moodClassName = '';
	moodLabels: any;
	init: boolean;
	lang: any;
	moodLabel: string;
	@Output() onMoreClicked: EventEmitter<any> = new EventEmitter();
	@Input() options;
	@Input() feelings;
	constructor(
		private mcOptions: MoodcheckOptionsService,
		private log: LogService,
		private mcService: MoodcheckService,
		private translate: TranslateService,
		private eventService: EventManagerService,
		private storage: StorageService,
		public api: ApiService) {

		this.currentMood = 0;
		this.getIcon();

		this.mcOptions.watcher.subscribe((updatedData: any) => {
			if (updatedData.category && updatedData.category === this.category) {
				this.options = updatedData.options;
			}
		});

		this.eventService.registerEvent('animateMoodSlider', this, () => {
			this.animateMoodSlider();
		});


		this.init = true;

	}

	checkRange(value) {
		value = parseInt(value);
		this.moodLabels = '';
		if (isNaN(value)) {
			return '';
		}
		this.actualMood = value;
		this.setWithinRange();
		if (value >= 0) {
			this.slider.roundSlider('setValue', (10 - this.actualMood) * 10);
			this.currentMood = (10 - this.actualMood) + 1;
			this.getLabel();
			this.getIcon();
			this.mcService.setMoodValue(this.actualMood);
		}
	}

	onSliderUpdate(value) {
		this.init = false;
		this.currentMood = Math.floor(value / 10) + 1;
		this.actualMood = 10 - Math.floor(value / 10);
		this.getLabel();
		this.getIcon();
		this.mcService.setMoodValue(this.actualMood);
	}

	toggleOption(option) {
		option.isSelected = !option.isSelected;

		if (option.isSelected) {
			this.mcService.addEmotion(option.Key);
			this.log.event('moodcheck_select_emotion');
		} else {
			this.mcService.removeEmotion(option.Key);
		}
	}

	// onNext() {
	// 	this.tabCtrl.slideTo(1, 'moodTabs');
	// 	//this.events.publish('mood-tab-slide:next', 1);
	// }

	onMore() {
		this.onMoreClicked.emit({ options: this.options });
	}

	ngOnInit() {
		this.log.event('moodcheck_enter_mood_tab');

		const _eDown = (jQuery as any).fn.roundSlider.prototype._elementDown;
		(jQuery as any).fn.roundSlider.prototype._elementDown = function (e) {
			_eDown.call(this, e);
			if (!jQuery(e.target).hasClass('rs-handle')) {
				this._handleDown(e);
				this._handleMove(e);
			}
		}

		const _hDown = (jQuery as any).fn.roundSlider.prototype._handleDown;
		(jQuery as any).fn.roundSlider.prototype._handleDown = function (e) {
			_hDown.call(this, e);
			this._active = 2;
			this.bar = this.control.find('div.rs-bar');
		}	// -----> //

		this.slider = (jQuery('#mood-slider') as any).roundSlider({
			radius: 90,
			width: 18,
			value: 0,
			handleSize: '+12',
			step: 1,
			min: 0,
			max: 99,
			handleShape: 'dot',
			mouseScrollAction: true,
			editableTooltip: false,
			showTooltip: false,
			startAngle: 90,
			drag: (e) => {
				this.onSliderUpdate(e.value);
			},
			change: (e) => {
				this.onSliderUpdate(e.value);
			}
		});

		//this.slider = jQuery('#mood-slider').data('roundSlider');

		jQuery('#mood-slider').on('touchmove', (e) => {
			e.preventDefault();
		});

	}

	animateMoodSlider() {
		this.moodClassName = 'fivePhasesFadeIn';

		setTimeout(() => {
			this.moodClassName = '';
		}, 4000);
	}

	ngOnDestroy() {
		this.eventService.unregisterEvent('animateMoodSlider', this)
	}

	onGoUp() {

		this.initMood();
		this.actualMood += 1;
		this.setWithinRange();
		this.currentMood = (10 - this.actualMood) + 1;
		this.slider.roundSlider('setValue', (10 - this.actualMood) * 10);
		this.getLabel();
		this.getIcon();
		this.mcService.setMoodValue(this.actualMood);
	}

	onGoDown() {
		this.initMood();
		this.actualMood -= 1;
		this.setWithinRange();
		this.currentMood = (10 - this.actualMood) + 1;
		this.slider.roundSlider('setValue', (10 - this.actualMood) * 10);
		this.getLabel();
		this.getIcon();
		this.mcService.setMoodValue(this.actualMood);
	}

	initMood() {
		if (this.actualMood === undefined) {
			this.actualMood = 10;
		}
	}

	setWithinRange() {
		if (this.actualMood === 0 || this.actualMood < 1) {
			this.actualMood = 1;
		}

		if (this.actualMood > 10) {
			this.actualMood = 10;
		}
	}

	getLabel() {
		this.moodLabels = this.feelings.find(feelings => feelings.Key === (this.actualMood - 1).toString())['Value'];
	}

	getIcon() {
		this.moodIconUrl = `/assets/img/moodcheck/${this.currentMood}@2x.png`;
	}


}
