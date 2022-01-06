import {
	Component,
	ViewChild,
	ViewEncapsulation,
	OnInit,
	Input,
	Inject,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: "app-alert-dialog",
	templateUrl: "./alert-dialog.component.html",
	styleUrls: ["./alert-dialog.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class AlertDialog implements OnInit {
	title: string;
    content: string;

	constructor(
		private translate: TranslateService,
		public dialogRef: MatDialogRef<AlertDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
        this.title = data.data.title;
        this.content = data.data.content;
    }

	ngOnInit() {}
}
