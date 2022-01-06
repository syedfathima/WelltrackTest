import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from '../../../environments/all';

@Component({
	selector: 'app-public-portal',
	templateUrl: './public-portal-full.html',
	styleUrls: ['./public-portal-full.scss']
})
export class PublicPortalFullTemplate implements OnInit {

	navIn: boolean;
	playStore: string;
	appStore: string;
	title: string;
	description: string;
	showRegister: boolean = false;
	showLanguage: boolean = true;
	showLogo: boolean = true;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router

	) {
		this.navIn = false;
		this.title = 'Join Challenge';
		this.description = 'Sign-up or login to participate in this challenge';
	}

	ngOnInit() {
		let segment = this.router.url;
		if (segment.search('challenges') !== -1) {
			this.showRegister = true;
		}
		if (
			segment.search('medical-resources') !== -1 ||
			segment.search('privacy-policy') !== -1 ||
			segment.search('subscribe') !== -1 ||
			segment.search('purchase') !== -1 ||
			segment.search('terms-and-conditions') !== -1) {
			this.showLanguage = false;
			this.showLogo = false;
		}
	}

	onNavToggle() {
		this.navIn = !this.navIn;
	}

	onNavClose() {
		this.navIn = false;
	}
}
