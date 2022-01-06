import { Component, ViewChild, ViewEncapsulation, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { Organization, resourceSet, ResourceSetGroup, OrganizationCourse } from '../../../models/organization';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { UtilityService } from '../../../lib/utility.service';
import { ModalService } from '../../../lib/modal.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { User } from "../../../models/user";
import { UserService } from "../../../lib/user.service";

@Component({
  selector: 'app-organization-admin-edit',
  templateUrl: './organization-admin-edit.component.html',
  styleUrls: ['./organization-admin-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  inputs: ['phoneNumber'],

})
export class OrganizationAdminEditComponent implements OnInit {
  @ViewChild('input') fileInput: any;
  orgEditForm: FormGroup;
  placeholders: any[];
  default: any;
  popups: any[];
  title: string;
  config: any;
  mode: string;
  organizations: Organization[];
  isLoaded: boolean = false;
  ressourcesets: Array<Object> = [];
  emptyressourceset: Object = { 'title': '', 'description': '', 'url': '', 'category': '' };
  numberResourceGroups: number = 6;
  logo: string;
  timezoneNames: any;
  urlPattern: string;
  phonePattern: string;
  commaSeparatedUrlPattern: string;
  authTypes: Array<string> = [];

  @Input() organization: Organization;
  orgId: number;
  invitesExecutives: any = {};
  questionRemoveIds: any = [];
  resourcenRemoveIds: any = [];
  courses: any;
  submitButtonPressed: boolean = false;
  errors: string = "";
  userType: string;
  resourseSet: any;

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private utility: UtilityService,
    private log: LogService,
    private modalService: ModalService,
    private userService: UserService,
    public dialogRef: MatDialogRef<OrganizationAdminEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.orgId = data.data;

    this.urlPattern = this.utility.urlValidationPattern();
    this.phonePattern = this.utility.phoneValidationPattern();
    this.userType = this.userService.getUser().userType;

    if (this.orgId) {
      this.title = 'Edit this Organization';
      this.mode = 'update';
      this.organization = new Organization('', 'full');
    }
    else {
      this.organization = new Organization('', 'full');
      this.createOrgEditForm(this.organization);
      this.title = 'Create an Organization';
      this.mode = 'create';
    }

   
    this.resourseSet = {
      enableResources: this.organization.enableResources,
      resources: this.organization.resources,
      resourceSet: this.organization.resourceSet,
      questionSet: this.organization.questionSet
    };
  

    this.createOrgEditForm(this.organization);

    this.config = {
      toolbar: [
        { name: 'formatting', items: ['PasteFromWord'] },
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList'] }
      ]
    };

    this.authTypes = [
      "saml2",
      "oauth2-pkce"
    ];

  }

  ngOnInit() {
    if (this.orgId) {
      this.api.get('organizations/' + this.orgId).subscribe(
        (result: any) => {
          if(!result.data.resourceSet){
            result.data.resourceSet = [];
          }
          this.organization = new Organization(result.data, 'full');
          this.resourseSet = {
            enableResources: this.organization.enableResources,
            resources: this.organization.resources,
            resourceSet: this.organization.resourceSet,
            questionSet: this.organization.questionSet
          };
        
		      this.createOrgEditForm(this.organization);
          this.loadCourses();
        },
        (error: any) => {
          this.log.error('Error getting organizations. ' + error.message);
        });
    } else {
      this.organization.courses = [];
      this.loadCourses();
    }

    this.translate.stream('organizationInfo').subscribe((res: any) => {
      this.default = res.default;
      this.placeholders = res.placeholders;
      this.popups = res.popups;
    });


    this.api.get('admin/organizations', { Active: true }).subscribe(
      (results: any) => {
        this.organizations = Organization.initializeArray(results.data);
        this.isLoaded = true;
        this.refreshnumberResourceGroups();
      },
      (error: any) => {

        this.log.error('Error loading. ' + error.message);
      }
    );

    // this.setOrganization();
  }

  loadCourses() {
    this.api.get("course/courselisting").subscribe(
      (result: any) => {
        if (result.data) {
          const resCourses = result.data;
          for (var key in resCourses) {
            if (
              this.organization.courses.findIndex(
                (course) => course.courseId === resCourses[key].ID
              ) === -1
            ) {
              this.organization.courses.push(
                new OrganizationCourse({
                  courseId: resCourses[key].ID,
                  name: key,
                  enabled: false,
                })
              );
            }
          }

          this.createOrgEditForm(this.organization);
        }
      },
      (error: any) => {
        this.log.error("Error getting organizations. " + error.message);
      }
    );
  }

  get f() {
    return this.orgEditForm.controls;
  }

  setOrganization() {
    if (this.orgId) {
      this.api.get('organizations/' + this.orgId).subscribe(
        (result: any) => {
          this.organization = new Organization(result.data, 'full');
          if (this.organization.courses.length === 0) {
            this.setDefaultCourses();
          }
          else {
            this.createOrgEditForm(this.organization);
          }
        },
        (error: any) => {
          this.log.error('Error getting organizations.' + error.message);
        });
    } else {
      this.setDefaultCourses();
    }
  }

  setDefaultCourses() {
    this.api.get('course/courselisting/defaults').subscribe(
      (result: any) => {
        if (result.data) {
          this.organization.courses = [];
          result.data.forEach(course => {
            this.organization.courses.push(
              new OrganizationCourse({
                id: course.ID,
                courseId: course.ID,
                name: course.Name,
                enabled: course.Default,
              })
            );
          });
          this.createOrgEditForm(this.organization);
        }
      },
      (error: any) => {
        this.log.error('Error getting organizations. ' + error.message);
      });

  }

  createOrgEditForm(data: any) {
    this.orgEditForm = this.formBuilder.group({
      id: [data.id || null],
      name: [data.name || "", [Validators.required]],
      parentOrgId: [data.parentOrgId || ""],
      demoStatus: [data.demoStatus || false],
      active: [data.active || true],
      logo: [data.logo || ""],
      logoUpload: [data.logoUpload || ""],
      logoPath: [data.logoPath || ""],
      address: [data.address || ""],
      phone: [data.phone || ""],
      website: [data.website || "", Validators.pattern(this.urlPattern)],
      authenticationType: [data.authenticationType || ""],
      clientID: [data.clientID || ""],
      redirectUrl: [data.redirectUrl || ""],
      authorizeEndPointUrl: [data.authorizeEndPointUrl || ""],
      oauthEndPointUrl: [data.oauthEndPointUrl || ""],
      emergencyContact: [data.emergencyContact || ""],
      protocallRefId: [data.protocallRefId || ""],
      description: [data.description || ""],
      contactGroup: this.formBuilder.group({
        telephone: [data.contactGroup.telephone || "", [Validators.pattern(this.phonePattern)]],
        title: [data.contactGroup.title || ""],
        description: [data.contactGroup.description || ""],
      }),
      settings: this.formBuilder.group({
        assessment: [data.settings.assessment || ""],
        enableBuddyScheduling: [data.settings.enableBuddyScheduling || false],
        hasCounselors: [data.settings.hasCounselors || true],
        enableVideo: [data.settings.enableVideo || false],
        enableAlerts: [data.settings.enableAlerts || true],
        enableDisasterCourse: [data.settings.enableDisasterCourse || false],
        hideNotes: [data.settings.hideNotes || false],
        customConfirm: [data.settings.customConfirm || ""],
        showOldDashboard: [data.settings.showOldDashboard || false],
        hasScheduledPushNotification: [data.settings.hasScheduledPushNotification || false],
      }),
      auth: this.formBuilder.group({
        url: [data.auth.url || ""],
        xml: [data.auth.xml || ""],
      }),
      subdomain: [data.subdomain || "", [Validators.required, Validators.pattern('[0-9a-zA-Z]{2,}')]],
      allowedDomains: [data.allowedDomains || ""],
      enforceDomains: [data.enforceDomains || false],
      enableSso: [data.enableSso || false],
      courses: this.formBuilder.array([]),
    },
    );

    data.courses?.forEach((course: any) => {
      this.addCourse(course);
    });
  }

  resourceSetChanged(data: any) {
    this.resourseSet = data.resourceSet;
    console.log('resource set changed called');
  }

  doSave() {
    this.submitButtonPressed = true;

    this.organization = new Organization(this.orgEditForm.value, 'full');
    this.errors = '';

    if (!this.orgEditForm.get('name').valid) {
      console.log("the org neees a name");
      this.errors = "The organization needs a name.";
      return;
    }

    if (!this.orgEditForm.get('subdomain').valid) {
      this.errors = "The organization needs a subdomain.";
      return;
    }

    if (!this.orgEditForm.get('phone').valid) {
      this.errors = "Invalid phone number.";
      return;
    }

    if (!this.orgEditForm.get('contactGroup').get('telephone').valid) {
      this.errors = "Invalid emergency contact phone number.";
      return;
    }

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

    if (this.organization.enableSso) {
      if (!this.organization.auth.url && !this.organization.auth.xml) {
        this.errors = 'The organization has sso but no configuration is specified. Disable sso until a configuration url or xml can be saved';
        return;
      }
    }


    this.organization = { ...this.organization, ...this.resourseSet };
  
    if (this.errors === "") {
      if (this.mode === 'update') {

        this.api.put('organizations/' + this.organization.id, Organization.forApi(this.organization), true, false).subscribe(
          (data: any) => {
            this.modalService.showAlert('Success', 'Organization has been updated');
            this.dialogRef.close(this.organization);
          },
          (error: any) => {
            this.modalService.showAlert('Error', 'Something went wrong. ' + error.message);
          }
        );

      }
      else {
        this.log.debug(this.organization);
        this.api.post('organizations', Organization.forApi(this.organization), true, false).subscribe(
          (data: any) => {
            this.modalService.showAlert('Success', 'Organization has been created');
            this.dialogRef.close();
          },
          (error: any) => {
            this.modalService.showAlert('Error', 'Something went wrong. ' + error.message);
          }
        );
      }
    }
  }

  get contactGroup() {
    return this.orgEditForm.get("contactGroup") as FormGroup;
  }

  get auth() {
    return this.orgEditForm.get("auth") as FormGroup;
  }

  onClose() {
    this.dialogRef.close();
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {

    var file: File = inputValue.files[0];
    inputValue.files[0]
    let fileName = inputValue.files[0].name;
    var reader: FileReader = new FileReader();

    if ((/\.(gif|jpg|jpeg|png)$/i).test(fileName)) {
      reader.onloadend = (e) => {
        this.orgEditForm.patchValue({
          logoUpload: reader.result,
          logo: fileName,
        });
      }
    }
    else {
      this.fileInput.nativeElement.value = "";
      this.modalService.showAlert('Error', 'The extension is invalid. Are you sure this is an image?  Are you really really sure?');
    }

    reader.readAsDataURL(file);
  }

  get courseList() {
    return this.orgEditForm.get("courses") as FormArray;
  }

  addCourse(data: any) {
    const coursesList = this.orgEditForm.get('courses') as FormArray;
    coursesList.push(this.createCourse(data));
  }

  createCourse(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id || 0],
      courseId: [data.courseId || ""],
      name: [data.name || ""],
      enabled: [data.enabled || false],
    });
  }

  refreshnumberResourceGroups() {
    const resourceList = this.orgEditForm.get('resourceSet') as FormArray;
    
    if(resourceList){
      this.numberResourceGroups = resourceList.length;
    }
  }

  doInviteAddExec() {
    this.invitesExecutives.push();
  }

  doInviteAddPro() {

  }

  urlValidator(): ValidatorFn {
    return Validators.pattern("^[(][0-9]{3}[)][ ][0-9]{3}[-]?[0-9]{4}(,,[0-9],,[0-9],[0-9])?$");
  }
}

