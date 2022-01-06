import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	FormArray,
	Validators,
} from "@angular/forms";
import { UserService } from '../../lib/user.service';
import { User } from '../../models/user';
import { ApiService } from '../../lib/api.service';
import { LogService } from '../../lib/log.service';
import { StorageService } from '../../lib/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalService} from '../../lib/modal.service';

@Component({
	selector: 'page-support',
	templateUrl: 'support.html',
	styleUrls: ['./support.scss']
})
export class SupportComponent implements OnInit {
	supportForm: FormGroup;
	user: User;
	popups: any;
	submitButtonPressed: boolean = false;
	errors:string = "";


	constructor(
		private dialogRef: MatDialogRef<SupportComponent>,
		private formBuilder: FormBuilder,
		private modalService: ModalService,
		private api: ApiService,
		private storage: StorageService,
		private log: LogService,
		private userService: UserService,
		private translate: TranslateService) {

		this.user = this.userService.getUser();
		this.createSupportForm();
	}

	get f() {
		return this.supportForm.controls;
	}

	createSupportForm(){
		if(this.user){
			this.supportForm = this.formBuilder.group({
				userId: [this.user.id || null],
				supportRequest: ["", [Validators.required]],
			});
		} else {
			let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			this.supportForm = this.formBuilder.group({
				name: ["", [Validators.required]],
				email: ["", [Validators.required, Validators.pattern(reg)]],
				supportRequest: ["", [Validators.required]],
			});
		}
	}

	ngOnInit() {
		this.translate.stream('support.popups').subscribe((res: any) => {
			this.popups = res;
		});
	}

	validateEmail(value) {
		let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		let RegularExp = new RegExp(reg);
		if (RegularExp.test(value)) {
			return true;
		} else {
			return false;
		}
	}

	onCancelSupportRequest() {
		this.dialogRef.close();
	}

	onSubmitSupportRequest() {
		this.submitButtonPressed = true;
		if(!this.supportForm.valid)
			return;

		this.sendEmailToSupport(this.supportForm.value);
	}

	sendEmailToSupport(params: any) {

		this.api.post('/support', params).subscribe(
			(result: any) => {
				this.modalService.setCloseOnClickAway(true);
				this.modalService.dialog.closeAll();
				this.modalService.showAlert(this.popups[4].title, this.popups[4].body);
				// this.supportRequest = '';
				// this.email = '';
				// this.name = '';
			},
			(error: any) => {
				this.modalService.showAlert(this.popups[5].title, this.popups[5].body);
			},
		);
	}

}
