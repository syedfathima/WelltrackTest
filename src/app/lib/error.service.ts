import { Injectable, OnInit } from '@angular/core';
import { StorageService } from './storage.service';
import { ModalService } from './modal.service';
import { ErrorPopup } from '../components/alerts/error-popup/error-popup';
import { TranslateService } from '@ngx-translate/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Injectable()
export class ErrorService implements OnInit {
	ok: string;

	constructor(
		public dialog: MatDialog,
		private storage: StorageService, 
		private modal: ModalService, 
		private translate: TranslateService) {
		this.ok = '';
	}

	ngOnInit() {
	}

	showAlert(title, message){
		const dialogRef = this.dialog.open(ErrorPopup, {
			//width: '250px',
			data: {title: title, message: message}
		  });
	  
		  dialogRef.afterClosed().subscribe(result => {

		  });
	}

}
