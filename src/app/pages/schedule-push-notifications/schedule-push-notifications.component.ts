import { Component, OnInit } from "@angular/core";
import { PushNotification } from "../../models/push-notification";
import { ApiService } from "../../lib/api.service";
import { ModalService } from "../../lib/modal.service";
import { LogService } from "../../lib/log.service";
import { ScheduledPushEditComponent } from "../../components/scheduled-push-edit/scheduled-push-edit.component";
import { UserService } from "../../lib/user.service";

@Component({
	selector: "app-schedule-push-notifications",
	templateUrl: "./schedule-push-notifications.component.html",
	styleUrls: ["./schedule-push-notifications.component.scss"],
})
export class SchedulePushNotificationPage implements OnInit {
	isLoaded: boolean = false;
	pushNotifications: PushNotification[] = [];
	userRole: string;

	public constructor(
		private api: ApiService,
		private modalService: ModalService,
		private logService: LogService,
		private userService: UserService
	) { }

	ngOnInit() {
		this.userRole = this.userService.getUser()?.userType;
		this.onListing();
	}

	onListing() {
		this.api.get("pushnotifications").subscribe(
			(result: any) => {
				const pns = result.data;
				this.pushNotifications = PushNotification.initializeArray(
					result.data
				);
				this.isLoaded = true;
			},
			(error: any) => {
				this.logService.debug(
					"Error getting push notifications. " + error.message
				);
				this.isLoaded = true;
			}
		);
	}

	convertDateToLocal(date) {
		const sUtcDate = date && date !== '' ? date?.replace(' ', 'T') + "Z" : undefined;
		return new Date(sUtcDate);
	}

	get notificationCount() {
		return this.pushNotifications.filter((pn) => pn.status === 1).length;
	}

	get approvalCount() {
		return this.pushNotifications.filter((pn) => pn.status === 0).length;
	}

	get rejectedCount() {
		return this.pushNotifications.filter((pn) => pn.status === 2).length;
	}

	doCreate() {
		this.modalService.setCloseOnClickAway(false);
		this.modalService.showComponent(ScheduledPushEditComponent, null).afterClosed().subscribe(data => {
			this.onListing();
		});
	}

	onEdit(id) {
		this.modalService.setCloseOnClickAway(false);
		const modal = this.modalService.showComponent(ScheduledPushEditComponent, id);

		modal.beforeClosed().subscribe((data: any) => {
			if (data) {
				const index = this.pushNotifications.findIndex((notification: PushNotification) => notification.id === id);
				if (index !== -1) {
					this.pushNotifications[index] = new PushNotification({ ...this.pushNotifications[index], ...data });
				}
			}
		});
	}

	onDelete(id) {
		this.modalService
			.showConfirmation(
				"Delete",
				"Are you sure you want to delete your push notification?"
			)
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.api
						.delete("pushnotifications/" + id)
						.subscribe(
							(result: any) => {
								// let index = _.findIndex(this.pushNotifications, { id });
								let index = this.pushNotifications.findIndex(
									(item) => item.id === id
								);
								this.pushNotifications.splice(index, 1);
							},
							(error: any) => {
								this.logService.error("Error deleting.");
							}
						);
				}
			});
	}

	approve(id: number) {
		this.api
			.put("pushnotifications/approve/" + id, {})
			.subscribe(
				(result: any) => {
					let index = this.pushNotifications.findIndex(
						(item) => item.id === id
					);
					this.pushNotifications[index].status = 1;
				},
				(error: any) => {
					this.logService.error("Error approving push notification.");
				}
			);
	}

	reject(id: number) {
		this.api
			.put("pushnotifications/reject/" + id, {})
			.subscribe(
				(result: any) => {
					let index = this.pushNotifications.findIndex(
						(item) => item.id === id
					);
					this.pushNotifications[index].status = 2;
				},
				(error: any) => {
					this.logService.error("Error approving push notification.");
				}
			);
	}
}
