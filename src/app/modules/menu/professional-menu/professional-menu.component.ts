import {
	Component,
	ViewEncapsulation,
	OnInit,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { MenuService } from "../../../lib/menu.service";

@Component({
	selector: "app-professional-menu",
	templateUrl: "./professional-menu.component.html",
	styleUrls: ["../menu.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class ProfessionalMenuComponent implements OnInit {
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
