import { Component, ViewChild, ViewEncapsulation, OnInit, Input, Output, EventEmitter, OnChanges,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { Organization, resourceSet, ResourceSetGroup } from "../../models/organization";
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AddResourcesComponent } from '../../components/admin/add-resources/add-resources.component'
import { ModalService } from 'app/lib/modal.service';
import { ApiService } from 'app/lib/api.service';
import { isNumber } from 'lodash';
import { StorageService } from 'app/lib/storage.service';
@Component({
    selector: 'resources-edit',
    templateUrl: './resources-edit-component.html',
    styleUrls: ['./resources-edit-component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ResourcesEditComponent implements OnInit, OnChanges {
    @Input() resources: any;
    @Input() updatedData: any;
    @Output() onResourceSetChange: EventEmitter<any> = new EventEmitter();
    resourcesEditForm: FormGroup;
    organization: Organization;
    numberResourceGroups: number = 6;
    categories = ['ptsd', 'sexual violence', 'anxiety', 'stress', 'depression']
    config: any;
    selectedResourceSetIndex: number;
    allLang=[
        'en',
        'fr'
    ]
    constructor(
        private formBuilder: FormBuilder,
        private modalService: ModalService,
        private api: ApiService,
        private ref: ChangeDetectorRef,
        public storage: StorageService
    ) {
        this.config = {
            toolbar: [
              { name: 'formatting', items: ['PasteFromWord'] },
              { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-'] },
              { name: 'links', items: ['Link', 'Unlink'] },
              { name: 'paragraph', items: ['NumberedList', 'BulletedList'] }
            ]
          };
    }

    ngOnInit() {
         this.organization = this.resources;
        this.createresourcesEditForm(this.organization);
        this.resourcesEditForm.valueChanges.subscribe(val => {

            this.onResourceSetChange.emit({ resourceSet: this.resourcesEditForm.value, valid: this.resourcesEditForm.valid });
        });
        this.refreshnumberResourceGroups();
    }

    ngOnChanges() {
        if (this.updatedData !== undefined){
            this.patchUpdatedVideos();
        } else {
            this.organization = this.resources;
            this.createresourcesEditForm(this.organization);
            this.resourcesEditForm.valueChanges.subscribe(val => {
                this.onResourceSetChange.emit({ resourceSet: this.resourcesEditForm.value, valid: this.resourcesEditForm.valid });
            });
            this.refreshnumberResourceGroups();
        }
    }


    createresourcesEditForm(data: any) {
        this.resourcesEditForm = this.formBuilder.group({
            enableResources: [data.enableResources || false],
            resources: [data.resources || ""],
            language:[this.storage.get('lang') || 'en'],
            resourceSet: this.formBuilder.array([]),
            questionSet: this.formBuilder.array([]),
        });

        console.log('FORM**********************',this.resourcesEditForm.value)
        data.resourceSet?.forEach((resource: any,index) => {
            this.addRessourceSet(resource,index);
        });

        data.questionSet?.forEach((question: any) => {
            this.addQuestionSet(question);
        });
    }

    get resourceSet() {
        return this.resourcesEditForm.get("resourceSet") as FormArray;
    }

    addRessourceSet(data: any,index) {
        const resourceList = this.resourcesEditForm.get('resourceSet') as FormArray;
        resourceList.push(this.createResourceList(data));
        if (data.videos.length > 0){
            this.selectedResourceSetIndex = index;
            this.addResourceVideo(index,data.videos);
        }

        if (data.resourcesetGroup) {
            data.resourcesetGroup.forEach((resourceGroup: any) => {
                this.addResourceGroup(resourceList.length - 1, resourceGroup);
            });
        }
        this.refreshnumberResourceGroups();
    }

    /**
     * Add resource Group
     */
    addResourceGroup(i: number, data: any, action?:String,resourseSet?,j?:number) {
        if (action === 'add') {
            this.selectedResourceSetIndex = i;
            this.modalService.setCloseOnClickAway(false);
            const modal = this.modalService.showComponent(AddResourcesComponent,{
                resourceSetId : resourseSet.id,
                 mode : 'add',
                 organizationId : this.organization.id,
                 index : i
            });
            modal.beforeClosed().subscribe((responseData: any) => {
                if (responseData){
                    const resourceList = this.resourcesEditForm.get('resourceSet') as FormArray;
                    const resourceGroupList = resourceList.at(i).get("resourcesetGroup") as FormArray;
                    resourceGroupList.push(this.createResourceGroupList(responseData)); 
                }      
            });
        } else {
            const resourceList = this.resourcesEditForm.get('resourceSet') as FormArray;
            const resourceGroupList = resourceList.at(i).get("resourcesetGroup") as FormArray;
            resourceGroupList.push(this.createResourceGroupList(data));
        }

    }

    createResourceList(data: any): FormGroup {
        return this.formBuilder.group({
            id: [data.id || null],
            title: [data.title || "", [Validators.required]],
            categories: [data.categories || []],
            summary: [data.summary || ""],
            number: [data.number || 0],
            videos:this.formBuilder.array([]),
            resourcesetGroup: this.formBuilder.array([]),
        });
    }

    createResourceGroupList(data: any): FormGroup {
        return this.formBuilder.group({
            id: [data.id || null],
            title: [data.title|| "", [Validators.required]],
            contact: [data.contact || ""],
            alternateContact: [data.alternateContact || ""],
            websiteTitle: [data.websiteTitle || ""],
            website: [data.website || ""],
            address: [data.address || ""],
            internal: [data.internal || ""],
            description: [data.description  || ""],
            active: [data.active]
            
        });
    }

    getResourceSetFormGroup(index: number): FormGroup {
        const resourceSetForm = this.resourcesEditForm.get("resourceSet") as FormArray;
        const formGroup = resourceSetForm.controls[index] as FormGroup;
        return formGroup;
    }

    getResourceGroup(i: number) {
        const resourceList = this.resourcesEditForm.get('resourceSet') as FormArray;
        const resourceGroupList = resourceList.at(i).get("resourcesetGroup") as FormArray;
        return resourceGroupList;
    }

    getResourceSetGroupFormGroup(i: number, r: number): FormGroup {
        const resourceList = this.resourcesEditForm.get('resourceSet') as FormArray;
        const groupList = resourceList.at(i).get("resourcesetGroup") as FormArray;
        const formGroup = groupList.controls[r] as FormGroup;
        return formGroup;
    }

    onRemoveResourceset(i: number) {
        const resourceList = this.resourcesEditForm.get('resourceSet') as FormArray;
        resourceList.removeAt(i);
        this.refreshnumberResourceGroups();
    }

    get questionSet() {
        return this.resourcesEditForm.get("questionSet") as FormArray;
    }

    addQuestionSet(data: any) {
        const questionList = this.resourcesEditForm.get('questionSet') as FormArray;
        questionList.push(this.createQuestionList(data));
    }

    createQuestionList(data: any): FormGroup {
        return this.formBuilder.group({
            id: [data.id || 0],
            question: [data.question || ""],
            instruction: [data.instruction || ""],
            resourceNumber: [data.resourceNumber || 0],
        });
    }

    onRemoveQuestionset(i: number) {
        // let questionSet = this.organization.questionSet[i];
        // if (questionSet.id) {
        //   this.questionRemoveIds.push(questionSet.id);
        // }
        // this.organization.questionSet.splice(i, 1);
        const questionList = this.resourcesEditForm.get('questionSet') as FormArray;
        questionList.removeAt(i);
    }

    refreshnumberResourceGroups() {
        const resourceList = this.resourcesEditForm.get('resourceSet') as FormArray;
        this.numberResourceGroups = resourceList.length; // this.organization.resourceSet.length;
    }

    /**
     * Remove/Delete Resource group
     */
    removeResourceGroup(resourceGroup,resourceSet,i: number,j:number) {
        this.modalService.showConfirmation("Delete", "Are you sure you want to delete this Resource?").afterClosed().subscribe(result => {
			if (result) {
                const ctrl = <FormArray>(
                this.resourcesEditForm.get('resourceSet')['controls']
                );

                ctrl[i]
                .get('resourcesetGroup')
                .removeAt(j);
                return;
            }    
        });
    }


    /**
     * Remove/Delete Video 
     */
     onRemoveVideo(i:number,j) {
        this.modalService.showConfirmation("Delete", "Are you sure you want to delete this Video?").afterClosed().subscribe(result => {
			if (result) {
                const ctrl = <FormArray>(
            this.resourcesEditForm.get('resourceSet')['controls']
          );
          ctrl[i]
            .get('videos')
            .removeAt(0);
            }    
        });
    }

    drop(event: CdkDragDrop<resourceSet[]>) {
        const resourceList = this.resourcesEditForm.get('resourceSet') as FormArray;
        const resource = resourceList.at(event.previousIndex);
        resourceList.removeAt(event.previousIndex);
        resourceList.insert(event.currentIndex, resource);
        // moveItemInArray(this.organization.resourceSet, event.previousIndex, event.currentIndex);
    }

    dropGroup(event: CdkDragDrop<resourceSet[]>, i: number) {
        const resourceList = this.resourcesEditForm.get('resourceSet') as FormArray;
        const resourceGroupList = resourceList.at(i).get("resourcesetGroup") as FormArray;
        const resourceGroup = resourceGroupList.at(event.previousIndex);
        resourceGroupList.removeAt(event.previousIndex);
        resourceGroupList.insert(event.currentIndex, resourceGroup);
    }


    /**
     * Resource edit
     */
     editResourceGroup(resource,resourseSet,i:number,j:number){
       this.selectedResourceSetIndex = i;
       resource['resourceSetId'] = resourseSet.id;
        resource['mode'] = 'update';
        resource['organizationId'] = this.organization.id;
        
        this.modalService.setCloseOnClickAway(false);
        const modal = this.modalService.showComponent(AddResourcesComponent, resource);
		modal.beforeClosed().subscribe((data: any) => {
			if (data){
                const ctrl = <FormArray>(
                this.resourcesEditForm.get('resourceSet')['controls'][i].get('resourcesetGroup'));
                ctrl['controls'][j].patchValue({
                    id: data.id,
                    title: data.title,
                    contact: data.contact,
                    alternateContact: data.alternateContact,
                    websiteTitle: data.websiteTitle ,
                    website: data.website ,
                    address: data.address,
                    internal: data.internal ,
                    description: data.description,
                    active: data.active 
                })

            }
		})
     }

     /**
      * Video upload
      */
     changeVideoUploadListener($event, i: number, j: number): void {
		this.readFile($event.target, i, j,  "mediaUpload", 'mpeg|mpg|mp4|mkv');
	}

    /**
      * Image upload
      */
	changeVideoImageUploadListener($event, i: number, j: number): void {
		this.readFile($event.target, i, j, "imageUpload", 'gif|jpg|jpeg|png');
	}

    /**
      * Caption upload
      */
	changeCaptionUploadListener($event, i: number, j: number): void {
		this.readFile($event.target, i, j,  "captionFileUpload", 'vtt');
	}
	

	readFile(
		inputValue: any,
		i: number,
		j: number,
		keyFileName: string,
		allowedTypes: string = "gif|jpg|jpeg|png|mpeg|mpg|mp4|mkv|vtt|mp3|pdf"
	): void {
		var file: File = inputValue.files[0];
		inputValue.files[0];
		let fileName = inputValue.files[0].name;
		var reader: FileReader = new FileReader();
		const extPattern = new RegExp(`\.(${allowedTypes})$`, "i");

		if (extPattern.test(fileName)) {
			reader.onloadend = (e) => {
            const videos = <FormArray>(
                this.resourcesEditForm
                .get('resourceSet')['controls'][i].get('videos')
            );

            videos['controls'][0].get(`${keyFileName}`).patchValue({
                fileUpload: reader.result,
                fileFilename: fileName,
            });
				
			};
		} else {
			this.modalService.showAlert(
				"Error",
				`The extension is invalid. Valid extension(s) are: ${allowedTypes}`
			);
			inputValue.value = "";
		}

		reader.readAsDataURL(file);
	}

  /**
   * Get resource Details
   */
   getResourceVideoDetails(form){
    return form.controls.videos.controls;
   }

    /**
   * Initalize client cost
   */
  initializeVideo(data?) {
    return this.formBuilder.group({
        id: [data.id || ''],
		label: [data.label || "", [Validators.required]],
		length: [data.length || ""],
		image: [data.image || ""],
		media: [data.media || ""],
		captionFile: [data.captionFile ||""],
		description: [data.description || ""],
		imageUpload: this.createFileUpload({}),
		mediaUpload: this.createFileUpload({}),
		captionFileUpload: this.createFileUpload({}),
    });
  }

  /**
   * Add video
   */
   addResourceVideo(i:number,data?:any){
    const ctrl = <FormArray>this.resourcesEditForm.get('resourceSet')['controls'][i].get('videos');
    ctrl.push(this.initializeVideo(data ? data[0] : ''));
   }

 

  createFileUpload(data?){
		return this.formBuilder.group({
			fileUpload: [data.fileUpload || ""],
			fileFilename: [data.fileFilename || ""],
		});
	} 

    /**
     * Patch updated videos
     */
     patchUpdatedVideos(data?:any){
        const videoData= this.updatedData.resourceSet[this.selectedResourceSetIndex].videos;
        if(videoData.length > 0){
            const ctrl = <FormArray>(
                this.resourcesEditForm
                .get('resourceSet')['controls'][this.selectedResourceSetIndex].get('videos')
            );
            console.log(videoData[0].media)
             ctrl['controls'][0].patchValue({
                id:videoData[0].id,
                label:videoData[0].label,
                length:videoData[0].length,
                description:videoData[0].description,
                image: videoData[0].image,
                media: "",
                captionFile:videoData[0].caption,
                imageUpload :{
                    fileUpload: "",
                    fileFilename: "",
                },
                mediaUpload :{
                    fileUpload: "",
                    fileFilename: "",
                },
                captionFileUpload :{
                    fileUpload: "",
                    fileFilename: "",
                }
            });
            setTimeout(() => {
            ctrl['controls'][0].patchValue({
                media: videoData[0].media
            });
            this.ref.detectChanges();
            }, 300);
            
        }
     }

     /**
      * Language switch change
      */
     valueChange() {

     }
}