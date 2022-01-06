import { Component, ViewEncapsulation, OnInit, Inject, Input } from '@angular/core';
import { ModalService } from '../../../lib/modal.service';
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { User } from '../../../models/user';
import { Organization } from '../../../models/organization';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import * as _ from 'lodash';

@Component({
  selector: 'create-demo-user-component',
  templateUrl: './create-demo-user.component.html',
  styleUrls: ['./create-demo-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CreateDemoUser implements OnInit {

  organization: Organization;
  user: User;
  randomStr: string;
  emailInvitation: string;

  constructor(
    public dialogRef: MatDialogRef<CreateDemoUser>,
    private modalService: ModalService,
    private apiService: ApiService,
    private logService: LogService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.organization = data.data;
  }

  ngOnInit() {
    this.user = new User;
  }

  onChangeFullName() {
    this.user.email = this.user.fullName.replace(' ', '') + '@welltrackdemo.com';
  }

  onCreate() {
    this.apiService.post('admin/createdemouser',
      {
        user: this.user,
        orgId: this.organization.id,
        emailInvitation: this.emailInvitation
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


}
