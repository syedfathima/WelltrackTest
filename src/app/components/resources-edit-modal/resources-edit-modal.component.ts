import { Component, ViewChild, ViewEncapsulation, OnInit, Input, Inject } from '@angular/core';
import { ModalService } from '../../lib/modal.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../lib/api.service';
import { Organization } from '../../models/organization';
import { LogService } from '../../lib/log.service';

@Component({
    selector: 'app-resources-edit-modal',
    templateUrl: './resources-edit-modal.component.html',
    styleUrls: ['./resources-edit-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ResourcesEditModal implements OnInit {
    orgId: number;
    organization: Organization;
    title: string;
    submitButtonPressed: boolean = false;
    errors: string = "";
    formValid: boolean = false;
    resourseSet: any;
    isLoading: boolean = true;

    constructor(
        private modalService: ModalService,
        private api: ApiService,
        private log: LogService,
        public dialogRef: MatDialogRef<ResourcesEditModal>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.orgId = data.data;
        this.title = "Edit Resources";
    }

    ngOnInit() {
        if (this.orgId) {
            this.isLoading = true;
            this.api.get('organizations/' + this.orgId).subscribe(
                (result: any) => {
                    this.organization = new Organization(result.data, 'full');
                    this.resourseSet = {
                        enableResources: this.organization.enableResources,
                        resources: this.organization.resources,
                        resourceSet: this.organization.resourceSet,
                        questionSet: this.organization.questionSet
                    };
                },
                (error: any) => {
                    this.log.error('Error getting organizations. ' + error.message);
                },
                () => {
                    this.isLoading = false
                });
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    resourceSetChanged(data: any) {
        this.formValid = data.valid;
        this.resourseSet = data.resourceSet;
    }

    doSave() {
        this.submitButtonPressed = true;
        this.errors = "";

        if (this.resourseSet?.enableResources && this.resourseSet?.resourceSet) {
            this.resourseSet.resourceSet.every((resource: any, index: number) => {
                if (resource.title === "") {
                    this.errors = `Title of resource set ${index + 1} is empty`;
                    return false;
                }

                resource.resourcesetGroup.every((group: any, r: number) => {
                    if (group.title === "") {
                        this.errors = `Title of resourse group ${r + 1} of resource set ${index + 1} is empty`;
                        return false;
                    }

                    return true;
                });

                if (this.errors !== "") {
                    return false;
                }

                return true;
            });
        }

        if (this.errors === "") {
            this.resourseSet.resourceSet = JSON.stringify(this.resourseSet.resourceSet);
            this.resourseSet.questionSet = JSON.stringify(this.resourseSet.questionSet);

            this.api.put('resources/update/' + this.organization.id, this.resourseSet, true, false).subscribe(
                (data: any) => {
                    this.modalService.showAlert('Success', 'Organization has been updated');
                    this.dialogRef.close(this.organization);
                },
                (error: any) => {
                    this.modalService.showAlert('Error', 'Something went wrong. ' + error.message);
                }
            );
        }
    }
}