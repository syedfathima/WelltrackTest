import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';

import { UserService } from '../../../lib/user.service';
import { FunAchievement } from '../../../models/fun-achievement';
import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'app-fun-achievement-listing',
	templateUrl: './fun-achievement-listing.component.html',
	styleUrls: ['./fun-achievement-listing.component.scss']
})
export class FunAchievementListingPage implements OnInit {

	funachievements: Array<FunAchievement> = [];
	isLoaded: boolean;
	headerText: string;
	backText: string;
	user: User;

	constructor(
		private userService: UserService,
		private translate: TranslateService
	) {
		this.isLoaded = false;
		this.user = this.userService.getUser(); 
	}

	ngOnInit() {
		this.translate.stream('fa').subscribe((res: any) => {
			this.headerText = res.title;
			this.backText = res.back;
		});

	}

	loadMore() {


	}



}
