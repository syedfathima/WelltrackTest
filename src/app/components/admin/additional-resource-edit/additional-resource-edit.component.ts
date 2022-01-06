import {
	Component,
	ViewChild,
	ViewEncapsulation,
	OnInit,
	Input,
	Inject,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../../lib/api.service";
import { LogService } from "../../../lib/log.service";
import { ModalService } from "../../../lib/modal.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdditionalResource } from "../../../models/additional-resource";

@Component({
	selector: "app-additional-resource-edit",
	templateUrl: "./additional-resource-edit.component.html",
	styleUrls: ["./additional-resource-edit.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class AdditionalResourceEditComponent implements OnInit {
	@ViewChild("input") fileInput: any;
	additionalResourceForm: FormGroup;
	additionalResource: AdditionalResource;
	title: string;
	mode: string;

	constructor(
		private formBuilder: FormBuilder,
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
		public dialogRef: MatDialogRef<AdditionalResourceEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.additionalResourceForm = this.formBuilder.group({
			title: ["", [Validators.required]],
			description: [""],
			logo: [""],
			link: [""],
		});

		this.additionalResource = data.data;
		if (this.additionalResource) {
			this.title = "Edit this Additional Resource";
			this.mode = "update";
		} else {
			this.additionalResource = new AdditionalResource({});
			this.title = "Create an Additional Resource";
			this.mode = "create";
		}
	}

	ngOnInit() {}

	get f() {
		return this.additionalResourceForm.controls;
	}

	changeListener($event): void {
		this.readThis($event.target);
	}

	readThis(inputValue: any): void {
		var file: File = inputValue.files[0];
		inputValue.files[0];
		let fileName = inputValue.files[0].name;
		var reader: FileReader = new FileReader();

		if (/\.(gif|jpg|jpeg|png)$/i.test(fileName)) {
			reader.onloadend = (e) => {
				this.additionalResource.logoUpload = reader.result;
				this.additionalResource.logo = fileName;
			};
		} else {
			this.fileInput.nativeElement.value = "";
			this.modalService.showAlert(
				"Error",
				"The extension is invalid. Are you sure this is an image?  Are you really really sure?"
			);
		}

		reader.readAsDataURL(file);
	}

	doSave() {
		if (!this.additionalResourceForm.value.title) {
			this.modalService.showAlert(
				"Error",
				"The additional resource needs a title"
			);
			return;
		}

		this.additionalResource.title = this.additionalResourceForm.value.title;
		this.additionalResource.description = this.additionalResourceForm.value.description;
		this.additionalResource.link = this.additionalResourceForm.value.link;

		if (this.mode === "update") {
			this.api
				.put(
					"analytics/additionalresources/" +
						this.additionalResource.id,
					this.additionalResource
				)
				.subscribe(
					(data: any) => {
						this.modalService.showAlert(
							"Success",
							"Additional resource has been updated"
						);
						this.dialogRef.close(this.additionalResourceForm.value);
					},
					(error: any) => {
						this.modalService.showAlert(
							"Error",
							"Something went wrong. Please try again"
						);
					}
				);
		} else {
			this.api
				.post("analytics/additionalresources", this.additionalResource)
				.subscribe(
					(data: any) => {
						this.modalService.showAlert(
							"Success",
							"Additional resource has been created"
						);
						this.dialogRef.close();
					},
					(error: any) => {
						this.modalService.showAlert(
							"Error",
							"Something went wrong. Please try again"
						);
					}
				);
		}
	}

	onClose() {
		this.dialogRef.close();
	}
}
