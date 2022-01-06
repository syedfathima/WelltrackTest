import {
	Component,
	ViewChild,
	ViewEncapsulation,
	OnInit,
	Input,
	Output,
	EventEmitter,
	Inject,
} from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../lib/api.service";
import { LogService } from "../../lib/log.service";
import { ModalService } from "../../lib/modal.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PushNotification, PushNotificationRevision } from "../../models/push-notification";
import { UtilityService } from '../../lib/utility.service';
import { OrganizationService } from '../../lib/organization.service';
import { UserService } from '../../lib/user.service';
import { Organization } from '../../models/organization';
import { User } from '../../models/user';

import * as _ from 'lodash';
import * as moment from 'moment';

interface languageObj {
	prefix: string,
	full: string,
	active: boolean
}

@Component({
	selector: "app-scheduled-push-edit",
	templateUrl: "./scheduled-push-edit.component.html",
	styleUrls: ["./scheduled-push-edit.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class ScheduledPushEditComponent implements OnInit {
	pushEditForm: FormGroup;
	scheduledPushID: number;
	title: string;
	mode: string;
	isLoaded: boolean = false;
	pushNotification: PushNotification;
	orgIds: Array<number>;
	days_of_week: Array<string> = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	languages: Array<languageObj> = [
		{ prefix: "en", full: "English", active: false },
		{ prefix: "fr", full: "French", active: false },
		{ prefix: "es", full: "Spanish", active: false },
		{ prefix: "na", full: "Navajo", active: false },
	];
	organizations: Organization[];
	pushTypes: Array<Object>;
	pushTypeSelected: string;
	user: User;
	userOrg: Organization;
	@Output() listPushNotifications = new EventEmitter<any>();

	constructor(
		private translate: TranslateService,
		private formBuilder: FormBuilder,
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
		private utiliyService: UtilityService,
		private userService: UserService,
		private organizationService: OrganizationService,
		public dialogRef: MatDialogRef<ScheduledPushEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.scheduledPushID = data.data;
		this.user = this.userService.getUser();

		this.createPushEditForm(new PushNotification(null));

		if (this.scheduledPushID) {
			this.title = "Edit this Push Notification";
			this.mode = "update";
		} else {
			this.title = "Create a Push Notification";
			this.mode = "create";
			this.isLoaded = true;
		}

		this.pushTypes = [
			{
				type: "all",
				name: "All Organizations(s)",
			},
			{
				type: "organization",
				name: "Specific Organizations(s)",
			},
		];
	}

	get f() {
		return this.pushEditForm.controls;
	}

	ngOnInit() {
		if (this.scheduledPushID) {
			this.api
				.get("pushnotifications/" + this.scheduledPushID)
				.subscribe(
					(result: any) => {
						this.pushNotification = new PushNotification(
							result.data
						);

						this.createPushEditForm(this.pushNotification);
						// this.pushEditForm.patchValue({
						// 	revisions: this.pushNotification.revisions,
						// 	type: this.pushNotification.type,
						// 	orgIds: this.pushNotification.orgIds,
						// 	scheduledDate: this.pushNotification.scheduledDate,
						// 	recurring: this.pushNotification.recurring,
						// 	day: this.pushNotification.day,
						// 	time: this.pushNotification.time,
						// }
						// );
						this.isLoaded = true;
						this.makeLanguagesActive(this.pushNotification.revisions);
						// this.organization = new Organization(result.data, 'full');
					},
					(error: any) => {
						this.log.error(
							"Error getting push notification details. " +
							error.message
						);
					}
				);
			this.isLoaded = true;
		}
		else {
			//Revision will default to 'en'
			this.pushNotification = new PushNotification({});
			this.makeLanguagesActive(this.pushNotification.revisions);
		}

		if (this.user.userType === "admin") {
			this.api.get("admin/organizations").subscribe(
				(results: any) => {
					this.organizations = Organization.initializeArray(results.data);
				},
				(error: any) => {
					this.organizations = null;
				}
			);
		}

		if (this.user.userType === "orgadmin") {
			this.api.get(`organizations/associatedorgs/${this.user.organizations[0]?.id}`).subscribe(
				(results: any) => {
					this.organizations = Organization.initializeArray(results.data);
				},
				(error: any) => {
					this.organizations = null;
				}
			);
		}

		// this.organizations = this.organizationService.orgSelectorValues();
	}

	createPushEditForm(data: any) {

		const pushType = (data && data.orgIds ? (data.orgIds.length ? "organization" : "all") : "");
		const scheduledDate = data.scheduledDate? data.scheduledDate?.replace(' ','T') + "Z": undefined;
		this.pushEditForm = this.formBuilder.group({
			id: [data.id || null],
			revisions: this.formBuilder.array([]),
			type: [pushType, [this.user.userType === "admin" ? Validators.required : Validators.nullValidator]],
			orgIds: [data.orgIds || ""],
			scheduledDate: [new Date(scheduledDate), [Validators.nullValidator]],
			recurring: [data.recurring || false],
			day: [data.day || ""],
			time: [data.time || ""],
			status:  [data.status || 0],
			user:  [data.user || {}]
		});

		data?.revisions?.forEach((revision: any) => {
			this.addRevisionItem(revision);
		});

		if (!data || !data.revisions || data.revisions.length === 0) {
			this.addRevisionItem(new PushNotificationRevision());
		}

		this.pushEditForm.get("recurring").valueChanges.subscribe((val) => {
			if (val) {
				this.pushEditForm.controls["day"].setValidators([
					Validators.required,
				]);
				this.pushEditForm.controls["day"].updateValueAndValidity();
				this.pushEditForm.controls["time"].setValidators([
					Validators.required,
				]);
				this.pushEditForm.controls["time"].updateValueAndValidity();
			} else {
				this.pushEditForm.controls["day"].clearValidators();
				this.pushEditForm.controls["day"].updateValueAndValidity();
				this.pushEditForm.controls["time"].clearValidators();
				this.pushEditForm.controls["time"].updateValueAndValidity();
			}
		});
	}

	getRevisionFormGroup(index: number): FormGroup {
		const revisionsForm = this.pushEditForm.get("revisions") as FormArray;
		const formGroup = revisionsForm.controls[index] as FormGroup;
		return formGroup;
	}

	get revisionItems() {
		return this.pushEditForm.get("revisions") as FormArray;
	}

	addRevisionItem(revision: PushNotificationRevision) {
		const revisionList = this.pushEditForm.get('revisions') as FormArray;
		revisionList.push(this.createRevision(revision));
	}

	createRevision(data: any): FormGroup {
		return this.formBuilder.group({
			id: [data.id || null],
			title: [data.title || "", [Validators.required]],
			body: [data.body || "", [Validators.required]],
			url: [data.url || ""],
			languagePrefix: [data.languagePrefix || "en"],
		});
	}

	revisionExists(prefix: string) {
		const index = _.find(this.revisionItems, { languagePrefix: prefix })
		return index ? true : false;
	}

	makeLanguagesActive(revisions) {
		if (revisions.length > 0) {
			revisions.forEach(value => {
				const prefix: any = value.languagePrefix;
				let index = _.findIndex(this.languages, { 'prefix': prefix });
				if (index > -1) {
					this.languages[index]['active'] = true;
				}

			});
		}
		else {
			this.addRevision('en');
		}
	}

	doSave() {

		if (!this.pushEditForm.valid) {
			console.log(this.pushEditForm.errors);
			return;
		}

		this.pushNotification = new PushNotification(this.pushEditForm.value);

		if (this.user.userType === "orgadmin" && this.user.organizations.length) {
			this.pushNotification.orgIds.push(this.user.organizations[0].id)
			const mySet = new Set(this.pushNotification.orgIds);
			this.pushNotification.orgIds = [...mySet];
		}

		if (this.mode === "update") {
			this.api
				.put(
					"pushnotifications/" + this.scheduledPushID,
					PushNotification.forAPI(this.pushNotification),
					true
				)
				.subscribe(
					(data: any) => {
						this.modalService.showAlert(
							"Success",
							"Push notification has been updated"
						);
						this.pushNotification.organizations = this.organizations.filter((org) => this.pushNotification.orgIds.includes(org.id));
						this.dialogRef.close(this.pushNotification);
					},
					(error: any) => {
						this.modalService.showAlert(
							"Error",
							"Something went wrong. " + error.message
						);
					}
				);
		} else {
			this.api
				.post(
					"pushnotifications",
					PushNotification.forAPI(this.pushNotification),
					true
				)
				.subscribe(
					(data: any) => {
						this.modalService.showAlert(
							"Success",
							"Push notification has been created"
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
	}

	addRevision(prefix) {

		this.addRevisionItem(
			new PushNotificationRevision({
				Title: "",
				Body: "",
				Url: "",
				LanguagePrefix: prefix,
			})
		);
		let index = _.findIndex(this.languages, { 'prefix': prefix });
		this.languages[index]['active'] = true;
	}

	removeRevision(i) {
		//this.pushNotification.revisions.splice(i, 1);
		const revisionsForm = this.pushEditForm.get("revisions") as FormArray;
		const revision = revisionsForm.at(i);
		let index = _.findIndex(this.languages, { 'prefix': revision.value.languagePrefix });
		this.languages[index]['active'] = false;
		revisionsForm.removeAt(i);
	}

	onClose() {
		this.dialogRef.close();
	}
}
