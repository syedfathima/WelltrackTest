import {
	Component,
	ViewChild,
	ViewEncapsulation,
	OnInit,
	Input,
	Inject,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../../lib/api.service";
import { LogService } from "../../../lib/log.service";
import { Router } from "@angular/router";
import { MenuService } from "../../../lib/menu.service";

@Component({
	selector: "app-admin-menu",
	templateUrl: "./admin-menu.component.html",
	styleUrls: ["../menu.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class AdminMenuComponent implements OnInit {
	pathActive: string = "";
	messagesActive: boolean = false;
	navIn: boolean;

	constructor(
		private router: Router,
		private menuservice: MenuService,
		private translate: TranslateService
	) {
	}

	ngOnInit() {
		this.menuservice.initPermissions();
	}

	nav(path) {
		this.pathActive = path;
		setTimeout(() => {
			this.router.navigate([path]);
			this.onNavClose();
		}, 100);
	}

	onNavClose() {
		this.navIn = false;
		setTimeout(function () {
			jQuery(".navbar-toggle").focus();
		}, 500);
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
