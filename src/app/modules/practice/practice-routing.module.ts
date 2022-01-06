import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PracticeComponent } from "./practice/practice.component";
import { ThoughtDiaryListingPage } from "./thoughtdiary/thoughtdiary.component";
import { ThoughtDiaryDetailsPage } from "./thoughtdiary-details/thoughtdiary-details.component";
import { FunAchievementListingPage} from "./fun-achievement-listing/fun-achievement-listing.component";
import { FunAchievementDetailsPage } from "./fun-achievement-details/fun-achievement-details.component";
import { ActivitySchedulerListingPage } from "./activity-scheduler-listing/activity-scheduler-listing.component";
import { ActivitySchedulerDetails } from "./activity-scheduler-details/activity-scheduler-details";
import { AddictionListingPage } from "./addiction-listing/addiction-listing";
import { AddictionDetailsPage } from "./addiction-details/addiction-details";
import { ZenRoomPage } from "./zen-room/zen-room.component";
import { CognitiveQuiz } from "./cd-quiz/cd-quiz.component";

const practiceRoutes = [
    {
		path: "",
		component: PracticeComponent,
		data: { title: "practice" },
	},
	{
		path: 'thoughtdiary',
		component: ThoughtDiaryListingPage,
		data: { title: 'thoughtdiary' }
	},
	{
		path: 'thoughtdiary/new',
		component: ThoughtDiaryDetailsPage,
		data: { title: 'thoughtdiarycreate' }
	},
	{
		path: 'thoughtdiary/:id',
		component: ThoughtDiaryDetailsPage,
		data: { title: 'thoughtdiaryedit' }
	},
	{
		path: 'funachievement',
		component: FunAchievementListingPage,
		data: { title: 'funachievementlisting' }
	},
	{
		path: 'funachievement/new',
		component: FunAchievementDetailsPage,
		data: { title: 'funachievementcreate' }
	},
	{
		path: 'funachievement/:id',
		component: FunAchievementDetailsPage,
		data: { title: 'funachievementedit' }
	},
	{
		path: 'activityscheduler',
		component: ActivitySchedulerListingPage,
		data: { title: 'activityschedulerlisting' }
	},
	{
		path: 'activityscheduler/new',
		component: ActivitySchedulerDetails,
		data: { title: 'activityschedulercreate' }
	},
	{
		path: 'activityscheduler/:id',
		component: ActivitySchedulerDetails,
		data: { title: 'activityscheduleredit' }
	},
	{
		path: 'addiction',
		component: AddictionListingPage,
		data: { title: 'activityschedulerlisting' }
	},
	{
		path: 'addiction/new',
		component: AddictionDetailsPage,
		data: { title: 'activityschedulercreate' }
	},
	{
		path: 'addiction/:id',
		component: AddictionDetailsPage,
		data: { title: 'activityscheduleredit' }
	},
	{
		path: 'zen-room',
		component: ZenRoomPage,
		data: { title: 'zenroom' }
	},
	{
		path: 'cd-quiz',
		component: CognitiveQuiz,
		data: { title: 'cognitivedistortionsquiz' }
	},
];

@NgModule({
	imports: [RouterModule.forChild(practiceRoutes)],
	exports: [RouterModule],
})
export class PracticeRoutingModule {
    
}
