import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { LogService } from '../../lib/log.service';
import { ModalService } from '../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../lib/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var window;

@Component({
	selector: 'demographic-resilience',
	templateUrl: 'demographic-resilience.component.html',
	styleUrls: ['./demographic-resilience.component.scss']
})
export class DemographicResilienceComponent implements OnInit {

	demographicForm: FormGroup;
	submitted: boolean;
	user: User;
	ethnicityRows: any;
	genderRows: any;
	yearInProgramRows: any;
	clinicNames: any;
	clinicRoles: any;
	ageRows: string;
	referred: number;
	age: string;
	ethnicity: string;
	gender: string;
	yearInProgram: any = -1;
	enableDemoOther: boolean;
	birthDate: Date;
	maxDate: Date;
	nativeLanguage: number;
	clinicName: string;
	businessName: string;
	divisionName: string;
	clinicRole: string;
	otherClinicRole: string;
	otherLanguage: string;
	otherEthnicity: string;
	states: any;
	region: string;
	ages: Array<string>;

	uhgBusinessNames: Array<string>;
	uhgDivisions: any;
	selectedDivisions: Array<string>;
	branches: Array<string>;
	yearsServed: Array<number>;
	uhgInternal: boolean;

	from: string;
	to: string;
	branch: string;


	@Output() userLoad = new EventEmitter<object>();

	constructor(
		private userService: UserService,
		private log: LogService,
		private modalService: ModalService,
		private translate: TranslateService,
		private api: ApiService,
		private formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<DemographicResilienceComponent>,
	) {
		this.user = this.userService.getUser();
		if (this.user.primaryOrganization && this.user.primaryOrganization.enableDemoOther) {
			this.enableDemoOther = true;
		} else {
			this.enableDemoOther = false;
		}
		this.maxDate = new Date();
	}

	get f() { return this.demographicForm.controls; }

	ngOnInit() {
		this.demographicForm = this.formBuilder.group({
			gender: ['', [Validators.required]],
			ethnicity: ['', [Validators.required]],
			age: ['', [Validators.required]],
			nativeLanguage: ['', [Validators.required]],
			state: ['', [Validators.required]],
			branch: ['', [Validators.required]],
			from: ['', [Validators.required]],
			to: ['', [Validators.required]]
		});

		this.genderRows = [
			'Female',
			'Male',
			'Non-binary',
			'Prefer to self describe',
			'Prefer not to say'
		];

		this.ethnicityRows = [
			'White',
			'Black or African American',
			'American Indian',
			'Alaska Native',
			'Asian or Asian American',
			'Native Hawaiian and Other Pacific Islander',
			'Hispanic or Latin',
			'Two or more races',
			'Other Race/Ethnicity'
		];

		this.yearInProgramRows = [
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10
		];

		this.states = [
			'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', ' Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', ' Virginia', ' Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
		];

		this.ages = [
			'18-29',
			'30-39',
			'40-49',
			'50-59',
			'60-69',
			'70 and Above'
		];

		this.branches = [
			'Air Force',
			'Army',
			'Coast Guard',
			'Marine Corps',
			'Navy',
			'Space Force',
			'Family Member of Veteran',
			'OptumServe Staff'
		];

		let year = 1940;
		let yearNow = new Date().getFullYear();
		this.yearsServed = [];
		while (year++ < yearNow) {
			this.yearsServed.push(year);
		}
		this.yearsServed;
	}

	doSave() {
		this.submitted = true;

		if (this.demographicForm.invalid) {
			return;
		}

		if (this.ethnicity === 'Other Race/Ethnicity' && !this.otherEthnicity) {
			this.modalService.showAlert('Error', 'Please fill out your race.');
			return;
		}

		if (this.nativeLanguage === 0 && !this.otherLanguage) {
			this.modalService.showAlert('Error', 'Please fill out your native language.');
			return;
		}

		if (this.from >  this.to) {
			this.modalService.showAlert('Error', 'Your from date is higher than your to date.');
			return;
		}

		let language;
		if (this.otherLanguage) {
			language = this.otherLanguage
		} else {
			language = this.nativeLanguage;
		}

		let ethnicity;
		if (this.otherEthnicity) {
			ethnicity = this.otherEthnicity;
		}
		else {
			ethnicity = this.ethnicity;
		}

		this.api.post('users/demographic', {
			gender: this.gender,
			ethnicity: ethnicity,
			age: this.age,
			nativeLanguage: language,
			region: this.region,
			branch: this.branch,
			from: this.from,
			to: this.to
		}).subscribe(
			(result: any) => {
				this.dialogRef.close(true);
				this.modalService.showAlert('Success', 'The information has been saved. Thank you.');
			},
			(error: any) => {
				this.modalService.showAlert('Error', 'There was an error saving the information. Please try again later');
			},
			() => {

			});

	}

	onBranchChange(selectedBranch) {
		if (selectedBranch === 'Family Member of Veteran' || selectedBranch === 'OptumServe Staff' ) {
			this.demographicForm.get('from').clearValidators();
			this.demographicForm.get('to').clearValidators();
			this.demographicForm.get('from').updateValueAndValidity();
			this.demographicForm.get('to').updateValueAndValidity();
		}
		else {
			this.demographicForm.get('from').setValidators([Validators.required]);
			this.demographicForm.get('to').setValidators([Validators.required]);
			this.demographicForm.get('from').updateValueAndValidity();
			this.demographicForm.get('to').updateValueAndValidity();
		}
	}


}
