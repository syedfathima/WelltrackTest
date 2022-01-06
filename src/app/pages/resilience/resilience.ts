import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../app/models/user';
import { UserService } from '../../../app/lib/user.service';
import { Organization } from '../../../app/models/organization';

@Component({
	selector: 'app-resilience',
	templateUrl: './resilience.html',
	styleUrls: ['./resilience.scss'],
})

export class ResiliencePage implements OnInit {

	title = '';
	user: User;
	enableDisasterCourse: boolean;
	organization: Organization;
	access: any;
	loaded: boolean;

	constructor(
		private userService: UserService,
		private translate: TranslateService,
	) {

	}

	ngOnInit() {
		this.user = this.userService.getUser();
	}

	ionViewWillEnter() {
		this.translate.stream('theory').subscribe((res: any) => {
			this.title = res.title;
		});
	}

	onLoadListing(courseName) {
		
	}

}
