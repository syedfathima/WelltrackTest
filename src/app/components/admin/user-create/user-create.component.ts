import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
} from "@angular/forms";
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { Organization } from '../../../models/organization';
import { User } from '../../../models/user';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { config } from '../../../../environments/all';

import * as _ from 'lodash';
import { UserService } from 'app/lib/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-edit',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UserCreateComponent implements OnInit {
  userCreateForm: FormGroup;
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
  passwordValidate: boolean = false;
  notificationOn: boolean;
  user: User;
  role: number;
  orgId: number = -1;
  status: string;
  lockRole: boolean;
  timezones:any;
  loggedUserDetails: User;


  constructor(
    public dialogRef: MatDialogRef<UserCreateComponent>,
	private formBuilder: FormBuilder,
    private api: ApiService,
    private log: LogService,
    private modalService: ModalService,
    private translate: TranslateService,
    private userService: UserService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.roles = [
      { 'id': 1, 'name': 'User' },
      { 'id': 2, 'name': 'Professional' },
      { 'id': 3, 'name': 'Executive' },
      { 'id': 4, 'name': 'Executive Professional' },
      { 'id': 5, 'name': 'Joint Professional' },
      { 'id': 6, 'name': 'RelationShip Manager' }
    ];

	this.userCreateForm = this.formBuilder.group({
		fullName: ["", [Validators.required]],
		email: ["", [Validators.required,  Validators.pattern(/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$/)]],
		status: [""],
		password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
		notificationOn: [false],
		orgId: ["-1"],
		timezone: [""],
		roleId: [""],
		lockedRole: [false],
	});

    this.user = new User;
    this.loggedUserDetails =  this.userService.getUser();
    if(this.router.url === '/admin/internal-user-listing'){
      this.roles = [
        { 'id': 2, 'name': 'Admin' },
        { 'id': 6, 'name': 'RelationShip Manager' }
      ];
    }

    this.user.roleId = 1;

    this.timezones = config.timezones;

  }

  ngOnInit() {
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
	return this.userCreateForm.controls;
  }

  onChangePassword() {
		let validate = this.validatePassword(this.password);
		if (validate) {
			this.passwordValidate = true;
		}
		else {
			this.passwordValidate = false;
		}
  }

	validatePassword(value) {
		let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
		var RegularExp = new RegExp(reg);
		if (RegularExp.test(value)) {
			this.passwordValidate = true;
			return true;
		}
		else {
			return false;
		}
	}

  doSave() {

    this.api.post('admin/usercreate',
      {
        Name:  this.userCreateForm.value.fullName, //this.user.fullName,
        Email: this.userCreateForm.value.email,
        RoleID: this.userCreateForm.value.roleId,
        Status: this.userCreateForm.value.status,
        OrgID: this.userCreateForm.value.orgId,
        NotificationOn: this.userCreateForm.value.notificationOn,
        lockedRole: this.userCreateForm.value.lockedRole,
		Timezone: this.userCreateForm.value.timezone
      }
    ).subscribe(
      (data: any) => {
        this.modalService.showAlert('Success', 'User was successfully created');
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
