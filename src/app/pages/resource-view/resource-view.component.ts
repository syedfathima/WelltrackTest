import { Component, OnInit } from "@angular/core";
import { Organization } from "../../models/organization";
import { ApiService } from "../../lib/api.service";
import { LogService } from "../../lib/log.service";
import { ModalService } from '../../lib/modal.service';
import { UserService } from '../../lib/user.service';
import { User } from '../../models/user';
@Component({
    selector: "app-resource-view",
    templateUrl: "./resource-view.component.html",
    styleUrls: ["./resource-view.component.scss"],
})
export class ResourceView implements OnInit {
    organizations: Organization[];
    isLoaded: boolean = false;
    orgId: number;
    organization: Organization;
    title: string;
    submitButtonPressed: boolean = false;
    errors: string = "";
    formValid: boolean = false;
    resourseSet: any;
    isLoading: boolean = true;
    user: User;
    isUpdated: boolean = false;
    updatedData:any;
    extraResource:any;
    constructor(
        private userService: UserService,
        private modalService: ModalService,
        private api: ApiService,
        private log: LogService,) {
        this.user = this.userService.getUser();
    }

    ngOnInit() {
        if (this.user.userType === "admin" || this.user.userType === "superadmin") {
            this.api.get("admin/organizations", { Active: true }).subscribe(
                (results: any) => {
                    this.organizations = Organization.initializeArray(results.data);
                    this.isLoaded = true;
                },
                (error: any) => {
                    this.log.error("Error loading. " + error.message);
                    this.isLoaded = true;
                }
            );
        } else if (this.user.userType === "orgadmin") {
            if (this.user.organizations && this.user.organizations.length > 0) {
                this.organizations = [];
                this.organizations.push(this.user.organizations[0]);
            }

            this.api.get(`organizations/associatedorgs/${this.user.organizations[0]?.id}`).subscribe(
                (results: any) => {
                    this.organizations = Organization.initializeArray(results.data);
                    this.isLoaded = true;
                },
                (error: any) => {
                    // this.organizations = null;
                    this.isLoaded = true;
                }
            );
        }
    }

    onSelectOrganization(orgId) {
        this.orgId = orgId.value;
        // console.log(orgId);
        // this.organization = this.organizations.find((org) => org.id === orgId.value);
        // console.log(this.organization);
        this.isLoaded = false;
        this.api.get('organizations/' + orgId.value).subscribe(
            (result: any) => {
                this.organization = new Organization(result.data, 'full');
                this.resourseSet = {
                    enableResources: this.organization.enableResources,
                    language:this.organization.language,
                    resources: this.organization.resources,
                    resourceSet: this.organization.resourceSet,
                    questionSet: this.organization.questionSet
                };
            },
            (error: any) => {
                this.log.error('Error getting organizations. ' + error.message);
                this.isLoaded = true;
            },
            () => {
                this.isLoaded = true;
            });
    }

    resourceSetChanged(data: any) {
        this.formValid = data.valid;
        this.resourseSet = data.resourceSet;
        this.extraResource = data.extraResourcesSet;
    }

    doSave() {
        this.submitButtonPressed = true;
        this.errors = "";
        this.resourseSet.resourceSet =  this.resourseSet.resourceSet.concat(this.extraResource);
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
            // this.resourseSet.resourceSet = JSON.stringify(this.resourseSet.resourceSet);
            // this.resourseSet.questionSet = JSON.stringify(this.resourseSet.questionSet);
            const resourceSet = { ...this.resourseSet, resourceSet: JSON.stringify(this.resourseSet.resourceSet), questionSet: JSON.stringify(this.resourseSet.questionSet) };
           //console.log(JSON.stringify(resourceSet));
           this.api.put('resources/update/' + this.organization.id, resourceSet, true, false).subscribe(
                (data: any) => {
                   this.updatedData = new Organization(data.data, 'full');
                    this.modalService.showAlert('Success', 'Organization has been updated');
                },
                (error: any) => {
                    this.modalService.showAlert('Error', 'Something went wrong. ' + error.message);
                }
            );
        }
    }
}