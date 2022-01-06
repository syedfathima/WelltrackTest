import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { ModalService } from '../../lib/modal.service';
import { LogService } from '../../lib/log.service';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { DialogPreset } from 'ngx-modialog/plugins/vex';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
	FormGroup,
	FormBuilder,
	Validators,
} from "@angular/forms";
import { UtilityService } from "../../lib/utility.service";

@Component({
	selector: 'page-invite',
	templateUrl: 'invite.html',
	styleUrls: ['./invite.scss'],
	encapsulation: ViewEncapsulation.None
})
export class Invite implements OnInit {
	type: string;
	message: string = '';
	email: string;
	success: boolean = false;
	share: boolean = false;
	showShare: boolean = true;
	user: User;
	orgID: number;
	popup: any;
	isAdmin = false;
	endpoint = '';
	options = [];
	admin: boolean = false;
	admintitle: string;
	userShare: boolean;
	subscribe: boolean;
	response: string;
	emailValidate: boolean;
	inviteForm: FormGroup;

	constructor(
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
		private userService: UserService,
		public dialogRef: MatDialogRef<Invite>,
		private translate: TranslateService,
		private formBuilder: FormBuilder,
		private utility: UtilityService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.user = this.userService.getUser();

		let inviteParams = data.data;
		this.type = inviteParams.type;
		this.orgID = inviteParams.orgId;
		this.endpoint = inviteParams.endpoint;
		if (inviteParams.forceShare) {
			this.share = true;
			this.showShare = false;
		}

		if (this.type === 'admin') {
			if (this.endpoint === 'userinvite') {
				this.admintitle = ' user';
			} else if (this.endpoint === 'adminprofessional') {
				this.admintitle = ' professional';
			}
			else if (this.endpoint === 'adminjointprofessional') {
				this.admintitle = ' joint professional';
			}
			else if (this.endpoint === 'adminexecutive') {
				this.admintitle = 'n executive';
			}
			else if (this.endpoint === 'adminexecutiveprofessional') {
				this.admintitle = 'n executive professional';
			}
		}
		else if (this.type == 'professional') {
			this.subscribe = inviteParams.subscribe;
		}
		else if (this.type == 'user') {
			this.admintitle = ' counselor';
		}
		else {
			this.admintitle = '';
		}


		this.createInviteForm();
		this.userShare = this.user.permissions.userShare;
	}

	createInviteForm() {
		this.inviteForm = this.formBuilder.group({
			email: ["", [Validators.required, Validators.pattern(this.utility.emailValidationPattern())]],
			message: [""],
			orgID: [""],
			share: [""],
		});
	}

	ngOnInit() {
		this.translate.stream('invite').subscribe((res: any) => {
			this.popup = res.popups;
			this.options = res.admin.types;
		})
	}

	get f() {
		return this.inviteForm.controls;
	}

	sendInvite() {
		// if (!this.email) {
		// 	this.modalService.showAlert(this.popup.error, this.popup.blank);
		// 	return;
		// }

		if (this.inviteForm.invalid) {
			return
		}

		this.api.post('invitations/' + this.endpoint, {
			Email: this.inviteForm.value.email,
			Message: this.inviteForm.value.message,
			OrgID: this.orgID,
			Share: this.share
		}).subscribe(
			(result: any) => {
				this.success = true;
				this.response = result.message;
			},
			(error: any) => {
				this.modalService.showAlert(this.popup.error, error.message);
				this.log.error('Error fetching user. ' + error.message);
			}
		);
	}

	close() {
		this.dialogRef.close();
		this.success = false;
	}
}
