import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicPortalTemplate } from './pages/public-portal/public-portal.component';
import { PublicPortalFullTemplate } from './pages/public-portal-full/public-portal-full';
import { AuthPortalTemplate } from './pages/auth-portal/auth-portal.component';
import { RegisterPaymentPage } from './pages/register-payment/register-payment';
import { DashboardPage } from './pages/dashboard/dashboard.component';
import { DashboardPageExecutive } from './pages/dashboard-executive/dashboard-executive.component';
import { AuthGuard } from './guards/auth.guard';
import { AssociatedGuard } from './guards/associated.guard';
import { OrgConfigGuard } from './guards/orgConfig.guard';
import { AclGuard } from './guards/acl.guard';
import { environment } from '../environments/environment';
import { OrganizationEditPage } from './pages/organization-edit/organization-edit.component';
import { OrganizationViewPage } from './pages/organization-view/organization-view.component';
import { UserListingAdminPage } from './pages/user-listing-admin/user-listing-admin.component';
import { SettingsPage } from './pages/settings/settings';
import { EmergencyContactPage } from './pages/emergency-contact/emergency-contact';
import { ResourcesPage } from './pages/resources/resources';
import { CoreContributorsPage } from './pages/corecontributors/corecontributors';
import { CounselorSyncPage } from './pages/counselor-sync/counselor-sync';
import { AssessmentsPage } from './pages/assessments/assessments';
import { DasAssessmentPage } from './pages/das-assessment/das-assessment';
import { AddictionAssessmentPage } from './pages/addiction-assessment/addiction-assessment';
import { CommunityComponent } from './pages/community/community.component';
import { TheoryComponent } from './pages/theory/theory.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CoursesListingComponent } from './pages/courses-listing/courses-listing.component';
import { AddictionListingPage } from './modules/practice/addiction-listing/addiction-listing';
import { DasAssessmentListingPage } from './pages/das-assessment-listing/das-assessment-listing.component';
import { ResilienceListingPage } from './pages/resilience-listing/resilience-listing';
import { ChallengeListingPage } from './pages/challenges/challenge-listing/challenge-listing.component';
import { UserProfileDetailsComponent } from './pages/user-profile-details/user-profile-details.component';
import { OrganizationListingPage } from './pages/organization-listing/organization-listing.component';
import { ActivityInfoPage } from './pages/activity-info/activity-info.component';
import { ChallengeListingAdminPage } from 'app/pages/challenges/challenge-listing-admin/challenge-listing-admin.component';
import { CalendarPage } from 'app/pages/calendar/calendar.component';
import { ReportsPage } from 'app/pages/reports/reports';
import { VideoShareComponent } from 'app/pages/video-share/video-share.component';
import { OnboardingPage } from 'app/pages/onboarding/onboarding';
import { DemographicPage } from 'app/pages/demographic/demographic';
import { ManageResourcesPage } from 'app/pages/manage-resources/manage-resources';
import { SupportComponent } from './components/support/support';
import { ResiliencePage } from './pages/resilience/resilience';
import { AssessmentsListingPage } from "./pages/assessments-listing/assessments-listing.component";
import { ResourceImportPage } from './pages/resources-import/resources-import.component';
import { AdminCourseListingPage } from './pages/admin-course-listing/admin-course-listing.component';
import { PodcastsPage } from './pages/podcasts/podcasts';
import { AuthSideMenuTemplate } from './pages/auth-side-menu/auth-side-menu.component';
import { SchedulePushNotificationPage } from './pages/schedule-push-notifications/schedule-push-notifications.component';
import { UserDatedEventsListingPage } from './pages/user-dated-events-listing/user-dated-events-listing.component';
import { NotFoundPage } from './pages/not-found/not-found';
import { AdditionalResourcesPage }from './pages/additional-resources/additional-resources';
import { AdditionalResourceListingPage } from './pages/additional-resource-listing/additional-resource-listing.component';
import { ResourceView } from './pages/resource-view/resource-view.component';
import { FavouriteListingComponent } from './components/favourite-listing/favourite-listing.component';
import { ConfigListingComponent } from './components/config-listing/config-listing.component';
import { InternalUserListingComponent } from './pages/internal-user-listing/internal-user-listing.component';

const appRoutes: Routes = [
	{
		path: '',
		component: PublicPortalTemplate,
		loadChildren: './modules/auth/auth.module#AuthModule'
	},
	{
		path: '',
		component: PublicPortalFullTemplate,
		loadChildren: './modules/public/public.module#PublicModule'
	},
	{
		path: 'app/practice',
		component: AuthSideMenuTemplate,
		canActivate: [AuthGuard, OrgConfigGuard],
		loadChildren: './modules/practice/practice.module#PracticeModule'
	},
	{
		path: 'professional',
		component: AuthSideMenuTemplate,
		canActivate: [AuthGuard, AclGuard],
		loadChildren: './modules/professional/professional.module#ProfessionalModule'
	},
	{
		path: '',
		component: PublicPortalTemplate,
		children: [
			{
				path: '404',
				component: NotFoundPage,
				data: { title: 'notFound' }
			}
		]
	},
	{
		path: '',
		component: PublicPortalFullTemplate,
		children: [
			// {
			// 	path: 'purchase/:promo',
			// 	component: RegisterPaymentPage,
			// 	data: { title: 'payment' }
			// },

		]
	},
	{
		path: 'app',
		component: AuthSideMenuTemplate,
		canActivate: [AuthGuard, OrgConfigGuard],
		children: [
			{
				path: '',
				component: DashboardPage,
				data: { title: 'dashboard' }
			},
			{
				path: 'theory',
				component: TheoryComponent,
				data: { title: 'theory' }
			},
			{
				path: 'podcasts',
				component: PodcastsPage,
				data: { title: 'podcasts' }
			},
			{
				path: 'theory/resiliences',
				component: ResiliencePage,
				data: { title: 'course' }
			},
			{
				path: 'community',
				component: CommunityComponent,
				data: { title: 'community' }
			},
			{
				path: 'emergency-contact',
				component: EmergencyContactPage,
				data: { title: 'emergencycontact' }
			},
			{
				path: 'resources',
				component: ResourcesPage,
				data: { title: 'resources' }
			},
			{
				path: 'corecontributors',
				component: CoreContributorsPage,
				data: { title: 'corecontributors' }
			},
			{
				path: 'counselor-sync',
				component: CounselorSyncPage,
				data: { title: 'counselors' }
			},
			{
				path: 'assessments',
				component: AssessmentsPage,
				data: { title: 'assessment' }
			},
			{
				path: 'assessments/das/listing',
				component: DasAssessmentListingPage,
				data: { title: 'assessmentlisting' }
			},
			{
				path: 'assessments/resilience/listing',
				component: ResilienceListingPage,
				data: { title: 'resiliencelisting' }
			},
			{
				path: 'assessments/addiction/listing',
				component: AddictionListingPage,
				data: { title: 'resiliencelisting' }
			},
			{
				path: 'assessments/:assessment/new',
				component: DasAssessmentPage,
				data: { title: 'asessment' }
			},
			{
				path: 'settings',
				component: SettingsPage,
				data: { title: 'settings' }
			},
			{
				path: 'courses-listing/:theory',
				component: CoursesListingComponent,
				data: { title: 'courselisting' }
			},
			{
				path: 'courses-listing/:theory/:course',
				component: CoursesComponent,
				data: { title: 'course' }
			},
			{
				path: 'organizationprofile',
				component: OrganizationEditPage,
				data: { title: 'organizationprofile' }
			},
			{
				path: 'challenges',
				component: ChallengeListingPage,
				data: { title: 'challenges' }
			},
			{
				path: 'calendar',
				component: CalendarPage,
				data: { title: 'myCalendar' }
			},
			{
				path: 'videoshare/session/:id',
				component: VideoShareComponent,
				data: { title: 'videosession' }
			},
			{
				path: 'videoshare/open/new',
				component: VideoShareComponent,
				data: { title: 'videosessionopen' }
			},
			{
				path: 'videoshare/open/:id',
				component: VideoShareComponent,
				data: { title: 'videosessionshare' }
			},
			{
				path: 'demographic',
				component: DemographicPage,
				data: { title: 'demographicinfo' }
			},
			{
				path: 'schedule-push-notification',
				component: SchedulePushNotificationPage,
				data: { title: 'schedulePushNotification' }
			},
			{
				path: 'dated-event-listing',
				component: UserDatedEventsListingPage,
				data: { title: 'userDatedEventsListing' }
			},
			{
				path: 'additional-resources',
				component: AdditionalResourcesPage,
				data: { title: 'additionalResources' }
			},
			{
				path: 'additional-resource-listing',
				component: AdditionalResourceListingPage,
				data: { title: 'additionalResources' }
			},
			{
				path: 'resource-view',
				component: ResourceView,
				data: { title: 'resourceView' }
			},
			{
				path: 'favourites',
				component: FavouriteListingComponent,
				data: { title: 'favouriteListing' }
			},
			{
				path: 'configListing',
				component: ConfigListingComponent,
				data: { title: 'configListing' }
			},
			{
				path: 'relational-manager-user-listing',
				component: InternalUserListingComponent,
				data: { title: 'relationalManagerUserlisting' }
			},
		]
	},
	{
		path: 'professional',
		component: AuthSideMenuTemplate,
		canActivate: [AuthGuard, AclGuard],
		data: { role: ['professional', 'orgadmin'] },
		children: [
			// {
			// 	path: 'dashboard',
			// 	component: DashboardPageExecutive,
			// 	data: { title: 'dashboard' }
			// },
		]
	},
	{
		path: 'executive',
		component: AuthSideMenuTemplate,
		canActivate: [AuthGuard, AclGuard],
		data: { role: ['orgadmin'] },
		children: [
			{
				path: 'dashboard',
				component: DashboardPageExecutive,
				data: { title: 'dashboard' }
			},
			{
				path: 'organization-edit',
				component: OrganizationEditPage,
				data: { title: 'organizationedit' }
			},
			{
				path: 'organization-setup',
				component: OnboardingPage,
				data: { title: 'organizationsetup' }
			}
		]
	},
	{
		path: 'manage',
		component: AuthSideMenuTemplate,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'resources',
				component: ManageResourcesPage,
				data: { title: 'manageresources' }
			}
		]
	},
	{
		path: 'admin',
		component: AuthSideMenuTemplate,
		canActivate: [AuthGuard, AclGuard],
		data: { role: ['admin'] },
		children: [
			{
				path: 'user-listing',
				component: UserListingAdminPage,
				data: { title: 'userlisting' }
			},
			{
				path: 'user/:id',
				component: UserProfileDetailsComponent,
				data: { title: 'userprofiledetails' }
			},
			{
				path: 'organization/:id',
				component: OrganizationViewPage,
				data: { title: 'organizationview' }
			},
			{
				path: 'organization-listing',
				component: OrganizationListingPage,
				data: { title: 'organizationlisting' }
			},
			{
				path: 'activity',
				component: ActivityInfoPage,
				data: { title: 'activity' }
			},
			{
				path: 'challenges',
				component: ChallengeListingAdminPage,
				data: { title: 'managechallenges' }
			},
			{
				path: 'reports',
				component: ReportsPage,
				data: { title: 'reports' }
			},
			{
				path: 'system',
				component: ReportsPage,
				data: { title: 'system' }
			},
			{
				path: 'manage-resources',
				component: ManageResourcesPage,
				data: { title: 'manageresourcess' }
			},
			{
				path: 'assessments-listing',
				component: AssessmentsListingPage,
				data: { title: 'assessmentslisting' }
			},
			{
				path: 'resources-import',
				component: ResourceImportPage,
				data: { title: 'resourcessimport' }
			},
			{
				path: 'course-listing',
				component: AdminCourseListingPage,
				data: { title: 'adminResourceImport'}
			},
			{
				path: 'internal-user-listing',
				component: InternalUserListingComponent,
				data: { title: 'internalUserlisting' }
			}
		]
	},
	{
		path: '**',
		redirectTo: '/404'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(
			appRoutes,
			{  enableTracing: !environment.production, relativeLinkResolution: 'legacy' }
		)
	],
	exports: [
		RouterModule
	],
	declarations: [
	]
})
export class AppRoutingModule { }
