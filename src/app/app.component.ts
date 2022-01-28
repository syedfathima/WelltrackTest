import { Component, Inject, ViewChild, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { StorageService } from './lib/storage.service';
import { AuthService } from './lib/auth.service';
import { ApiService } from './lib/api.service';
import { User } from './models/user';

import { LogService } from './lib/log.service';
import { ModalService } from './lib/modal.service';
import { Router, ActivatedRoute, NavigationEnd, Event, Params } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { ApiError } from './lib/api-error';

import { TranslateService } from '@ngx-translate/core';
import { AutoLogoutService } from './lib/auto-logout';
import {AutoLogoutIdle} from './lib/auto-logout-idle'
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as jQuery from 'jquery';
import { MessagingService } from './lib/message-service';

@Component({
	templateUrl: 'app.component.html',
	selector: 'app',
	styleUrls: ['./app.component.scss']
})
export class WellTrackApp implements OnInit, OnDestroy {
	rootPage: any; // = TabsPage;
	user: User;
	popup: any;
	queryLang: any;
	onLangChange: Subscription = undefined;
	message:any;
	pushShown:boolean=false;
	constructor(
		private storage: StorageService,
		private auth: AuthService,
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
		private router: Router,
		private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
		private translateService: TranslateService,
		private activatedRoute: ActivatedRoute,
		private autologout: AutoLogoutService,
		private autologoutIdle: AutoLogoutIdle,
		public el: ElementRef,
		titleService: Title,
		private http: HttpClient,
		private messagingService: MessagingService
	) {
		this.autologoutIdle.initialize();
		// this language will be used as a fallback when a translation isn't found in the current language
		this.translateService.setDefaultLang('en');
		let lang = <string>this.storage.get('lang', false);

		if (lang) {
			this.translateService.use(lang);
		} else {
			if (this.translateService.getBrowserLang() === 'fr') {
				this.translateService.use('fr');
				lang = 'fr';
			} else {
				this.translateService.use('en');
				lang = 'en';
			}
			this.storage.set('lang', lang, false);
		}


		//Listen for changes to authenticated state
		this.auth.Authenticator.subscribe((authenticated: boolean) => {
			this.log.debug('subscribe called');
			if(authenticated){
				this.checkForAuthentication();
			}
		});

		router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.log.debug('event navigation called');
				let titles = this.translateService.get('pagetitles').subscribe(res => {
					this.log.debug(res);
					var title = this.getTitle(router.routerState, router.routerState.root).join('-');
					let translatedTitle = res[title] ? res[title] : 'Welltrack';
					titleService.setTitle(translatedTitle);
				});

			}
		});


		navigator.serviceWorker.addEventListener('message', (message) => {
			this.pushShown= false;
			this.message = message.data;
			this.pushShown= true;
		});
		  if ('serviceWorker' in navigator) {
			window.addEventListener('load', function() {
			  navigator.serviceWorker.register('../firebase-messaging-sw.js').then(function(registration) {
				// Registration was successful
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			  }, function(err) {
				// registration failed :
				console.log('ServiceWorker registration failed: ', err);
			  });
			});
		  }
		  
		// Push notigication subscribe
		this.messagingService.currentMessage.subscribe(message=>{
			this.pushShown= false;
			this.message = message;
			this.pushShown= true;
		})

	
	}

	closePush(){
		this.pushShown = false;
	}

	
	ngOnInit() {
		this.updateLanguage();
		this.onLangChange = this.translateService.onLangChange.subscribe(() => {
			this.updateLanguage();
		});
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.queryLang = params['lang'];
			if (this.queryLang === 'fr') {
				this.storage.set('lang', this.queryLang, false);
				this.translateService.use('fr');
			}
		});
		this.translateService.stream('error').subscribe((res: any) => {
			this.popup = res;
		})
		//Is this the first time running the app?
		if (!this.storage.checkFlag('first_app_run')) {
			this.storage.setFlag('first_app_run');
			this.log.event('app_installed');
		}

		this.checkForAuthentication();
		jQuery(document).keydown(function (event) {
			if ((navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") == -1) || navigator.userAgent.indexOf('Firefox') > -1 || true) {
				if (event.which === 9) {
					if (!event.shiftKey) {
						var selectables = jQuery('a, input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]')
							.not('[tabindex=-1], [disabled], :hidden');
						var current = jQuery(':focus');
						var nextIndex = 0;
						if (current.length === 1) {
							var currentIndex = selectables.index(current);
							if (currentIndex + 1 < selectables.length) {
								nextIndex = currentIndex + 1;
							}
						}
						selectables.eq(nextIndex).focus();
					}
					else {
						var selectables = jQuery('a, input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]')
							.not('[tabindex=-1], [disabled], :hidden');
						var current = jQuery(':focus');
						var prevIndex = selectables.length - 1;
						if (current.length === 1) {
							var currentIndex = selectables.index(current);
							if (currentIndex > 0) {
								prevIndex = currentIndex - 1;
							}
						}
						selectables.eq(prevIndex).focus();
					}
					event.preventDefault();
				}
			}
		});

	}

	handleDocumentKeyDown() {

	}

	getTitle(state, parent) {
		var data = [];
		if (parent && parent.snapshot.data && parent.snapshot.data.title) {
			data.push(parent.snapshot.data.title);
		}

		if (state && parent) {
			data.push(... this.getTitle(state, state.firstChild(parent)));
		}
		return data;
	}

	ngOnDestroy() {
		if (this.onLangChange !== undefined) {
			this.onLangChange.unsubscribe();
		}
	}

	checkForAuthentication() {
		let resp = this.auth.isAuthenticated();
		
		if (resp) {
			this.api.get('users/me').subscribe(
				(result: any) => {
					this.user = new User(result.data);
					this.storage.set('user', this.user, true);
					if(this.user.userType === 'admin'){
						this.storage.set('isAuthenticated', true, false, 200);
					}
				},
				(error: ApiError) => {
					this.log.error('Error fetching user profile: ' + error.message);

					if (error.status === 401) {
						this.auth.logout();
					} else {
						this.modalService.showAlert(this.popup.title, this.popup.connect);
					}
				},
				() => {
					//has the user entered an access code yet?
					if( this.user.userType !== 'admin'){
						//this.autologout.initialize();
					}

					if (this.auth.redirectUrl) {
						this.router.navigateByUrl(this.auth.redirectUrl);
						this.auth.redirectUrl = null;
					} else {

						if (this.router.url === 'login') {
							this.router.navigate(['app']);
						}
					}

				}
			);

		}
	}

	updateLanguage() {
		const lang = document.createAttribute('lang');
		lang.value = this.translateService.currentLang;
		this.el.nativeElement.parentElement.parentElement.attributes.setNamedItem(lang);
	}
}
