import { Component, OnInit } from '@angular/core';
import { UserService } from '../../lib/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessments.html',
  styleUrls: ['./assessments.scss']
})
export class AssessmentsPage implements OnInit {
  user: User; 
  hideNotes: boolean = false; 
  
  constructor(
    private userService: UserService
  ) {

   }

  ngOnInit() {
    this.user = this.userService.getUser();
  
  }

}
