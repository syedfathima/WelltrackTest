import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
	MatFormField,
	MatFormFieldControl,
} from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { RegisterPaymentComponent } from "../components/register-payment/register-payment";
import { ThoughtDiaryListingComponent } from "../components/thoughtdiary/thoughtdiary.component";
import { Loader } from "../components/loader/loader.component";
import { FilterPipe } from "../pipes/filter";
import { TimesPipe } from "../pipes/times";
import { MomentModule } from "angular2-moment";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { FunAchievementListingComponent } from "../components/fun-achievement-listing/fun-achievement-listing.component"
import { DatePopup } from '../components/date-popup/date-popup';
import { DatePickerModule } from '../components/ng2-datepicker/ng2-datepicker.module';
import { ActivitySelect } from "../components/activity-select/activity-select";
import { AddictionListingPage } from "../modules/practice/addiction-listing/addiction-listing";
import { DashboardExecutiveComponent } from "../components/dashboard-executive/dashboard-executive.component";
import { BarChartComponent } from "../components/graphs/barchart/barchart.component";
import { UserChartsComponent } from "../components/user-charts/user-charts.component";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { DasAssessmentListingComponent } from "../components/das-assessment-listing/das-assessment-listing.component";
import { AlertDialog } from "../components/alert-dialog/alert-dialog.component";
// import { ActivitySchedulerListingPage } from "../modules/practice/activity-scheduler-listing/activity-scheduler-listing.component";

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(
		http,
		"/assets/i18n/",
		".json?cb=" + new Date().getTime()
	);
}

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
		}),
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatCheckboxModule,
		MatInputModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MomentModule,
		MatProgressSpinnerModule,
		DatePickerModule,
		MatTableModule,
		MatTabsModule,
		MatIconModule,
		MatDialogModule,
	],
	declarations: [
		RegisterPaymentComponent,
		ThoughtDiaryListingComponent,
		Loader,
		FilterPipe,
		TimesPipe,
		PageHeaderComponent,
		FunAchievementListingComponent,
		DatePopup,
		ActivitySelect,
		AddictionListingPage,
		DashboardExecutiveComponent,
		BarChartComponent,
		UserChartsComponent,
		DasAssessmentListingComponent,
		AlertDialog,
	],
	exports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		MatSelectModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatInputModule,
		MatFormFieldModule,
		RegisterPaymentComponent,
		ThoughtDiaryListingComponent,
		Loader,
		FilterPipe,
		TimesPipe,
		PageHeaderComponent,
		FunAchievementListingComponent,
		DatePopup,
		ActivitySelect,
		BarChartComponent,
		UserChartsComponent,
		DashboardExecutiveComponent,
		DasAssessmentListingComponent,
		AlertDialog,
	],
	providers: [FilterPipe, TimesPipe],
	bootstrap: [],
	entryComponents: [
		RegisterPaymentComponent,
		ThoughtDiaryListingComponent,
		Loader,
		PageHeaderComponent,
		FunAchievementListingComponent,
		ActivitySelect,
		DashboardExecutiveComponent,
		DasAssessmentListingComponent,
		AlertDialog
	],
})
export class SharedModule {}
