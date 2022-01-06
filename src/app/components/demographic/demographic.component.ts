import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { User } from '../../../app/models/user';
import { UserService } from '../../../app/lib/user.service';
import { LogService } from '../../../app/lib/log.service';
import { ModalService } from '../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../lib/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare var window;

@Component({
	selector: 'demographic',
	templateUrl: 'demographic.component.html',
	styleUrls: ['./demographic.component.scss']
})
export class DemographicComponent implements OnInit {

	user: User;
	ethnicityRows: any;
	genderRows: any;
	yearInProgramRows: any;
	ageRows: string;
	referred: number;
	age: string;
	ethnicity: string;
	gender: string;
	yearInProgram: any = -1;
	sportsTeam: number;
	sportsTeamType: string;
	sports: Array<string>;
	otherSport: string;
	enableDemoOther: boolean;
	birthDate: Date;
	maxDate: Date;
	enableUniversityFields: boolean;

	@Output() userLoad = new EventEmitter<object>();

	constructor(
		private userService: UserService,
		private log: LogService,
		private modalService: ModalService,
		private translate: TranslateService,
		private api: ApiService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<DemographicComponent>,
	) {
		this.user = this.userService.getUser();

		if (this.user.primaryOrganization && this.user.primaryOrganization.id === 2635) {
			this.enableUniversityFields = false;
		} else {
			this.enableUniversityFields = true;
		}
		this.maxDate = new Date();
	}

	ngOnInit() {

		this.genderRows = [
			'Female',
			'Male',
			'Transgender',
			'Gender non-binary / non-forming / fluid',
			'Self-identify'
		];

		this.ethnicityRows = [
			'American Indian / Native American',
			'Arab / Middle Eastern',
			'Asian / Asian American',
			'Black / African American',
			'Latino',
			'Multiracial',
			'White / Caucasian',
			'Other'
		];

		this.yearInProgramRows = [
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10
		];

		this.sports = [
			'Baseball',
			'Basketball - Men',
			'Basketball - Women',
			'Cross-country',
			'Field Hockey',
			'Football',
			'Golf - Men',
			'Golf - Women',
			'Lacross - Men',
			'Lacross - Women',
			'Rowing',
			'Soccer - Men',
			'Soccer - Women',
			'Softball',
			'Swimming & Diving - Men',
			'Swimming & Diving - Women',
			'Tennis - Men',
			'Tennis - Women',
			'Track and field',
			'Volleyball',
			//'Other'
		];

	}

	doSave() {
		if (
			this.age === undefined ||
			this.gender === undefined ||
			this.ethnicity === undefined ||
			(this.enableUniversityFields && this.referred) === undefined
		) {
			this.modalService.showAlert('Error', 'Please fill out all required fields');
			return;
		}

		this.api.post('users/demographic', {
			ethnicity: this.ethnicity,
			referred: this.referred,
			age: this.age,
			gender: this.gender,
			yearInProgram: this.yearInProgram
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

}
