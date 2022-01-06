import { Component, OnInit } from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { config } from '../../../environments/all';
import { ModalService } from '../../lib/modal.service';
import { SupportComponent } from '../../components/support/support';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../lib/storage.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-public-portal',
	templateUrl: './public-portal.component.html',
	styleUrls: ['./public-portal.component.scss'],
	providers: [{ provide: CarouselConfig, useValue: { interval: false, noPause: true } }]
})
export class PublicPortalTemplate implements OnInit {

	navIn: boolean;
	playStore: string;
	appStore: string;
	language: string;

	constructor(private modalService: ModalService,
		private translateService: TranslateService,
		private storage: StorageService) {
		this.navIn = false;
		this.appStore = config.appStore;
		this.playStore = config.playStore;
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

	onChangeLanguage(value: string) {
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

	onNavToggle() {
		this.navIn = !this.navIn;
	}

	onNavClose() {
		this.navIn = false;
	}

	onShowSupportPage() {
		this.modalService.showComponent(SupportComponent, {});
	}

	onSkip(){
		setTimeout(function(){
			jQuery('.public-portal-right-col input').first().focus();
		}, 500);
	}
}
