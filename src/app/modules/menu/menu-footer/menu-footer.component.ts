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
import { MessagingService } from "app/lib/message-service";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { mergeMap } from 'rxjs/operators';
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
		private translate: TranslateService,
		private messagingService: MessagingService,private afMessaging: AngularFireMessaging
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

	onLogout(){
		alert(1)
		this.afMessaging.getToken
    .pipe(mergeMap(token => this.afMessaging.deleteToken('fuzdiYMlj1iSSCliCoqf6f:APA91bGMdfUB0Nj6WpnI_QU-nLV08ff3MEkMzHU5zs9gml1Z5U_tbDndv0RM_e0WaqUVVHyQ_OPJNLs-czAzvkVSTzvUP96TCc7ZCT7nH0vWvVulDVNMZR0f39fHEvNGa1bVl3nkhXd1')))
    .subscribe(
      (token) => { console.log('Token deleted!'); },
    );
	}
}
