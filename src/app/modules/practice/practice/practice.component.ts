import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../lib/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  user: User; 
  hideNotes: boolean = false; 
  
  constructor(
    private userService: UserService
  ) {

   }

  ngOnInit() {
    this.user = this.userService.getUser();
    if(this.user.primaryOrganization && this.user.primaryOrganization.settings && this.user.primaryOrganization.settings.hideNotes !== null){
			this.hideNotes = this.user.primaryOrganization.settings.hideNotes;
		}
  }

}
