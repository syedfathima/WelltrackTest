import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { ApiService } from "../../lib/api.service";
import { LogService } from "../../lib/log.service";
import { ModalService } from "../../lib/modal.service";
import { StorageService } from "../../lib/storage.service";

@Component({
	selector: "feedback-form",
	templateUrl: "feedback-form.component.html",
	styleUrls: ["./feedback-form.component.scss"],
})
export class FeedbackFormComponent implements OnInit {
	feedbackForm: FormGroup;
	submitButtonPressed: boolean = false;
	DAY: number = 60 * 24;

	constructor(
		private formBuilder: FormBuilder,
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
		private storage: StorageService
	) {
		this.createFeedbackForm();
	}

	createFeedbackForm() {
		this.feedbackForm = this.formBuilder.group({
			helpful: ["", [Validators.required]],
			like: [""],
			didntLike: [""],
			comments: [""],
		});
	}

	get f() {
		return this.feedbackForm.controls;
	}

	ngOnInit() {}

	doSave() {
		console.log(this.feedbackForm.value);
		this.submitButtonPressed = true;

		if (!this.feedbackForm.valid) return;

		this.api.post("feedback", this.feedbackForm.value, true).subscribe(
			(data: any) => {
				this.modalService.showAlert(
					"Success",
					"Feedback has been updated"
				);
				this.createFeedbackForm();
				this.submitButtonPressed = false;
				this.storage.set("feedbackSubmitted", true, false, 30 * this.DAY);
			},
			(error: any) => {
				this.modalService.showAlert(
					"Error",
					"Something went wrong. " + error.message
				);
			}
		);
	}
}
