import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { UserService } from '../../lib/user.service';
import { StorageService } from '../../lib/storage.service';
import { ModalService } from '../../lib/modal.service';
import { LogService } from '../../lib/log.service';
import { UtilityService } from '../../lib/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Organization } from '../../models/organization';
import { User } from '../../models/user';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
// import { StripeService } from "ngx-stripe";
// import { StripeElementsOptions as ElementsOptions, StripeElements as Elements, StripeElement  } from "@stripe/stripe-js"

@Component({
	selector: 'register-payment-form',
	templateUrl: 'register-payment.html',
	styleUrls: ['./register-payment.scss'],
})
export class RegisterPaymentComponent implements OnInit {

	fullName: string;
	emailAddress: string;
	password: string;
	loginEmailAddress: string;
	loginPassword: string;
	inputs: string[];
	exiting: boolean;
	errorPopup: any;
	successPopup: any;
	emptyPopup: any;
	showTerms: boolean;
	showNext: boolean;
	agree: boolean;
	sub: string;
	accesscode: string;
	code: any;
	logo = '';
	logoPath = '';
	suffix = '';
	tosPopup: any;
	organization: Organization;
	valid: boolean;
	skip: boolean = false;
	accessCode: string = '';
	orgEmail: string = '';
	redirect: string = '';
	passwordValidate: boolean = false;
	emailValidate: boolean = false;
	signUpText: any;
	name: string = '';
	promo: string;
	promoValidated: boolean = false;
	address1: string;
	city: string;
	province: string;
	country: string;
	postal: string;
	phone: string;
	packages: any;
	packageSelected: string;
	packageChoice: number;
	stripeToken: any;
	priceSelected: number;
	coupon: string;

	@Input() title: string;
	@Input() description: string;
	@Input() loggedIn: boolean = false;
	testMode: boolean = false;

	elements: Elements;
	card: StripeElement;
	cc_name: string;

	// optional parameters
	elementsOptions: ElementsOptions;

	stripeTest: FormGroup;
	@Output() loadUser = new EventEmitter<any>();

	constructor(
		private api: ApiService,
		private storage: StorageService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private modalService: ModalService,
		private translateService: TranslateService,
		private log: LogService,
		private fb: FormBuilder,
		private stripeService: StripeService,
		private userService: UserService,
		private translate: TranslateService) {

		this.exiting = true;
		this.errorPopup = {};
		this.successPopup = {};
		this.emptyPopup = {};

		this.inputs = [];

		this.agree = false;
		this.showTerms = false;
	}

	ngOnInit() {
		this.stripeTest = this.fb.group({
			name: ['', [Validators.required]]
		});

		//fix casting error
		if (this.translateService.currentLang == 'en') {
			this.elementsOptions = {
				locale: "en"
			};
		} else {
			this.elementsOptions = {
				locale: "fr"
			};
		}

		this.stripeService.elements(this.elementsOptions)
			.subscribe(elements => {
				this.elements = elements;
				// Only mount the element the first time
				if (!this.card) {
					this.card = this.elements.create("card", {
						style: {
							base: {
								iconColor: '#666EE8',
								color: '#31325F',
								lineHeight: '40px',
								fontWeight: 300,
								fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
								fontSize: '18px',
								'::placeholder': {
									color: '#CFD7E0'
								}
							}
						},
						hidePostalCode: true
					});
					this.card.mount('#card-element');
				}
			});


		this.packages = {
			'luminohealth' : {
				0: {
					'title': '3 dollars/monthly',
					'cost': 3
				},
				1:{
					'title': '30 dollars/yearly',
					'cost': 30
				}
			},
			'regular':{
				0: {
					'title': '6 dollars/monthly',
					'cost': 6
				},
				1:{
					'title': '60 dollars/yearly',
					'cost': 60
				}
			}
		};

		this.translate.stream('signUp').subscribe((res: any) => {
			this.signUpText = res;
			this.inputs = res.inputs;
			this.errorPopup = res.errorPopup;
			this.successPopup = res.successPopup;
			this.emptyPopup = res.emptyPopup;
			this.tosPopup = res.tosPopup;
		});

		this.packageChoice = 0;

		this.activatedRoute.params.subscribe(params => {
			this.promo = params['promo'];
			this.onPromoChange();
			if(this.promo == 'luminohealth'){
				this.packageSelected = 'luminohealth';
				//this.coupon = '50_percent_off';
			}
			else{
				this.packageSelected = 'regular';
			}
		});

		this.activatedRoute.queryParams.subscribe(params => {
			this.code = params['code'] ? params['code'] : '';
			if (this.code) {
				this.api.post('confirm/guid', {
					Guid: this.code,
				}).subscribe(
					(results: any) => {
						let confirm = results.data[0];
						this.emailAddress = confirm.Arg1;
					});
			}
		});

	}

	onChangePassword() {
		let validate = this.validatePassword(this.password);
		if (validate) {
			this.passwordValidate = true;
		}
		else {
			this.passwordValidate = false;
		}
	}

	onChangeEmail() {
		let validate = this.validateEmail(this.emailAddress);
		if (validate) {
			this.emailValidate = true;
		}
		else {
			this.emailValidate = false;
		}
	}

	validatePassword(value) {
		let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
		var RegularExp = new RegExp(reg);
		if (RegularExp.test(value)) {
			this.passwordValidate = true;
			return true;
		}
		else {
			return false;
		}
	}

	validateEmail(value) {
		let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		var RegularExp = new RegExp(reg);
		if (RegularExp.test(value)) {
			this.log.debug('validates');
			this.emailValidate = true;
			return true;
		}
		else {
			this.log.debug('doesnt validates');
			return false;
		}
	}

	preValidate() {
		if (!this.loggedIn) {
			if (this.emailAddress && this.loginEmailAddress) {
				this.modalService.showAlert('Error', 'You have an email filled in both the new user and existing user form. Please choose one or the other.');
				return false;
			}

			if (!this.emailAddress && !this.loginEmailAddress) {
				this.modalService.showAlert('Error', 'Please fill out the email address that you would like to register with.');
				return false;
			}


			if (this.emailAddress) {
				/*
				*	Only validate for new users
				*/
				if (!this.validatePassword(this.password) && this.password) {
					this.modalService.showAlert(this.signUpText.passwordPopup.title, this.signUpText.passwordPopup.body);
					return false;
				}

				if (!this.password || !this.fullName) {
					this.modalService.showAlert(this.signUpText.emptyPopup.title, this.signUpText.emptyPopup.body);
					return false;
				}
			}
			else {
				if (!this.loginPassword) {
					this.modalService.showAlert(this.signUpText.passwordMissingPopup.title, this.signUpText.passwordMissingPopup.body);
					return false;
				}
			}

			if (!this.agree) {
				this.modalService.showAlert(this.signUpText.tosPopup.oops, this.signUpText.tosPopup.tos);
				return false;
			}
		}

		if(!(this.address1 && this.city && this.province && this.country && this.postal && this.phone && this.cc_name)){
			this.modalService.showAlert('Error', "You must fill in all of the billing information.");
			return false;
		}
		return true;
	}

	onSignup() {
		let type;
		let password;
		let email;
		if (this.emailAddress) {
			type = 'new';
			password = this.password;
			email = this.emailAddress;
		}
		else {
			type = 'existing';
			password = this.loginPassword;
			email = this.loginEmailAddress;
		}


		/*
		* API endpoint either enforces login or doesn't.
		* The endpoint behind auth middleware benefits from having the user obj
		* The public one doesn't.
		*/
		let endpoint;
		let authenticate;
		if (!this.loggedIn) {
			endpoint = 'users/payment';
			authenticate = false;
		}
		else {
			endpoint = 'users/paymentuser';
			authenticate = true;
		}

		this.api.post(endpoint, {
			loggedIn: this.loggedIn,
			type: type,
			Name: this.fullName,
			Password: password,
			Email: email,
			coupon: this.coupon,
			address1: this.address1,
			city: this.city,
			province: this.province,
			country: this.country,
			postal: this.postal,
			phone: this.phone,
			packageSelected: this.packageSelected,
			packageChoice: this.packageChoice,
			code: this.code,
			token: JSON.stringify(this.stripeToken),
			cc_name: this.cc_name,
		}, authenticate).subscribe(
			(data: any) => {
				this.modalService.showAlert(this.successPopup.title, data.message);
				this.log.event('register');
				this.storage.resetFlags();
				if (!this.loggedIn) {
					this.router.navigate(['/']);
				}
				else {
					this.loadUser.emit();
				}
			},
			(error: any) => {
				if (error.status === 404 && !this.showNext) {
					this.showNext = true;
				}
				else {

					this.modalService.showAlert(this.errorPopup.title, error.message);
					this.log.error('Error registering. ' + error.message);
				}
			}
		);
	}

	onPrevious() {
		this.showNext = false;
	}

	onBuy() {
		let resp = this.preValidate();
		/*
		* Passes validation tests if true
		*/
		if (resp) {
			const name = this.stripeTest.get('name').value;
			this.stripeService
				.createToken(this.card, { name })
				.subscribe(result => {
					if (result.token) {
						// Use the token to create a charge or a customer
						// https://stripe.com/docs/charges

						this.stripeToken = result.token;
						this.onSignup();
					} else if (result.error) {
						// Error creating the token
						this.modalService.showAlert(this.errorPopup.title, result.error.message);

					}
				});
		}
	}

	ontest(){
		this.log.debug('emitter called');
		this.loadUser.emit(true);
	}

	onPromoChange() {
		if (this.promo == 'luminohealth') {
			this.promoValidated = true;
		}
		else {
			this.promoValidated = false;
		}
	}

	onChangePackage($event) {
		this.log.debug($event);
		//this.packageSelected = value;
	}

}
