import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { WellTrackApp } from "./app.component";
import { MomentModule } from "angular2-moment";
import { ApiService } from "./lib/api.service";
import { ApiRestService } from "./lib/api-rest.service";
import { AuthService } from "./lib/auth.service";
import { LocationService } from "./lib/location.service";
import { LogService } from "./lib/log.service";
import { MoodcheckService } from "./lib/moodcheck.service";
import { StorageService } from "./lib/storage.service";
import { UserService } from "./lib/user.service";
import { UtilityService } from "./lib/utility.service";
import { ModalService } from "./lib/modal.service";
import { GraphService } from "./lib/graph.service";
import { FileService } from "./lib/file.service";
import { OrganizationService } from "./lib/organization.service";
import { VideoService } from './lib/video.service';
import { SsoService } from './lib/sso.service';
import { ConfigService } from './lib/config.service';

import { PublicPortalTemplate } from "./pages/public-portal/public-portal.component";
import { PublicPortalFullTemplate } from "./pages/public-portal-full/public-portal-full";
import { RegisterPaymentPage } from "./pages/register-payment/register-payment";
import { AuthPortalTemplate } from "./pages/auth-portal/auth-portal.component";
import { DashboardPage } from "./pages/dashboard/dashboard.component";
import { DashboardPageExecutive } from "./pages/dashboard-executive/dashboard-executive.component";
import { AuthGuard } from "./guards/auth.guard";
import { AssociatedGuard } from "./guards/associated.guard";
import { OrgConfigGuard } from "./guards/orgConfig.guard";
import { AclGuard } from "./guards/acl.guard";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { OrganizationEditPage } from "./pages/organization-edit/organization-edit.component";
import { OrganizationViewPage } from "./pages/organization-view/organization-view.component";
import { UserListingAdminPage } from "./pages/user-listing-admin/user-listing-admin.component";
import { WtComponentModule } from "./components/welltrack-components.module";
import { ModalModule } from "ngx-modialog";
import { VexModalModule } from "ngx-modialog/plugins/vex";
import { CookieModule } from "ngx-cookie";
import { Angulartics2Module } from "angulartics2";
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { LocalStorageModule } from "angular-2-local-storage";
import { AppRoutingModule } from "./app-routing.module";
import { SettingsPage } from "./pages/settings/settings";
import { EmergencyContactPage } from "./pages/emergency-contact/emergency-contact";
import { ResourcesPage } from "./pages/resources/resources";
import { CoreContributorsPage } from "./pages/corecontributors/corecontributors";
import { CounselorSyncPage } from "./pages/counselor-sync/counselor-sync";
import { CommunityComponent } from "./pages/community/community.component";
import { TheoryComponent } from "./pages/theory/theory.component";
import { CoursesComponent } from "./pages/courses/courses.component";
import { CoursesListingComponent } from "./pages/courses-listing/courses-listing.component";
import { AssessmentsPage } from "./pages/assessments/assessments";
import { DasAssessmentPage } from "./pages/das-assessment/das-assessment";
import { ResilienceListingPage } from "./pages/resilience-listing/resilience-listing";
import { AddictionAssessmentPage } from "./pages/addiction-assessment/addiction-assessment";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ChallengeListingPage } from "./pages/challenges/challenge-listing/challenge-listing.component";
import { DndModule } from "ng2-dnd";
import { MoodcheckModule } from "./components/moodcheck-modal/moodcheck.module";
import { CKEditorModule } from "ng2-ckeditor";
import { MenuService } from "./lib/menu.service"
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { EventManagerService } from "./lib/event-manager.service";
import { MiniCalendarComponent } from "./components/calendar/mini.calendar.component";
import { StaticPagesModule } from "./pages/_static/static-pages.module";
import { DashboardAdminComponent } from "./pages/dashboard-admin/dashboard-admin.component";
import { OrganizationListingPage } from "./pages/organization-listing/organization-listing.component";
import { UserProfileDetailsComponent } from "./pages/user-profile-details/user-profile-details.component";
import { ActivityInfoPage } from "./pages/activity-info/activity-info.component";
import { ChallengeListingAdminPage } from "app/pages/challenges/challenge-listing-admin/challenge-listing-admin.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { AutoLogoutService } from "./lib/auto-logout";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarPage } from "app/pages/calendar/calendar.component";
import { TooltipModule } from "ng2-tooltip";
import { VideoShareComponent } from "./pages/video-share/video-share.component";
import { OpentokModule } from "ng2-opentok/dist/opentok.module";
import { VideoChatService } from "./lib/videochat.service";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { NgxStripeModule } from "ngx-stripe";
import { ReportsPage } from "app/pages/reports/reports";
import { OnboardingPage } from "app/pages/onboarding/onboarding";
import { DemographicPage } from "app/pages/demographic/demographic";
import { ManageResourcesPage } from "app/pages/manage-resources/manage-resources";
import { environment } from "../environments/environment";
import { Angular2FontawesomeModule } from "angular2-fontawesome/angular2-fontawesome";
import { ErrorPopup } from "./components/alerts/error-popup/error-popup";
import { ConfirmPopup } from "./components/alerts/confirm-popup/confirm-popup";
import { ModalPopup } from "./components/alerts/modal-popup/modal-popup";
import { CalendarService } from "./lib/calendar.service";
import { PermissionsService } from "./lib/permissions.service";
import { ResiliencePage } from "./pages/resilience/resilience";
import { AssessmentsListingPage } from "./pages/assessments-listing/assessments-listing.component";
import { ResourceImportPage } from "./pages/resources-import/resources-import.component";
import { AdminCourseListingPage } from "./pages/admin-course-listing/admin-course-listing.component"
import { PodcastsPage } from './pages/podcasts/podcasts';
import { AuthSideMenuTemplate } from "./pages/auth-side-menu/auth-side-menu.component";
import { SchedulePushNotificationPage } from "./pages/schedule-push-notifications/schedule-push-notifications.component";
import { UserDatedEventsListingPage } from "./pages/user-dated-events-listing/user-dated-events-listing.component";
import { NotFoundPage } from "./pages/not-found/not-found";
import { AuthModule } from "./modules/auth/auth.module";
import { MenuModule } from "./modules/menu/menu.module";
import { PublicModule } from "./modules/public/public.module";
import { SharedModule } from "./shared/shared.module";
import { PracticeModule } from "./modules/practice/practice.module";
import { ProfessionalModule } from "./modules/professional/professional.module";
import { ResourceView } from "./pages/resource-view/resource-view.component";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(
		http,
		"/assets/i18n/",
		".json?cb=" + new Date().getTime()
	);
}


import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

declare module "@angular/core" {
	interface ModuleWithProviders<T = any> {
		ngModule: Type<T>;
		providers?: Provider[];
	}
}

import { AutofocusDirective } from "./directives/auto-focus.directive";
import { PhoneNumberValidatorDirective } from "./directives/phone-number.directive";
import { AdditionalResourcesPage } from './pages/additional-resources/additional-resources';
import { AdditionalResourceListingPage } from './pages/additional-resource-listing/additional-resource-listing.component';
import { AutoLogoutIdle } from "./lib/auto-logout-idle";

export const configFactory = (configService: ConfigService) => {
	return () => configService.load();
};

//import { MessagingService } from "./lib/message-service";
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { MessagingService } from "./lib/message-service";
import { InternalUserListingComponent } from './pages/internal-user-listing/internal-user-listing.component';
@NgModule({
	declarations: [
		WellTrackApp,
		RegisterPaymentPage,
		PublicPortalTemplate,
		PublicPortalFullTemplate,
		AuthPortalTemplate,
		DashboardPage,
		DashboardPageExecutive,
		OrganizationEditPage,
		OrganizationViewPage,
		UserListingAdminPage,
		SettingsPage,
		EmergencyContactPage,
		ResourcesPage,
		CoreContributorsPage,
		CounselorSyncPage,
		AssessmentsPage,
		DasAssessmentPage,
		AddictionAssessmentPage,
		CommunityComponent,
		TheoryComponent,
		PodcastsPage,
		CoursesComponent,
		CoursesListingComponent,
		ResilienceListingPage,
		ChallengeListingPage,
		DashboardAdminComponent,
		OrganizationListingPage,
		UserProfileDetailsComponent,
		ActivityInfoPage,
		ChallengeListingAdminPage,
		CalendarPage,
		VideoShareComponent,
		ReportsPage,
		OnboardingPage,
		DemographicPage,
		ManageResourcesPage,
		ErrorPopup,
		ConfirmPopup,
		ModalPopup,
		MiniCalendarComponent,
		AutofocusDirective,
		ResiliencePage,
		PhoneNumberValidatorDirective,
		AssessmentsListingPage,
		ResourceImportPage,
		AdminCourseListingPage,
		AuthSideMenuTemplate,
		SchedulePushNotificationPage,
		UserDatedEventsListingPage,
		NotFoundPage,
		AdditionalResourcesPage,
		AdditionalResourceListingPage,
		ResourceView,
		InternalUserListingComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		AppRoutingModule,
		MomentModule,
		CarouselModule.forRoot(),
		WtComponentModule,
		StaticPagesModule,
		ModalModule.forRoot(),
		VexModalModule,
		CookieModule.forRoot(),
		// Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
		Angulartics2Module.forRoot(),
		LocalStorageModule.forRoot({
			prefix: "wt",
			storageType: "localStorage",
		}),
		ReactiveFormsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
		}),
		DndModule.forRoot(),
		MoodcheckModule,
		Ng2SmartTableModule,
		CKEditorModule,
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory,
		}),
		TooltipModule,
		OpentokModule.forRoot({ apiKey: "46249612" }),
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		NgxStripeModule.forRoot(environment.stripe.api_key),
		Angular2FontawesomeModule,
		MatNativeDateModule,
		MatDatepickerModule,
		MatInputModule,
		MatSelectModule,
		MatProgressSpinnerModule,
		MatCardModule,
		MatCheckboxModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatRadioModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatDialogModule,
		MatTabsModule,
		MatIconModule,
		MatStepperModule,
		MatExpansionModule,
		DragDropModule,
		NgxMaterialTimepickerModule,
		AuthModule,
		MenuModule,
		PublicModule,
		SharedModule,
		PracticeModule,
		ProfessionalModule,
		NgIdleKeepaliveModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireMessagingModule,
        
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: configFactory,
			deps: [ConfigService],
			multi: true
		},
		ApiService,
		ApiRestService,
		AuthService,
		LocationService,
		LogService,
		MoodcheckService,
		StorageService,
		UserService,
		UtilityService,
		AuthGuard,
		AssociatedGuard,
		OrgConfigGuard,
		AclGuard,
		ModalService,
		CookieModule,
		CKEditorModule,
		GraphService,
		AutoLogoutService,
		AutoLogoutIdle,
		VideoChatService,
		MatDatepickerModule,
		EventManagerService,
		CalendarService,
		PermissionsService,
		FileService,
		OrganizationService,
		VideoService,
		SsoService,
		MenuService,
		MessagingService
	],
	entryComponents: [
		ErrorPopup,
		ConfirmPopup,
		ModalPopup,
		PublicPortalTemplate,
	],

	schemas: [NO_ERRORS_SCHEMA],
	bootstrap: [WellTrackApp],
})
export class AppModule { }
