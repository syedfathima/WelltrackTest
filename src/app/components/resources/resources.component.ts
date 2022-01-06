import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { DialogPreset } from 'ngx-modialog/plugins/vex';
import { ApiService } from '../../lib/api.service';
import { LogService } from '../../lib/log.service';
import { Organization } from '../../models/organization';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
	selector: 'resources-component',
	templateUrl: 'resources.component.html',
	styleUrls: ['./resources.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ResourcesComponent implements OnInit {

	innerhtml: string;
	title: string;
	value: boolean;
	organization: Organization;
	resource: any;
	question: any;

	constructor(
		private api: ApiService,
		private log: LogService,
		private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ResourcesComponent>,
	) {
		let obj = data.data;
		this.resource = obj;

	}

	ngOnInit() {

	}

	onFinish() {
		//mark the tutorial as finished
		this.dialogRef.close();
	}


	onResourceClick(contact) {
		window.open(contact.website, "_blank");
		this.api.post('analytics/resourceclick', {
			resourceGroup: contact
		}).subscribe(
			(result: any) => {
			},
			(error: any) => {
				this.log.error('Error logging link click');
			}
		);
	}

	onResourceInternalClick(contact) {
		this.api.post('analytics/resourceclick', {
			resourceGroup: contact
		}).subscribe(
			(result: any) => {
				this.router.navigateByUrl(contact.internal);
				this.dialogRef.close();
			},
			(error: any) => {
				this.log.error('Error logging link click');
			}
		);
	}


}
