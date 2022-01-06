import {
	Component,
	ViewChild,
	ViewEncapsulation,
	OnInit,
	Input,
	Inject,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { MenuService } from "../../../lib/menu.service";

@Component({
	selector: "menu-footer",
	templateUrl: "./menu-footer.component.html",
	styleUrls: ["./menu-footer.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class MenuFooterComponent implements OnInit {

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
				this.menuService.navIn = false;
			});
		});
	}

	get menuService(): MenuService {
		return this.menuservice;
	}
}
