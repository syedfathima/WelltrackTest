import { Component, ViewChild, ViewEncapsulation, OnInit, Inject, Input } from '@angular/core';
import { ModalService } from '../../../lib/modal.service';
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import * as _ from 'lodash';

@Component({
  selector: 'org-auth-component',
  templateUrl: './org-auth.component.html',
  styleUrls: ['./org-auth.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class OrgAuthComponent implements OnInit {
  isloaded = false;

  orgAuth: any;
  fields: any;

  constructor(
    public dialogRef: MatDialogRef<OrgAuthComponent>,
    private modalService: ModalService,
    private apiService: ApiService,
    private logService: LogService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.orgAuth = this.data.data;
  }

  doSave() {

    this.apiService.post('admin/orgauthsave', { orgAuth: this.orgAuth }).subscribe(
      (result: any) => {
        this.modalService.showAlert('Success', 'The authorization configuration has been saved.');
        this.dialogRef.close();
      },
      (error: any) => {
        this.logService.error('Error saving configuration. ' + error.message);
      }
    );
  }


  addField() {
    this.orgAuth.Settings.sp.attributeConsumingService.requestedAttributes.push(
      {
        "name": "",
        "isRequired": false,
        "nameFormat": "",
        "friendlyName": "",
        "attributeValue": ""
      }
    );
  }

  onRemove(i){
    this.orgAuth.Settings.sp.attributeConsumingService.requestedAttributes.splice(i,1);
  }

  removeField(i) {
    this.fields.splice(i, 1);
  }


}
