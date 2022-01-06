import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
} from "@angular/forms";
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { DialogPreset } from 'ngx-modialog/plugins/vex';
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { Organization } from '../../../models/organization';
import { User } from '../../../models/user';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { config } from '../../../../environments/all';

import * as _ from 'lodash';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UserEditComponent implements OnInit {
  userEditForm: FormGroup;
  isloaded = false;
  roles: Array<Object> = [];
  organizations: Organization[];
  inputs: string[];
  errorPopup: any;
  successPopup: any;
  emptyPopup: any;
  tosPopup: any;
  fullName: string;
  email: string;
  password: string;
  notificationOn: boolean;
  user: User;
  role: number;
  orgId: number;
  status: string;
  lockRole: boolean;
  timezones: any;

  constructor(
    public dialogRef: MatDialogRef<UserEditComponent>,
	private formBuilder: FormBuilder,
    private api: ApiService,
    private log: LogService,
    private modalService: ModalService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.roles = [
      { 'id': 1, 'name': 'User' },
      { 'id': 2, 'name': 'Professional' },
      { 'id': 3, 'name': 'Executive' },
      { 'id': 4, 'name': 'Executive Professional' },
      { 'id': 5, 'name': 'Joint Professional' }
    ];

	this.userEditForm = this.formBuilder.group({
		fullName: ["", [Validators.required]],
		email: ["", [Validators.required,  Validators.pattern(/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$/)]],
		status: [""],
		notificationOn: [false],
		orgId: ["-1"],
		timezone: [""],
		roleId: [""],
		lockedRole: [false],
	});

    this.timezones = config.timezones;
  }

  ngOnInit() {

    let userId = this.data.data;
    this.api.get('users/' + userId, {
    }).subscribe(
      (result: any) => {
        this.user = new User(result.data);
        if (this.user.primaryOrganization) {
          this.orgId = this.user.primaryOrganization.id;
        }

		this.userEditForm.patchValue({
			fullName: this.user.fullName,
			email: this.user.email,
			status: this.user.status,
			notificationOn: this.user.preferences.notificationOn,
			orgId: this.user.organizations[0]?.id,
			timezone: this.user.preferences.timezone,
			roleId: this.user.roleId,
			lockedRole: this.user.lockedRole
		});

        this.isloaded = true;
      },
      (error: any) => {
        this.log.error('Error fetching user. ' + error.message);
      }
    );


    this.translate.stream('signUp').subscribe((res: any) => {

      this.inputs = res.inputs;
      this.errorPopup = res.errorPopup;
      this.successPopup = res.successPopup;
      this.emptyPopup = res.emptyPopup;
      this.tosPopup = res.tosPopup;
    });

    this.api.get('admin/organizations').subscribe(
      (results: any) => {
        this.organizations = Organization.initializeArray(results.data);
        this.isloaded = true;
      },
      (error: any) => {

        this.log.error('Error loading. ' + error.message);
      }
    );
  }

  get f() {
	return this.userEditForm.controls;
  }

  doSave() {

    this.api.put('admin/usersave/' + this.user.id,
      {
		Name:  this.userEditForm.value.fullName, //this.user.fullName,
        Email: this.userEditForm.value.email,
        RoleID: this.userEditForm.value.roleId,
        Status: this.userEditForm.value.status,
        OrgID: this.userEditForm.value.orgId,
        NotificationOn: this.userEditForm.value.notificationOn,
        lockedRole: this.userEditForm.value.lockedRole,
		Timezone: this.userEditForm.value.timezone,
        // Name: this.user.fullName,
        // Email: this.user.email,
        // RoleID: this.user.roleId,
        // Status: this.user.status,
        // OrgID: this.orgId,
        // lockedRole: this.user.lockedRole,
		// Timezone: this.user.preferences.timezone
      }
    ).subscribe(
      (data: any) => {
        this.modalService.showAlert('Success', 'User was successfully updated');
        this.dialogRef.close();
      },
      (error: any) => {
        this.modalService.showAlert('Error', error.message);
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }
}
