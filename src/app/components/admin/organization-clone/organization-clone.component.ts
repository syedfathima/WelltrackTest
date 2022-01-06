import {
	Component,
	ViewChild,
	ViewEncapsulation,
	OnInit,
	Input,
	Inject,
} from "@angular/core";
import { Organization } from "../../../models/organization";
import { ApiService } from "../../../lib/api.service";
import { LogService } from "../../../lib/log.service";
import { ModalService } from "../../../lib/modal.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: "organization-clone",
	templateUrl: "./organization-clone.component.html",
	styleUrls: ["./organization-clone.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class OrganizationCloneComponent implements OnInit {
	organizations: Organization[];
	isLoaded: boolean = false;
	sourceOrgID: number;
	destOrgID: number;

	constructor(
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
		public dialogRef: MatDialogRef<OrganizationCloneComponent>
	) {}

	ngOnInit() {
		this.api.get("admin/organizations", { Active: true }).subscribe(
			(results: any) => {
				this.organizations = Organization.initializeArray(results.data);
				this.isLoaded = true;
			},
			(error: any) => {
				this.log.error("Error loading. " + error.message);
			}
		);
	}

	doSave() {
		var errors = "";

		if (!this.sourceOrgID) {
			errors += "Please select a source organization.<br>";
		}


		if (errors) {
			errors = "The following errors were found:<br>" + errors;
			this.modalService.showAlert("Error", errors);
			return;
		}

		this.api
			.post(
				`organizations/clone`,
				{orgId: this.sourceOrgID},
				true,
				false
			)
			.subscribe(
				(data: any) => {
					this.modalService.showAlert(
						"Success",
						"Organization resources have been cloned."
					);
					this.dialogRef.close();
				},
				(error: any) => {
					this.modalService.showAlert(
						"Error",
						"Something went wrong. " + error.message
					);
				}
			);
	}

	onClose() {
		this.dialogRef.close();
	}
}
