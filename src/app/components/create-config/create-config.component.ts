import { Component, Inject, OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'app/lib/api.service';
import { LogService } from 'app/lib/log.service';
import { ModalService } from 'app/lib/modal.service';
import { StorageService } from 'app/lib/storage.service';
@Component({
  selector: 'app-create-config',
  templateUrl: './create-config.component.html',
  styleUrls: ['./create-config.component.scss']
})
export class CreateConfigComponent implements OnInit {
  configCreateForm: FormGroup;
  isloaded = false;
  lang:any;
  section: any;
  isEditMode:boolean= false;
  isSubmitted:boolean= false;
  constructor(
    public dialogRef: MatDialogRef<CreateConfigComponent>,
	  private formBuilder: FormBuilder,
    private api: ApiService,
    private log: LogService,
    private modalService: ModalService,
    private translate: TranslateService,
    public storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.section = this.data.data.sections;
      this.lang = this.data.data.language;
      
      this.configCreateForm = this.formBuilder.group({
        Section: [[], []],
        Setting: ["", [Validators.required]],
        Key: ["", [Validators.required]],
        Value: [ "", [Validators.required]],
        Language:[this.lang]
      });
      this.configCreateForm.controls['Language'].disable();
      if(this.data.data.hasOwnProperty('formData')){
        this.isEditMode= true;
        this.patchFormData(this.data.data.formData);
      }
     
    }

  ngOnInit(){
    
  }


  /**
   * Patch Form Data
   */
   patchFormData(formdata){
    this.configCreateForm.patchValue({
      Section: [formdata.Section],
      Setting: formdata.Setting,
      Key: formdata.Key,
      Value: formdata.Key,
      Language:formdata.Language
    });
    this.lang = formdata.Language;
   }


  /**
   * Save Config
   */
   doSave(){
     this.configCreateForm.value.Language=this.lang;
     this.isSubmitted = true;
     if( this.configCreateForm.value.Section.length > 1) {
      this.modalService.showAlert('Error', 'Please select only one Section');
       return;
     }
     if(this.configCreateForm.valid){
       this.configCreateForm.value.Section = this.configCreateForm.value.Section[0];
      if(this.isEditMode){
        this.configCreateForm.value.ID= this.data.data.formData.ID
      }
     this.api.post('config/updatesettings',this.configCreateForm.value).subscribe(
       (results: any) => {
         this.modalService.showAlert('Success', 'Config succesfully created');
         this.dialogRef.close(results);
       },
       (error: any) => {
         this.log.error('Error loading. ' + error.message);
         this.isloaded = false;
       }
     );
     }
   }


   onClose() {
		this.dialogRef.close();
	}

}
