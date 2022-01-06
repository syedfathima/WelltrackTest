import { Component, Input } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';

@Component({
	selector: 'screen-header',
	templateUrl: 'screen-header.html',
	styleUrls: ['./screen-header.scss']
})
export class ScreenHeader {

	user: User;
	avatarUrl: string;

	@Input() id: string;

	constructor(private userService: UserService) {
		this.user = userService.getUser();
		this.updateAvatar();

		this.userService.watcher.subscribe((user: User) => {
			this.user = user;
			this.updateAvatar();
		});
	}

	updateAvatar() {
		this.avatarUrl = this.user.getAvatarUrl();
		
	}

}
