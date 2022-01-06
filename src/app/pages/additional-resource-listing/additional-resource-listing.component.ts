import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../lib/api.service";
import { LogService } from "../../lib/log.service";
import { AdditionalResource } from "../../models/additional-resource";
import { AdditionalResourceEditComponent } from "../../components/admin/additional-resource-edit/additional-resource-edit.component";
import { ModalService } from "../../lib/modal.service";

import * as _ from "lodash";

@Component({
	selector: "app-additional-resource-listing",
	templateUrl: "./additional-resource-listing.component.html",
	styleUrls: ["./additional-resource-listing.component.scss"],
})
export class AdditionalResourceListingPage implements OnInit {
	additionalResources: AdditionalResource[] = [];

	constructor(
		private apiService: ApiService,
		private logService: LogService,
		private modalService: ModalService
	) {}

	ngOnInit(): void {
		this.additionalResources = AdditionalResource.initializeArray([
			{
				id: 1,
				title: "Additional Resource 1",
				description: "This is a sample resource",
				logo: "/assets/img/additional-resources/togetherall.svg",
				link: "https://app.welltrack.com/",
			},
			{
				id: 2,
				title: "Additional Resource 2",
				description: "This is a sample resource",
				logo: "/assets/img/circle_logo@2x.png",
				link: "https://app.welltrack.com/",
			},
		]);

		this.apiService.get("analytics/additionalresources").subscribe(
			(result: any) => {
				this.logService.debug(result);
				this.additionalResources = AdditionalResource.initializeArray(
					result
				);
			},
			(error: any) => {
				this.logService.error("Error fetching additional resources");
			}
		);
	}

	goToResource(link: string) {
		this.apiService
			.post("analytics/additionalresources", {
				link: link,
			})
			.subscribe(
				(result: any) => {
					window.open(link);
				},
				(error: any) => {
					this.logService.error("Error logging link click");
				}
			);
	}

	doCreate() {
		this.modalService.setCloseOnClickAway(false);
		this.modalService.showComponent(AdditionalResourceEditComponent, null);
	}

	onEdit(additionalResource: any) {
		this.modalService.setCloseOnClickAway(false);
		const modal = this.modalService.showComponent(
			AdditionalResourceEditComponent,
			additionalResource
		);

		modal.beforeClosed().subscribe((data:any) => {
			if(data){
				const index = this.additionalResources.findIndex((resource: AdditionalResource) => resource.id === additionalResource.id);
				if(index !== -1) {
					this.additionalResources[index] = {...this.additionalResources[index], ...data};
				}
			}
		});
	}

	onDelete(additionalResourceID: number) {
		this.modalService
			.showConfirmation(
				"Delete",
				"Are you sure you want to delete the additional resource?"
			)
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.apiService
						.delete(
							"analytics/additionalresources/" +
								additionalResourceID
						)
						.subscribe(
							(result: any) => {
								let index = _.findIndex(
									this.additionalResources,
									{ id: additionalResourceID }
								);
								this.additionalResources.splice(index, 1);
							},
							(error: any) => {
								this.logService.error("Error deleting.");
							}
						);
				}
			});
	}
}
