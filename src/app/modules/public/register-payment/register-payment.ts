import { Component, OnInit } from '@angular/core';
import { Organization } from '../../../models/organization';

@Component({
	selector: 'register',
	templateUrl: 'register-payment.html',
})
export class RegisterPaymentPage implements OnInit {

	fullName: string;
	emailAddress: string;
	password: string;
	inputs: string[];
	exiting: boolean;
	errorPopup: any;
	successPopup: any;
	emptyPopup: any;
	showTerms: boolean;
	showNext: boolean;
	agree: boolean;
	allowAda: boolean = false;
	ada: boolean;
	sub: string;
	accesscode: string;
	code: any;
	logo = '';
	logoPath = '';
	suffix = '';
	tosPopup: any;
	organization: Organization;
	title: string = '';
	description: string = '';
	valid: boolean;
	skip: boolean = false;
	accessCode: string = '';
	orgEmail: string = '';
	redirect: string = '';
	passwordValidate: boolean = false;
	emailValidate: boolean = false;
	signUpText: any;
	name: string = '';

	constructor(
	) {

		this.exiting = true;
		this.errorPopup = {};
		this.successPopup = {};
		this.emptyPopup = {};

		this.inputs = [];

		this.agree = false;
		this.showTerms = false;
	}

	ngOnInit() {


	}


}
