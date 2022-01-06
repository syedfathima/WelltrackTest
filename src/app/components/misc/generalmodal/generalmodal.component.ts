import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { DialogPreset } from 'ngx-modialog/plugins/vex';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
	selector: 'generalModalComponent',
	templateUrl: 'generalmodal.component.html',
	styleUrls: ['./generalmodal.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class GeneralModalComponent implements OnInit {

	innerhtml: string;
	title: string;
	value: boolean;
	constructor(
		public dialogRef: MatDialogRef<GeneralModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		let obj = data.data;
		this.innerhtml = obj.description;
		this.title = obj.title;
	}

	ngOnInit() {

	}

	onFinish() {
		//mark the tutorial as finished
		this.dialogRef.close();
	}
}
