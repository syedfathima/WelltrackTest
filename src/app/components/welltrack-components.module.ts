import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WtProgressModule } from './wt-progress/wt-progress.module';
import { BrowserModule } from '@angular/platform-browser';
import { MoodcheckModule } from './moodcheck-modal/moodcheck.module';
import { TutorialPage } from './tutorial/tutorial';
import { AssessmentAlert } from './assessment-alert/assessment-alert';
import { AssessmentResilienceAlert } from './assessment-resilience-alert/assessment-resilience-alert';
import { AssessmentCoreContributorAlert } from './assessment-core-contributor-alert/assessment-core-contributor-alert';
import { Invite } from './invite/invite';
import { AppointmentInviteComponent } from './appointment-invite/appointment-invite.component';
import { AppointmentInviteModalComponent } from './appointment-invite-modal/appointment-invite-modal.component';
import { ResilienceListingComponent } from './resilience-listing/resilience-listing.component';
import { HistoryPage } from './moodcheck-history/moodcheck-history';
import { ResultsComponent } from './results-modal/results-modal.component';
import { DatePickerModule } from './ng2-datepicker/ng2-datepicker.module';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { AnswerComponent } from './answer-modal/answer-modal.component';
import { EmergencyContactComponent } from './emergency-contact/emergency-contact.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ActivityModal } from './activity-modal/activity-modal.component';
import { MomentModule } from 'angular2-moment';
import { ActivityPopup } from './activity-popup/activity-popup.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { ChallengeListingComponent } from './challenge-listing/challenge-listing.component';
import { UserEditComponent } from './admin/user-edit/user-edit.component';
import { UserCreateComponent } from './admin/user-create/user-create.component';
import { UserAddZoomComponent } from './admin/user-add-zoom/user-add-zoom.component';
import { CreateDemoUser } from './admin/create-demo-user/create-demo-user.component';
import { OrgAuthComponent } from './admin/org-auth/org-auth.component';
import { OrganizationAdminEditComponent } from './admin/organization-admin-edit/organization-admin-edit.component';
import { AccessCodeComponent } from './admin/access-code/access-code.component';
import { ActivityListingComponent } from './activity-listing/activity-listing.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { LineChartComponent } from './graphs/linechart/linechart.component';
import { DonutChartComponent } from './graphs/donutchart/donutchart.component';
import { GeneralModalComponent } from './misc/generalmodal/generalmodal.component';
import { ChallengesEditComponent } from './admin/challenges-edit/challenges-edit.component';
import { SchedulerModalModule } from 'app/components/scheduler-modal/scheduler-modal.module';
import { ChallengeSelectorComponent } from 'app/components/challenges/challenge-selector/challenge-selector.component';
import { TooltipModule } from 'ng2-tooltip';
import { RegisterComponent } from './register/register';
import { MessagingListingComponent } from './messaging/messaging-listing/messaging-listing';
import { MessagingThreadComponent } from './messaging/messaging-thread/messaging-thread';
import { MessageComponent } from './messaging/message/message.component';
import { PublisherComponent } from './publisher/publisher.component';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { ResourcesComponent } from '../components/resources/resources.component';
import { DemographicComponent } from '../components/demographic/demographic.component';
import { DemographicResilienceComponent } from './demographic-resilience/demographic-resilience';
import { CourseFeedbackComponent } from '../components/course-feedback/course-feedback.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { CourseVideoCardComponent } from '../components/course-video-card/course-video-card.component';
import { PopupLoader } from '../components/popup-loader/popup-loader.component';
import { SharedModule } from "../shared/shared.module";

import { CalendarModule } from 'angular-calendar';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { CalendarProfessionalComponent } from '../components/calendar/calendar-professional/calendar-professional.component';
import { GraphChartsComponent } from './graph-charts/graph-charts.component';

import { NoticeComponent } from './notice/notice-component';
import { ChallengeNotificationsComponent } from './challenge-notifications/challenge-notifications-component';
import { CounselorUserAssociations } from './admin/counselor-user-associations/counselor-user-associations';
import { OrganizationSetupComponent } from './organization-setup/organization-setup-component';

import { ActivitySchedulingComponent } from './calendar/activity-scheduling/activity-scheduling.component';
import { UserSelectionComponent } from './calendar/user-selection/user-selection.component';
import { UserSelectionSingleComponent } from './calendar/user-selection-single/user-selection-single.component';
import { EventListingComponent } from './calendar/event-listing/event-listing.component';
import { SupportComponent } from './support/support';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabComponent } from './tabs/tab-component/tab.component';
import { TabsComponent } from './tabs/tabs-component/tabs.component';
import { OrganizationCloneComponent } from './admin/organization-clone/organization-clone.component';
import { SsoAuthorizationLoginComponent } from './sso-authorization-login/sso-authorization-login.component';
import { CourseCompleteFeedbackComponent } from './course-complete-feedback/course-complete-feedback.component';

import { AssessmentEditComponent } from "./admin/assessments-edit/assessments-edit.component";
import { CourseAdminEditComponent } from './admin/course-admin-edit/course-admin-edit.component';
import { ScheduledPushEditComponent } from './scheduled-push-edit/scheduled-push-edit.component';
import { AdditionalResourceEditComponent } from './admin/additional-resource-edit/additional-resource-edit.component';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { ResourceTableViewComponent } from './resource-table-view/resource-table-view.component';
import { ResourcesEditComponent } from './resources-edit-component/resources-edit-component';
import { ResourcesEditModal } from './resources-edit-modal/resources-edit-modal.component';
import { MultiselectAutocomplete } from './multi-select-autocomplete/multi-select-autocomplete.component';
import { DemographicEditComponent } from './demographic-edit/demographic-edit.component';
import { CloneResourcesComponent } from './admin/clone-resources/clone-resources.component';
import { ResouceExport } from './admin/resource-export/resource-export.component';
import { TagsAutocomplete } from './tags-autocomplete/tags-autocomplete';

// import { AdminMenuComponent } from './menu/admin-menu/admin-menu.component';
// import { UserMenuComponent } from './menu/user-menu/user-menu.component';
// import { ProfessionalMenuComponent } from './menu/professional-menu/professional-menu.component';
// import { SuperAdminMenuComponent } from './menu/super-admin-menu/super-admin-menu.component';
// import { OrgAdminMenuComponent } from './menu/org-admin-menu/org-admin-menu.component';
// import { OthersMenuComponent } from './menu/others-menu/others-menu.component';
// import { MenuHeaderComponent } from './menu/menu-header/menu-header.component';
// import { MenuFooterComponent } from './menu/menu-footer/menu-footer.component';
// import { MenuItemComponent } from './menu/menu-item/menu-item.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { MenuModule } from "../modules/menu/menu.module";
import { AddResourcesComponent } from './admin/add-resources/add-resources.component';
import { FavouriteListingComponent } from './favourite-listing/favourite-listing.component';
import { ConfigListingComponent } from './config-listing/config-listing.component';
import { CreateConfigComponent } from './create-config/create-config.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}

@NgModule({
	declarations: [
		TutorialPage,
		Invite,
		AppointmentInviteComponent,
		AppointmentInviteModalComponent,
		ResilienceListingComponent,
		HistoryPage,
		AssessmentAlert,
		AssessmentResilienceAlert,
		AssessmentCoreContributorAlert,
		ResultsComponent,
		AudioPlayerComponent,
		VideoPlayerComponent,
		AnswerComponent,
		ActivityModal,
		EmergencyContactComponent,
		ActivityPopup,
		DashboardAdminComponent,
		ChallengeListingComponent,
		UserEditComponent,
		UserCreateComponent,
		UserAddZoomComponent,
		CreateDemoUser,
		OrganizationAdminEditComponent,
		AccessCodeComponent,
		ActivityListingComponent,
		LineChartComponent,
		DonutChartComponent,
		GeneralModalComponent,
		ResourcesComponent,
		ChallengesEditComponent,
		ChallengeSelectorComponent,
		RegisterComponent,
		MessagingListingComponent,
		MessagingThreadComponent,
		MessageComponent,
		PublisherComponent,
		SubscriberComponent,
		DemographicComponent,
		DemographicResilienceComponent,
		CourseFeedbackComponent,
		CalendarComponent,
		CalendarProfessionalComponent,
		GraphChartsComponent,
		NoticeComponent,
		ChallengeNotificationsComponent,
		CounselorUserAssociations,
		OrganizationSetupComponent,
		ActivitySchedulingComponent,
		UserSelectionComponent,
		UserSelectionSingleComponent,
		EventListingComponent,
		OrgAuthComponent,
		SupportComponent,
		OrganizationCloneComponent,
		AssessmentEditComponent,
		TabComponent,
		TabsComponent,
		SsoAuthorizationLoginComponent,
		CourseCompleteFeedbackComponent,
		CourseAdminEditComponent,
		CloneResourcesComponent,
		ResouceExport,
		ScheduledPushEditComponent,
		CourseVideoCardComponent,
		PopupLoader,
		AdditionalResourceEditComponent,
		FeedbackFormComponent,
		ResourceTableViewComponent,
		ResourcesEditComponent,
		ResourcesEditModal,
		MultiselectAutocomplete,
		DemographicEditComponent,
		AddResourcesComponent,
		FavouriteListingComponent,
		TagsAutocomplete,
		FavouriteListingComponent,
		ConfigListingComponent,
		CreateConfigComponent,
	],
	imports: [
		BrowserModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		WtProgressModule,
		MoodcheckModule,
		DatePickerModule,
		VgCoreModule,
		VgControlsModule,
		VgOverlayPlayModule,
		VgBufferingModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		MomentModule,
		CKEditorModule,
		SchedulerModalModule,
		TooltipModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		Angular2FontawesomeModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDialogModule,
		MatDividerModule,
		MatExpansionModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatNativeDateModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatStepperModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTooltipModule,
		CalendarModule,
		CarouselModule,
		DragDropModule,
		NgxMaterialTimepickerModule,
		MenuModule,
		SharedModule,
	],
	exports: [
		TutorialPage,
		HistoryPage,
		Invite,
		AppointmentInviteComponent,
		ResilienceListingComponent,
		AssessmentAlert,
		AssessmentResilienceAlert,
		AssessmentCoreContributorAlert,
		AudioPlayerComponent,
		VideoPlayerComponent,
		EmergencyContactComponent,
		MomentModule,
		DashboardAdminComponent,
		ChallengeListingComponent,
		ActivityListingComponent,
		UserEditComponent,
		UserCreateComponent,
		UserAddZoomComponent,
		CreateDemoUser,
		OrganizationAdminEditComponent,
		AccessCodeComponent,
		LineChartComponent,
		DonutChartComponent,
		GeneralModalComponent,
		ResourcesComponent,
		ChallengesEditComponent,
		ChallengeSelectorComponent,
		RegisterComponent,
		MessagingListingComponent,
		MessagingThreadComponent,
		MessageComponent,
		PublisherComponent,
		SubscriberComponent,
		DemographicComponent,
		DemographicResilienceComponent,
		CourseFeedbackComponent,
		CalendarComponent,
		CalendarProfessionalComponent,
		GraphChartsComponent,
		NoticeComponent,
		ChallengeNotificationsComponent,
		CounselorUserAssociations,
		OrganizationSetupComponent,
		ActivitySchedulingComponent,
		UserSelectionComponent,
		UserSelectionSingleComponent,
		EventListingComponent,
		SupportComponent,
		OrgAuthComponent,
		OrganizationCloneComponent,
		AssessmentEditComponent,
		TabComponent,
		TabsComponent,
		SsoAuthorizationLoginComponent,
		CourseCompleteFeedbackComponent,
		CourseAdminEditComponent,
		// AdminMenuComponent,
		// UserMenuComponent,
		// ProfessionalMenuComponent,
		// SuperAdminMenuComponent,
		// OthersMenuComponent,
		// OrgAdminMenuComponent,
		// MenuHeaderComponent,
		// MenuFooterComponent,
		// MenuItemComponent,
		CloneResourcesComponent,
		ResouceExport,
		ScheduledPushEditComponent,
		CourseVideoCardComponent,
		PopupLoader,
		AdditionalResourceEditComponent,
		FeedbackFormComponent,
		ResourceTableViewComponent,
		ResourcesEditComponent,
		MultiselectAutocomplete,
		DemographicEditComponent,
		AddResourcesComponent,
		TagsAutocomplete,
	],
	entryComponents: [
		TutorialPage,
		HistoryPage,
		Invite,
		AppointmentInviteComponent,
		AppointmentInviteModalComponent,
		AssessmentAlert,
		AssessmentResilienceAlert,
		AssessmentCoreContributorAlert,
		ResultsComponent,
		AnswerComponent,
		ActivityModal,
		ActivityPopup,
		DashboardAdminComponent,
		ChallengeListingComponent,
		UserCreateComponent,
		UserEditComponent,
		UserAddZoomComponent,
		CreateDemoUser,
		OrganizationAdminEditComponent,
		AccessCodeComponent,
		GeneralModalComponent,
		ResourcesComponent,
		ChallengesEditComponent,
		ChallengeSelectorComponent,
		RegisterComponent,
		MessagingListingComponent,
		MessagingThreadComponent,
		MessageComponent,
		PublisherComponent,
		SubscriberComponent,
		DemographicComponent,
		DemographicResilienceComponent,
		CourseFeedbackComponent,
		CalendarComponent,
		GraphChartsComponent,
		NoticeComponent,
		ChallengeNotificationsComponent,
		CounselorUserAssociations,
		OrganizationSetupComponent,
		ActivitySchedulingComponent,
		UserSelectionComponent,
		UserSelectionSingleComponent,
		EventListingComponent,
		SupportComponent,
		OrgAuthComponent,
		OrganizationCloneComponent,
		AssessmentEditComponent,
		TabComponent,
		TabsComponent,
		SsoAuthorizationLoginComponent,
		CourseCompleteFeedbackComponent,
		CourseAdminEditComponent,
		CloneResourcesComponent,
		ResouceExport,
		ScheduledPushEditComponent,
		CourseVideoCardComponent,
		PopupLoader,
		AdditionalResourceEditComponent,
		FeedbackFormComponent,
		MultiselectAutocomplete,
		TagsAutocomplete,
		ResourcesEditComponent,
		ResourcesEditModal,
		ResourceTableViewComponent,
		DemographicEditComponent,
		AddResourcesComponent,
		CreateConfigComponent
	],
	providers: []
})
export class WtComponentModule { }
