import { Component, ViewChild, ViewEncapsulation, OnInit,Inject } from '@angular/core';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { DialogPreset } from 'ngx-modialog/plugins/vex';
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { Organization } from '../../../models/organization';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-access-code',
  templateUrl: './access-code.component.html',
  styleUrls: ['./access-code.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccessCodeComponent implements OnInit {
  accesscode: string;
  organization: Organization;

  constructor(
    public dialogRef: MatDialogRef<AccessCodeComponent>,
    private api: ApiService,
    private logService: LogService,
    private modalService: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {

    this.organization = data.data;
  }

  ngOnInit() {

  }

  doSave() {
    if (!this.accesscode) {
      this.modalService.showAlert('Error', 'Please type in an access code.');
      return;
    }

    this.api.post('admin/accesscodecreate', {
      Code: this.accesscode,
      OrgID: this.organization.id
    }).subscribe(
      (data: any) => {
        this.modalService.showAlert('Success', 'Access code has been created');
        this.dialogRef.close();
      },
      (error: any) => {
        this.logService.debug(error);
        this.modalService.showAlert('Error', error.message);
      }
      );
  }

}
