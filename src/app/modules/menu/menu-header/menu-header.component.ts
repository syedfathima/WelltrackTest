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
	selector: "menu-header",
	templateUrl: "./menu-header.component.html",
	styleUrls: ["./menu-header.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class MenuHeaderComponent implements OnInit {

	constructor(
		private router: Router,
		private menuservice: MenuService,
		private translate: TranslateService
	) {
	}

	ngOnInit() {
		this.menuservice.initPermissions();
	}

	get menuService(): MenuService {
		return this.menuservice;
	}
}
