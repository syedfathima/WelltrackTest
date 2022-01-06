import { Component, OnInit } from "@angular/core";
import { MenuService } from "../../lib/menu.service";
import { UserService } from "../../lib/user.service";
import { User } from "../../models/user";
import { PermissionsService } from "../../lib/permissions.service";

@Component({
	selector: "app-auth-side-menu",
	templateUrl: "./auth-side-menu.component.html",
	styleUrls: ["./auth-side-menu.component.scss"],
})
export class AuthSideMenuTemplate implements OnInit {
	user: User;
	showFeedback: boolean = false;
	
	constructor(
		private menuservice: MenuService,
		private userService: UserService,
		private permissionService: PermissionsService
	) {
		this.user = this.userService.getUser();
		this.menuService.setNavIn(false);
		this.menuService.setUser(this.userService.getUser());

		this.userService.watcher.subscribe((user: User) => {
			this.menuservice.user = user;
			this.menuservice.user.isFullAccess ||
			this.menuservice.user.userType === "admin"
				? (this.menuservice.locked = false)
				: (this.menuservice.locked = true);
			this.menuservice.initPermissions();
		});

		this.menuService.setUserType(this.user.userType);
	}

	ngOnInit() {
		this.permissionService.setUser(this.user);

		//A calendar is already shown on the dashboard.
		//we can hide it for counselor's
		if (this.permissionService.canViewScheduler()) {
			this.menuservice.calendarShow = false;
		} else {
			if (this.user.permissions.calendar) {
				this.menuservice.calendarShow = true;
			}
		}

		this.menuservice.initPermissions();
	}

	get menuService(): MenuService {
		return this.menuservice;
	}

	showFeedbackForm() {
		this.showFeedback = true;
		setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
	}
}
