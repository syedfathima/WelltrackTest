import { Component, ViewEncapsulation, OnInit, Input,Inject } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	FormArray,
	Validators,
} from "@angular/forms";
import { Organization } from '../../../models/organization';
import { Challenge } from '../../../models/challenge';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { config } from '../../../../environments/all';

import * as _ from 'lodash';
import * as moment from 'moment'

@Component({
  selector: 'challenges-edit',
  templateUrl: './challenges-edit.component.html',
  styleUrls: ['./challenges-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChallengesEditComponent implements OnInit {
  challengesEditForm: FormGroup;
  placeholders: any[];
  start: Date;
  end: Date;
  default: any;
  popups: any[];
  title: string;
  config: any;
  mode: string;
  organizations: Organization[];
  orgId: number = -1;
  isLoaded: boolean = false;
  ressourcesets: Array<Object> = [];
  emptyressourceset: Object = { 'title': '', 'description': '', 'url': '', 'category': '' };
  types: any = [{ 'id': 3, 'name': 'Single organization Team' }, { 'id': 2, 'name': 'Multiple Organization' }, { 'id': 1, 'name': 'Single org Single User' }];
  challengeCopy: any;
  emailCopy: any;
  timezones: any;
  submitButtonPressed: boolean = false;
  errors:string = "";

  @Input() challenge: Challenge;
  id: number;

  constructor(
    private translate: TranslateService,
	private formBuilder: FormBuilder,
    private api: ApiService,
    private log: LogService,
    private modalService: ModalService,
    public dialogRef: MatDialogRef<ChallengesEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router) {

    this.id = data.data;

    if (this.id) {
      this.title = 'Edit this Challenge';
      this.mode = 'update';
    }
    else {
      this.title = 'Create a Challenge';
      this.challenge = new Challenge();
      this.mode = 'create';
    }

	this.createChallengeEditForm(new Challenge());
	this.challengesEditForm.patchValue({orgId: -1});

    this.config = {
      toolbar: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList'] }
      ]
    };

    this.translate.stream('challenges').subscribe((res: any) => {
      this.challengeCopy = res;
      this.emailCopy = res.EmailCopy;
    });

    this.timezones = config.timezones;

  }

  get f() {
	return this.challengesEditForm.controls;
  }

  createChallengeEditForm(data: any){
	this.challengesEditForm = this.formBuilder.group({
		id: [data.id || null],
		type: [data.type || 1],
		challengeType: [data.challengeType || 1],
		start: [data.start || null, [Validators.required]],
		end: [data.end || null, [Validators.required]],
		name: [data.name || "", [Validators.required]],
		description: [data.description || "", [Validators.required]],
		rewards: [data.rewards || ""],
		subdomain: [data.subdomain || ""],
		code: [data.code || ""],
		displayActive: [data.displayActive || true],
		notifyUsers: [data.notifyUsers || true],
		notifyCounselors: [data.notifyCounselors || true],
		upcomingEmailUser: [data.upcomingEmailUser || ""],
		startEmailUser: [data.startEmailUser || ""],
		midEmailUser: [data.midEmailUser || ""],
		endEmailUser: [data.endEmailUser || ""],
		upcomingEmailCounselor: [data.upcomingEmailCounselor || ""],
		startEmailCounselor: [data.startEmailCounselor || ""],
		midEmailCounselor: [data.midEmailCounselor || ""],
		endEmailCounselor: [data.endEmailCounselor || ""],
		randomlyAssigned: [data.randomlyAssigned || false],
		orgId: [data.orgId || -1],
		timezone: [data.timezone || "", [Validators.required]],
		created: [data.created],
		teams: this.formBuilder.array([]),
	});

	data.teams?.forEach((team: any) => {
		this.addTeam(team);
	});
  }

  ngOnInit() {
    if (this.id) {
      this.api.get('challenges/' + this.id).subscribe(
        (result: any) => {
          this.challenge = new Challenge(result.data);
          this.log.debug('challenge');
          this.log.debug(this.challenge);
		  this.createChallengeEditForm(this.challenge);
        },
        (error: any) => {
          this.log.error('Error getting challenge. ' + error.message);
        });
    }
    else {
      this.challenge = new Challenge();
      //this.log.debug(this.challengeCopy);
      this.challenge.upcomingEmailUser = this.challengeCopy.emailCopy.upcomingEmailUserGeneral;
      this.challenge.upcomingEmailCounselor = this.challengeCopy.emailCopy.upcomingEmailCounselorGeneral;
      this.challenge.startEmailUser = this.challengeCopy.emailCopy.startEmailUserGeneral;
      this.challenge.startEmailCounselor = this.challengeCopy.emailCopy.startEmailCounselorGeneral;
      this.challenge.midEmailUser = this.challengeCopy.emailCopy.midEmailUserGeneral;
      this.challenge.midEmailCounselor = this.challengeCopy.emailCopy.midEmailCounselorGeneral;
      this.challenge.endEmailUser = this.challengeCopy.emailCopy.endEmailUserGeneral;
      this.challenge.endEmailCounselor = this.challengeCopy.emailCopy.endEmailCounselorGeneral;

	  this.challengesEditForm.patchValue({
		upcomingEmailUser: this.challengeCopy.emailCopy.upcomingEmailUserGeneral,
		upcomingEmailCounselor: this.challengeCopy.emailCopy.upcomingEmailCounselorGeneral,
		startEmailUser: this.challengeCopy.emailCopy.startEmailUserGeneral,
		startEmailCounselor: this.challengeCopy.emailCopy.startEmailCounselorGeneral,
		midEmailUser: this.challengeCopy.emailCopy.midEmailUserGeneral,
		midEmailCounselor: this.challengeCopy.emailCopy.midEmailCounselorGeneral,
		endEmailUser: this.challengeCopy.emailCopy.endEmailUserGeneral,
		endEmailCounselor: this.challengeCopy.emailCopy.endEmailCounselorGeneral,
	  })
    }


    this.api.get('admin/organizations', { Active: true }).subscribe(
      (results: any) => {
        this.organizations = Organization.initializeArray(results.data);
        this.isLoaded = true;
      },
      (error: any) => {

        this.log.error('Error loading. ' + error.message);
      }
    );

  }

  get teams() {
	return this.challengesEditForm.get("teams") as FormArray;
  }

  doSave() {
	this.challenge = new Challenge(this.challengesEditForm.value);
	this.submitButtonPressed = true;

	if(!this.challengesEditForm.valid){
		return;
	}

    if (this.mode === 'update') {
      this.api.put('challenges/' + this.challenge.id, Challenge.forApi(this.challenge)).subscribe(
        (data: any) => {
          this.modalService.showAlert('Success', 'Challenge has been updated');
          this.dialogRef.close(this.challenge);
        },
        (error: any) => {
          this.modalService.showAlert('Error', 'Something went wrong. Please try again');
        }
      );

    }
    else {
      this.api.post('challenges', Challenge.forApi(this.challenge)).subscribe(
        (data: any) => {
          this.modalService.showAlert('Success', 'Challenge has been created');
          this.dialogRef.close(this.challenge);
        },
        (error: any) => {
          this.modalService.showAlert('Error', 'Something went wrong. Please try again');
        }
      );

    }
  }

  changeType(event: Event) {
	if(this.challengesEditForm.value.type !== 3){
		this.challengesEditForm.patchValue({orgId: null});
	}
  }

  addTeam(data: any) {
	const teamsList = this.challengesEditForm.get('teams') as FormArray;

	if(data){
		teamsList.push(this.createTeamList(data));
	}
	else if (this.challengesEditForm.value.orgId != -1) {
	  teamsList.push(this.createTeamList({orgId: this.challengesEditForm.value.orgId}));
    }
    else {
      this.modalService.showAlert('Error', 'Please select an organization.');
    }
  }

  createTeamList(data: any): FormGroup {
	return this.formBuilder.group({
			id: [data.id || null],
			orgId: [data.orgId || -1],
			name: [data.name || ""],
			description: [data.description || ""],
			avg: [data.avg || 0],
			participants: [data.participants || 0],
			score: [data.score || 0],
		});
}

  addMultiTeam() {
    if (this.challengesEditForm.value.orgId != -1) {
      let index = this.organizations.findIndex((org: Organization) => { return org.id == this.challengesEditForm.value.orgId; });
      let organization = this.organizations[index];

      let addTeam = false;
	  const teamsList = this.challengesEditForm.get('teams') as FormArray;
      if (teamsList.length > 0) {
        // let teamIndex = this.challenge.teams.findIndex((team: any) => { return team.orgId == this.challenge.orgId; });
		let teamIndex = teamsList.value.findIndex((team: any) => { return team.orgId == this.challengesEditForm.value.orgId; });
        if (teamIndex === -1) {
          addTeam = true;
        }
        else {
          this.modalService.showAlert('Error', 'This organization already exists in your selected teams.');
        }
      }
      else {
	  	teamsList.push(this.createTeamList({orgId: organization.id, name: organization.name}));
      }
    }
    else {
      this.modalService.showAlert('Error', 'Please select an organization.');
    }
  }

  onRemove(i) {
    this.challenge.teams.splice(i, 1);

	const teamsList = this.challengesEditForm.get('teams') as FormArray;
	teamsList.removeAt(i);
  }

  onDateStart(data: any) {
	this.challengesEditForm.patchValue({
		start:  data.date
	});
  }

  onDateEnd(data: any) {
	this.challengesEditForm.patchValue({
		end: data.date
	});
  }

  onChange() {
	const teamsList = this.challengesEditForm.get('teams') as FormArray;
    if (this.challengesEditForm.value.type == 2 && teamsList && teamsList.length > 0) {
      this.modalService.showAlert('Warning', 'You already have teams associated for this challenge however you switched to a multi-organization challenge. You should delete all the teams and start again.');
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onTestEmails() {
	this.challenge = new Challenge(this.challengesEditForm.value);
    this.api.post('challenges/testemails', Challenge.forApi(this.challenge)).subscribe(
      (data: any) => {
        this.modalService.showAlert('Success', 'Challenge emails have been sent.');
      },
      (error: any) => {
        this.modalService.showAlert('Error', 'Something went wrong. Please try again');
      }
    );
  }

}
