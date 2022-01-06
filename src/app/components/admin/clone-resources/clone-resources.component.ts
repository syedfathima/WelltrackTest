import {
	Component,
	ViewEncapsulation,
	OnInit,
} from "@angular/core";
import {
	FormGroup,
	FormBuilder,
	Validators,
} from "@angular/forms";
import { Organization } from "../../../models/organization";
import { ApiService } from "../../../lib/api.service";
import { LogService } from "../../../lib/log.service";
import { ModalService } from "../../../lib/modal.service";

@Component({
	selector: "app-clone-resources",
	templateUrl: "./clone-resources.component.html",
	styleUrls: ["./clone-resources.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class CloneResourcesComponent implements OnInit {
	cloneResourceForm: FormGroup;
	organizations: Organization[];
	isLoaded: boolean = false;
	sourceOrgID: number;
	destOrgID: number;

	constructor(
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
		private formBuilder: FormBuilder,
	) {
		this.cloneResourceForm = this.formBuilder.group({
			sourceOrgID: ["", [Validators.required]],
			destOrgID: ["", [Validators.required]],
		});
	}

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

	get f() {
		return this.cloneResourceForm.controls;
	}

	doSave() {
		var errors = "";

		if (!this.cloneResourceForm.value.sourceOrgID) {
			errors += "Please select a source organization.<br>";
		}

		if (!this.cloneResourceForm.value.destOrgID) {
			errors += "Please select a destination organization.<br>";
		}

		if (errors) {
			errors = "The following errors were found:<br>" + errors;
			this.modalService.showAlert("Error", errors);
			return;
		}

		this.api
			.post(
				`resources/clone?originOrgId=${this.cloneResourceForm.value.sourceOrgID}&destinationOrgId=${this.cloneResourceForm.value.destOrgID}`,
				{},
				true,
				false
			)
			.subscribe(
				(data: any) => {
					this.modalService.showAlert(
						"Success",
						"Organization resources have been cloned."
					);
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
	}
}
