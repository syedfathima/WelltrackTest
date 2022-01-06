import { Component, OnInit } from '@angular/core';
import { User } from '../../../app/models/user';
import { UserService } from '../../../app/lib/user.service';
import { LogService } from '../../../app/lib/log.service';
import { ModalService } from '../../lib/modal.service';


declare var window;

@Component({
	selector: 'page-emergency-menu',
	templateUrl: 'emergency-contact.html',
	styleUrls: ['./emergency-contact.scss']
})
export class EmergencyContactPage implements OnInit {

	user: User;

	constructor(
		private userService: UserService, 
		private log: LogService, 
		private modalService: ModalService
		) {
		this.user = this.userService.getUser();
	}

	ngOnInit() {
		this.log.screen('Emergency Help');
		this.log.event('emergency_help');	


	}

	


}
