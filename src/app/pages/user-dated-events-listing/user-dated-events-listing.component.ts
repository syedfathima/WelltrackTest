import { Component, OnInit } from "@angular/core";
import { DatedEvent } from "../../models/dated-event";
import { ModalService } from "../../lib/modal.service";
import { ApiService } from "../../lib/api.service";
import { LogService } from "../../lib/log.service";

@Component({
	selector: "app-user-dated-events-listing",
	templateUrl: "user-dated-events-listing.component.html",
	styleUrls: ["./user-dated-events-listing.component.scss"],
})
export class UserDatedEventsListingPage implements OnInit {
	searchKey: string;
	datedEvents: DatedEvent[];
	isLoaded: boolean = false;
	filteredEvents: DatedEvent[];

	constructor(
		private api: ApiService,
		private modalService: ModalService,
		private log: LogService
	) {}

	ngOnInit() {
		// this.api.get("dated_events").subscribe(
		// 	(result: any) => {
		// 		this.datedEvents = DatedEvent.initializeArray(result.data);
		// 	},
		// 	(error: any) => {
		// 		this.log.error("Error getting dated events." + error.message);
		// 	}
		// );

		this.datedEvents = [
			new DatedEvent({
				id: 1,
				title: "Organization Event",
				description: "This is sample organization event",
				link: "http://www.testlink.com",
				image: "http://www.testimage.com",
				video: "http://www.testvideo.com",
			}),
			new DatedEvent({
				id: 2,
				title: "Test Event",
				description: "This is sample event",
				link: "http://www.testlink.com",
				image: "http://www.testimage.com",
				video: "http://www.testvideo.com",
			}),
		];
		this.filteredEvents = this.datedEvents;
		this.isLoaded = true;
	}

	onSearch() {
		this.filteredEvents = this.datedEvents.filter((datedEvent) => {
			return datedEvent.orgName
				.toLocaleLowerCase()
				.includes(this.searchKey.toLocaleLowerCase());
		});
	}
}
