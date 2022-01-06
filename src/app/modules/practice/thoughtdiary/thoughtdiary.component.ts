import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../../lib/user.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
	selector: 'page-thought-diary',
	templateUrl: 'thoughtdiary.component.html',
	styleUrls: ['./thoughtdiary.component.scss'],
})
export class ThoughtDiaryListingPage implements OnInit {
	user: User;
	isLoaded: boolean;
	backLink: string; 
	title: string;
	back: string;

	constructor(
		private userService: UserService,
		private translate: TranslateService 
	) {
		this.user = this.userService.getUser();
	
		this.backLink = '/app/practice';
		this.translate.stream('thoughtDiary').subscribe((res: any) => {
			this.title = res.title;
			this.back = res.back;
		});
	}

	ngOnInit() {
		
	}


	
}
