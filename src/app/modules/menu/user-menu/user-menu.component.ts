import {
	Component,
	ViewEncapsulation,
	OnInit,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { MenuService } from "../../../lib/menu.service";
import { UserService } from '../../../lib/user.service';
import { User } from '../../../models/user';

@Component({
	selector: "app-user-menu",
	templateUrl: "./user-menu.component.html",
	styleUrls: ["./user-menu.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {
	pathActive: string = "";
	messagesActive: boolean = false;
	navIn: boolean;
	user: User; 
	resilienceEnable: boolean;

	constructor(
		private router: Router,
		private menuservice: MenuService,
		private translate: TranslateService,
		private userService: UserService
	) {
	}

	ngOnInit() {
		this.menuservice.initPermissions();
		this.user = this.userService.getUser();

		if (this.user.primaryOrganization && this.user.primaryOrganization.settings['assessment'] === 'resilience') {
			this.resilienceEnable = true; 
		}
		else{
			this.resilienceEnable = false
		}
	}


	ngAfterViewInit() {
		this.translate.stream("lang").subscribe((res: any) => {
			if (res === "en") {
				this.menuservice.english = true;
			} else {
				this.menuservice.english = false;
			}
		});

		//Close the menu when a link is clicked
		jQuery(document).ready(() => {
			jQuery("#nav li a").click(() => {
				this.navIn = false;
			});
		});
	}

	get menuService(): MenuService {
		return this.menuservice;
	}
}
