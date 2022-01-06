import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-add-zoom',
  templateUrl: './user-add-zoom.component.html',
  styleUrls: ['./user-add-zoom.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UserAddZoomComponent implements OnInit {
  isloaded = false;
  email: string;

  constructor(
    public dialogRef: MatDialogRef<UserAddZoomComponent>,
    private api: ApiService,
    private log: LogService,
    private modalService: ModalService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
 
  }

  doSave() {

    this.api.post('zoom/user',
      {
       email: this.email
      }
    ).subscribe(
      (data: any) => {
        this.modalService.showAlert('Success', 'User was added to zoom successfully. User will need to activate their zoom account through email.');
        this.dialogRef.close();
      },
      (error: any) => {
        this.modalService.showAlert('Error', error.message);
      }
    );
  }

}
