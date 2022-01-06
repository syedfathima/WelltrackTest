import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DashboardPageExecutive } from "./dashboard-executive/dashboard-executive.component";
import { UserListingPage } from "./user-listing/user-listing.component";
import { UserDetailsPage } from "./user-details/user-details.component";

const publicRoutes = [
	{
		path: "",
		component: DashboardPageExecutive,
		data: { title: "dashbord-executive" },
	},
	{
		path: 'users',
		component: UserListingPage,
		data: { title: 'users' }
	},
	{
		path: 'user-details/:id',
		component: UserDetailsPage,
		data: { title: 'userdetails' }
	},
];

@NgModule({
	imports: [RouterModule.forChild(publicRoutes)],
	exports: [RouterModule],
})
export class ProfessionalRoutingModule {}
