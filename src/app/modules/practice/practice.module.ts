import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SharedModule } from "../../shared/shared.module";
import { PracticeRoutingModule } from "./practice-routing.module";
import { PracticeComponent } from "./practice/practice.component";
import { ThoughtDiaryListingPage } from "./thoughtdiary/thoughtdiary.component";
import { ThoughtDiaryDetailsPage } from "./thoughtdiary-details/thoughtdiary-details.component"; 
import { FunAchievementListingPage} from "./fun-achievement-listing/fun-achievement-listing.component";
import { FunAchievementDetailsPage } from "./fun-achievement-details/fun-achievement-details.component";
import { ActivitySchedulerDetails } from "./activity-scheduler-details/activity-scheduler-details";
import { AddictionDetailsPage } from "./addiction-details/addiction-details";
import { ZenRoomPage } from "./zen-room/zen-room.component";
import { CognitiveQuiz } from "./cd-quiz/cd-quiz.component";

@NgModule({
	declarations: [
        PracticeComponent,
		ThoughtDiaryListingPage,
		ThoughtDiaryDetailsPage,
		FunAchievementListingPage,
		FunAchievementDetailsPage,
		ActivitySchedulerDetails,
		AddictionDetailsPage,
		ZenRoomPage,
		CognitiveQuiz,
	],
	imports: [
		CommonModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		PracticeRoutingModule,
		SharedModule,
	],
	providers: [],
	exports: [
	],
	entryComponents:[],
})
export class PracticeModule {}