import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";

import { AdminMenuComponent } from "./admin-menu/admin-menu.component";
import { SuperAdminMenuComponent } from "./super-admin-menu/super-admin-menu.component";
import { UserMenuComponent } from "./user-menu/user-menu.component";
import { ProfessionalMenuComponent } from "./professional-menu/professional-menu.component";
import { OrgAdminMenuComponent } from "./org-admin-menu/org-admin-menu.component";
import { OthersMenuComponent } from "./others-menu/others-menu.component";
import { MenuHeaderComponent } from "./menu-header/menu-header.component";
import { MenuFooterComponent } from "./menu-footer/menu-footer.component";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { ScreenHeader } from "../../components/screen-header/screen-header";
import { LanguageComponent } from "../../components/language-dropdown/language-dropdown.component";
import { OrganizationDropdown } from "../../components/organization-dropdown/organization-dropdown.component";
import { TruncatePipe } from "./truncate/truncate";

import { RouterModule } from "@angular/router";


@NgModule({
	declarations: [
		AdminMenuComponent,
		SuperAdminMenuComponent,
		UserMenuComponent,
		ProfessionalMenuComponent,
		OrgAdminMenuComponent,
		OthersMenuComponent,
		MenuHeaderComponent,
		MenuFooterComponent,
		MenuItemComponent,
		ScreenHeader,
		LanguageComponent,
		OrganizationDropdown,
		TruncatePipe,
	],
	imports: [CommonModule, RouterModule, SharedModule],
	providers: [],
	exports: [
		AdminMenuComponent,
		SuperAdminMenuComponent,
		UserMenuComponent,
		ProfessionalMenuComponent,
		OrgAdminMenuComponent,
		OthersMenuComponent,
		MenuHeaderComponent,
		MenuFooterComponent,
		MenuItemComponent,
		ScreenHeader,
		LanguageComponent,
		OrganizationDropdown,
		TruncatePipe,
	],
	entryComponents: [
		AdminMenuComponent,
		SuperAdminMenuComponent,
		UserMenuComponent,
		ProfessionalMenuComponent,
		OrgAdminMenuComponent,
		OthersMenuComponent,
		MenuHeaderComponent,
		MenuFooterComponent,
		MenuItemComponent,
		ScreenHeader,
		LanguageComponent,
		OrganizationDropdown,
	],
})
export class MenuModule {}
