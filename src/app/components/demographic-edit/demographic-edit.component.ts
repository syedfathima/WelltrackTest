import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
} from "@angular/forms";
import { ApiService } from '../../lib/api.service';
import { LogService } from '../../lib/log.service';
import { UserService } from '../../lib/user.service';
import { ModalService } from '../../lib/modal.service';

@Component({
    selector: 'demographic-edit',
    templateUrl: 'demographic-edit.component.html',
    styleUrls: ['./demographic-edit.component.scss']
})
export class DemographicEditComponent implements OnInit {
    demographicEditForm: FormGroup;
    genderRows: string[];
    ethnicityRows: string[];
    yearInProgramRows: any;

    constructor(
        private formBuilder: FormBuilder,
        private api: ApiService,
        private log: LogService,
        private user: UserService,
        private modalService: ModalService,) {

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

        this.createDemographicEditForm({});
    }

    createDemographicEditForm(data: any) {
        this.demographicEditForm = this.formBuilder.group({
            ethnicity: [data.Ethnicity || ""],
            age: [data.Age || ""],
            gender: [data.Gender || ""],
            referred: [data.Referred || ""],
            yearInProgram: [data.YearInProgram || 0],
        });
    }

    ngOnInit() {
        this.api.get('demographic/' + this.user.getUser().id, {
        }).subscribe(
            (result: any) => {
                this.createDemographicEditForm(result.data[0]);
            },
            (error: any) => {
                this.log.error('Error fetching user. ' + error.message);
            }
        );
    }

    doSave() {
        this.api.post('demographic/update', this.demographicEditForm.value
            // {
            //     Ethnicity: this.demographicEditForm.value.ethnicity,
            //     Age: this.demographicEditForm.value.age,
            //     Gender: this.demographicEditForm.value.gender,
            //     Referred: this.demographicEditForm.value.referred,
            //     YearInProgram: this.demographicEditForm.value.yearInProgram,
            // }
        ).subscribe(
            (data: any) => {
                this.modalService.showAlert('Success', 'User demographic details was successfully updated');
            },
            (error: any) => {
                this.modalService.showAlert('Error', error.message);
            }
        );
    }
}