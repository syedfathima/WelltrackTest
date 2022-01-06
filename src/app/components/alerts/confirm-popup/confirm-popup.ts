import { Component, ViewEncapsulation, Inject} from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { DialogPreset } from 'ngx-modialog/plugins/vex';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
	selector: 'confirm--popup',
	templateUrl: './confirm-popup.html',
	styleUrls: ['./confirm-popup.scss'],
	encapsulation: ViewEncapsulation.None
  })

  export class ConfirmPopup {
	title: string;
	message: string;
	okTxt: string;
	cancelTxt: string;

	constructor(
	  public dialogRef: MatDialogRef<ConfirmPopup>,
	  @Inject(MAT_DIALOG_DATA) public data: any) {
		  this.title = data.title;
		  this.message = data.message;
	  }

	onNoClick(): void {
	  this.dialogRef.close();
	}

  }
