import { Component, Input } from '@angular/core';
import { StorageService } from '../../lib/storage.service';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';

@Component({
    selector: 'challenge-notifications',
    templateUrl: 'challenge-notifications-component.html',
    styleUrls: ['./challenge-notifications-component.scss'],
})
export class ChallengeNotificationsComponent {

    show: boolean = true;
    showPageIndicator: string;
    user: User;

    constructor(
        private storage: StorageService,
        private userService: UserService
    ) {
        this.user = this.userService.getUser();
        this.showPageIndicator = (this.user.activeChallenges.length > 1 ? "true" : "false");
    }

    onSetClose() {
        this.show = false;
    }

    onHideNotification() {
        this.show = false;
        this.storage.set("challenge_notification", true);
    }

    onChallengeDetails() {
  
    }
}

