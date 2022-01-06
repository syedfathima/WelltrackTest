import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../lib/api.service";
import { ModalService } from "../../lib/modal.service";
import { LogService } from "../../lib/log.service";
import { Assessment } from "../../models/assessment-admin";
import { AssessmentEditComponent } from "../../components/admin/assessments-edit/assessments-edit.component";

@Component({
	selector: "assessments-listing.component",
	templateUrl: "assessments-listing.component.html",
	styleUrls: ["./assessments-listing.component.scss"],
})
export class AssessmentsListingPage implements OnInit {
	assessments: Assessment[] = [];
	isLoaded: boolean = false;

	constructor(
		private api: ApiService,
		private logService: LogService,
		private modalService: ModalService
	) {

	}

	ngOnInit() {
		this.api.get("assessment/listing").subscribe(
			(result: any) => {

				this.assessments = Assessment.initializeArray(result.data);
				this.isLoaded = true;
			},
			(error: any) => {
				this.logService.debug(
					"Error getting courses. " + error.message
				);
				this.isLoaded = true;
			}
		);
	}

	doCreate() {
		this.modalService.setCloseOnClickAway(false);
		this.modalService.showComponent(AssessmentEditComponent, null);
	}

	onEdit(assessmentId: number) {
		this.modalService.setCloseOnClickAway(false);
		const modal = this.modalService.showComponent(AssessmentEditComponent, assessmentId);

		modal.beforeClosed().subscribe((data:any) => {
			if(data){
				const index = this.assessments.findIndex((asmt: Assessment) => asmt.id === assessmentId);
				if(index !== -1) {
					this.assessments[index] = {...this.assessments[index], ...data};
				}
			}
		});
	}
}
