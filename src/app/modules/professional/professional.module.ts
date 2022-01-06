import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { ProfessionalRoutingModule } from "./professional-routing.module";
import { DashboardPageExecutive } from "./dashboard-executive/dashboard-executive.component";
import { UserListingPage } from "./user-listing/user-listing.component";
import { UserDetailsPage } from "./user-details/user-details.component";
import { DasAssessmentListingPage } from "../../pages/das-assessment-listing/das-assessment-listing.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { MomentModule } from 'angular2-moment';
import { ActivitySchedulerListingPage } from "../practice/activity-scheduler-listing/activity-scheduler-listing.component";

@NgModule({
	declarations: [
		DashboardPageExecutive,
		UserListingPage,
		UserDetailsPage,
		DasAssessmentListingPage,
		ActivitySchedulerListingPage,
	],
	imports: [
		CommonModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		ProfessionalRoutingModule,
		SharedModule,
		MomentModule,
	],
	providers: [],
	exports: [
	],
	entryComponents:[
	],
})
export class ProfessionalModule {}
