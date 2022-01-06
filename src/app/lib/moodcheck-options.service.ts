import { Injectable, Inject, ViewChild, ComponentFactory, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { StorageService } from './storage.service';

import 'rxjs/Rx';
import { Subject } from 'rxjs';
//import { ModalController, Modal } from 'ionic-angular';
//import { MoodcheckOptionsPage } from '../../pages/moodcheck/moodcheck-options/moodcheck-options';


import * as _ from 'lodash';
import { config } from '../../environments/all';
import { ModalService } from './modal.service';
import { MoodcheckOptionsPage } from '../components/moodcheck-modal/moodcheck-options/moodcheck-options';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class MoodcheckOptionsService implements OnInit {

	watcher = new Subject();
	options: any;

	constructor(
		private modalService: ModalService,
		private storage: StorageService,
		private translate: TranslateService) {
		this.initOptions(translate.currentLang);
		this.translate.stream('lang').subscribe((res: any) => {
			if (res === 'en') {
				this.initOptions('en');
			} else {

				this.initOptions('fr');
			}
			this.refreshData();
		});
	}

	ngOnInit() {

	}


	initOptions(language: string) {
		this.options = {};
		this.options = <any>this.storage.get('moodcheckOptions', true) || {};

		let customEmotions;
		let customPlaces;
		let customActivities;
		let customPeople;

		this.options.people = _.union(this.options.people, customPeople);

		this.storage.set('moodcheckOptions', this.options, true);
	}

	initCategory(options) {
		let results = [];

		for (let i = 0; i < options.length; i++) {
			results.push({
				name: options[i],
				custom: false,
				enabled: true,
				usedCount: 0
			});
		}

		return results;
	}

	getCategory(category) {
		//filter out disabled items, and sort my most used
		let filteredOptions = this.options[category];
		filteredOptions = _.filter(filteredOptions, { 'enabled': true });
		filteredOptions = _.sortBy(filteredOptions, function (o: any) { return o.usedCount * -1; });
		return _.cloneDeep(filteredOptions);
	}

	refreshData() {
		let category = this.storage.get('moodcheckOptionsCategory');
		this.options = this.storage.get('moodcheckOptions', true);

		this.watcher.next({ category: category, options: this.getCategory(category) });
	}

	show(params?) {

		if (!params) {
			params = {};
		}

		this.storage.set('moodcheckOptionsCategory', params.category);
		this.modalService.showComponent(MoodcheckOptionsPage, {});
		//@ViewChild(MoodcheckOptionsPage) modal: MoodcheckOptionsPage;
		// this.modal = this.modalCtrl.create(MoodcheckOptionsPage, params, {cssClass: 'inset-modal'});

		// this.modal.onDidDismiss(data => {


		//     this.options = this.storage.get('moodcheckOptions');

		//     this.watcher.next({category: params.category, options: this.getCategory(params.category)});
		// });


		// this.modal.present();       
	}

	formatData(options) {
		for (let i = 0; i < options.length; i++) {
				options[i]['custom'] =  false,
				options[i]['enabled'] =  true,
				options[i]['usedCount'] = 0
		
		}

		return options;
	}
}
