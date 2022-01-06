import { Component, ViewEncapsulation, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'error-popup',
	templateUrl: './error-popup.html',
	styleUrls: ['./error-popup.scss'],
	encapsulation: ViewEncapsulation.None
  })

  export class ErrorPopup {
	title: string; 
	message: string; 

	constructor(
	  public dialogRef: MatDialogRef<ErrorPopup>,
	  @Inject(MAT_DIALOG_DATA) public data: any) {
		  this.title = data.title; 
		  this.message = data.message; 
	  }
  
	onNoClick(): void {
	  this.dialogRef.close();
	}
  
  }