
import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
  FormArray,
} from "@angular/forms";
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import * as _ from 'lodash';
import { UtilityService } from 'app/lib/utility.service';

@Component({
  selector: 'app-add-resources',
  templateUrl: './add-resources.component.html',
  styleUrls: ['./add-resources.component.scss']
})

export class AddResourcesComponent implements OnInit {
  resourceForm: FormGroup;
  isloaded = false;
  resources:any;
  urlPattern: String;
  config:any;
  isSubmitted = false;
  errors: string;
  constructor(
    public dialogRef: MatDialogRef<AddResourcesComponent>,
	  private formBuilder: FormBuilder,
    private api: ApiService,
    private modalService: ModalService,
    private utility: UtilityService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.resources = data.data;
	    this.urlPattern = this.utility.urlValidationPattern();
      this.constructForm();
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

  }


  /**
   * Construct form
   */
  constructForm(){
	this.resourceForm = this.formBuilder.group({
        id: [this.resources.id || null],
        title: [this.resources.title || "", [Validators.required]],
        contact: [this.resources.contact || ""],
        alternateContact: [this.resources.alternateContact || ""],
        websiteTitle: [this.resources.websiteTitle || ""],
        website: [this.resources.website || ""],
        address: [this.resources.address || ""],
        internal: [this.resources.internal || ""],
        description: [this.resources.description || ""],
        active: [this.resources.active === 0  ? 0 : 1 ],
      });
	
  }

 

  /**
   * Dave Resource Group
   */
  doSave() {
    this.isSubmitted = true;
    const formData = this.resourceForm.value;
    this.resourceForm.value.active = this.resourceForm.value.active ? 1 : 0
    formData.resourcesetID = this.resources.resourceSetId;
    formData.organization = this.resources.organizationId;
    if (this.resourceForm.valid){
      this.dialogRef.close(formData);
    }
		this.errors = "";		
  }


  onClose() {
    this.dialogRef.close();
  }

 
  
}
