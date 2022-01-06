import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSelect } from '@angular/material/select';
import * as jQuery from 'jquery';
import * as _ from 'lodash';

@Component({
	selector: 'language-dropdown',
	templateUrl: 'language-dropdown.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./language-dropdown.component.scss']
})
export class LanguageComponent implements OnInit {

	language: string;
	@Input() color: string;
	@Input() page: string;

	constructor(
		private logService: LogService,
		private translateService: TranslateService,
		private storage: StorageService,
	) {
		this.language = 'en'
	}

	ngOnInit() {
		this.translateService.stream('lang').subscribe((res: any) => {
			if (res === 'en') {
				this.language = 'En'
				this.onChangeLanguage('en');
			} else {
				this.language = 'Fr'
				this.onChangeLanguage('fr');
			}
		})
	}

	onChangeLanguage(value) {
		let lang = value.toLowerCase();

		if (lang === 'en') {
			this.language = _.capitalize('fr');
		} else {
			this.language = _.capitalize('en');
		}

		this.translateService.use(lang);
		this.translateService.setDefaultLang(lang);
		this.storage.set('lang', lang, false);
	}

	onPressTabKey(event: KeyboardEvent) {
		//not tab or shift tab
		if (event.shiftKey && event.keyCode === 9 || event.keyCode === 9) {
			return true;
		} else {
			this.onChangeLanguage(this.language);
		}

	}
}


