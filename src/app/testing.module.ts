import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from './lib/api.service';
import { AuthService } from './lib/auth.service';
import { LocationService } from './lib/location.service';
import { LogService } from './lib/log.service';
import { MoodcheckService } from './lib/moodcheck.service';
import { StorageService } from './lib/storage.service';
import { UserService } from './lib/user.service';
import { UtilityService } from './lib/utility.service';
import { ModalService } from './lib/modal.service';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FacebookModule } from 'ngx-facebook';
import { WtComponentModule } from './components/welltrack-components.module';
import { ModalModule } from 'ngx-modialog';
import { VexModalModule } from 'ngx-modialog/plugins/vex';
import { CookieModule } from 'ngx-cookie';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { LocalStorageModule } from 'angular-2-local-storage';


@NgModule({
	imports: [
		RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
		BrowserModule,
		FormsModule,
		CarouselModule.forRoot(),
		FacebookModule.forRoot(),
		WtComponentModule,
		ModalModule.forRoot(),
		VexModalModule,
		CookieModule.forRoot(),
		// Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
		Angulartics2Module.forRoot(),
		LocalStorageModule.withConfig({
			prefix: 'wt',
			storageType: 'localStorage'
		})
	],
	providers: [
		ApiService,
		AuthService,
		LocationService,
		LogService,
		MoodcheckService,
		StorageService,
		UserService,
		UtilityService,
		ModalService,
		CookieModule,
		Location,
		{ provide: LocationStrategy, useClass: PathLocationStrategy },
		Angulartics2Module,
		[{ provide: APP_BASE_HREF, useValue: '/' }]
	],
	exports: [
	]
})
export class TestingModule { }
