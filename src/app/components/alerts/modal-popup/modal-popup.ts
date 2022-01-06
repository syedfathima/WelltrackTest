import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { DialogPreset } from 'ngx-modialog/plugins/vex';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
	selector: 'modal-popup',
	templateUrl: './modal-popup.html',
	styleUrls: ['./modal-popup.scss'],
	encapsulation: ViewEncapsulation.None
})

export class ModalPopup {
	title: string;
	message: string;

	constructor(
		public dialogRef: MatDialogRef<ModalPopup>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.title = data.title;
		this.message = data.message;
	}

	onClose(): void {
		this.dialogRef.close();
	}

}
