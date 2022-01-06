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
	selector: "menu-item",
	templateUrl: "./menu-item.component.html",
	styleUrls: ["../menu.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class MenuItemComponent implements OnInit {
	@Input() activeDefault:boolean;
	@Input() isActive:boolean;
	@Input() redirectTo:string;
	@Input() alt:string;
	@Input() imgSrc:string;
	@Input() title:string;

	constructor(
		private menuservice: MenuService,
	) {
	}

	ngOnInit() {
		this.menuservice.initPermissions();
	}

	get menuService(): MenuService {
		return this.menuservice;
	}
}
