import { Component, Input } from '@angular/core';
import { StorageService } from '../../lib/storage.service';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';

@Component({
    selector: 'notice-component',
    styleUrls: ['./notice-component.scss'],
    templateUrl: 'notice-component.html'
})
export class NoticeComponent {

    verifySub: boolean; 
    show: boolean = true; 
    user: User; 

	constructor(
        private storage: StorageService,
        private userService: UserService
	) {
        this.user = this.userService.getUser(); 
    }
    
    onSetClose(){
        this.show = false; 
    }
}

