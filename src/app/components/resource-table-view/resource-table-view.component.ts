import { Component, ViewChild, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { element } from 'protractor';

@Component({
	selector: 'page-results',
	templateUrl: 'resource-table-view.component.html',
	styleUrls: ['./resource-table-view.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ResourceTableViewComponent implements OnInit {
	resTableViewForm: FormGroup;
	resources: any[];
	title: string;
	dataSource: any;
	displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
	finalData =[{
		dataToAdd:[],
		dataToDelete:[],
		dataToUpdate:[]
	}]
	allChecked :boolean = true;
	allCheckedUpdate: boolean = true;
	allCheckedDelete: boolean = false;
	
	constructor(
		private formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<ResourceTableViewComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.resources = data.data;
		this.dataSource = this.resources;
		this.displayedColumns = ['checkbox','resource', 'category',];
		this.title = "Update records";
		this.createOrgEditForm(this.resources);
	}

	ngOnInit() {
	}

	createOrgEditForm(data: any) {
		this.resTableViewForm = this.formBuilder.group({
			addList: this.formBuilder.array([]),
			updateList: this.formBuilder.array([]),
			deleteList: this.formBuilder.array([]),
		},
		);

		if(data){
			if(data.hasOwnProperty('add') && Object.keys(data.add).length > 0){
				const add = data.add;
				for(const key in add){
					add[key].forEach(element => {
						element['status'] = true;
						this.finalData[0]['dataToAdd'].push({
							name:key,
							data:element
						});
					});
					
			}  
		}

		if(data.hasOwnProperty('delete') && Object.keys(data.delete).length > 0){
			const deleted = data.delete;
			for(const key in deleted){
				deleted[key].forEach(element => {
					element['status'] = false;
					this.finalData[0]['dataToDelete'].push({
						name:key,
						data:element
					});
			   });	
		   }  
	    }

			if(data.hasOwnProperty('update') && Object.keys(data.update).length > 0){
				const update = data.update;
				for(const key in update){
					update[key].forEach(element => {
						element['status'] = true;
						this.finalData[0]['dataToUpdate'].push({
							name:key,
							data:element
						});	
					});			
			    }  
		    }
		   console.log(JSON.stringify(this.finalData));
		}
	}
  



	doSave(){
		// console.log(this.resTableViewForm.value);
		this.dialogRef.close(this.finalData);
	}

	onClose() {
		this.dialogRef.close(null);
	}

	/**Select/Unselect All Data to add */
	selectAllDataToAdd(ev){
		if(ev.checked){
			this.finalData[0]['dataToAdd'].forEach(element=>{
				element.data['status']= true;
			});
			this.allChecked = true;
		} else {
			this.finalData[0]['dataToAdd'].forEach(element=>{
				console.log(element)
				element.data['status']= false;
			});
			this.allChecked = false;
		}

	}

   /**Single Select/Deselect Data to add */
	selectDataToAdd(ev,element){
		if(ev.checked){
			element.data['status']= true;
			const isallChecked = this.finalData[0]['dataToAdd'].filter(data=> data.data.status === false);
			this.allChecked = isallChecked.length === 0 ? true : false;
		} else {
			element.data['status']= false;
			this.allChecked = false;
		}
	}


	/**Select/Unselect All Data to update */
	selectAllDataToUpdate(ev){
		if(ev.checked){
			this.finalData[0]['dataToUpdate'].forEach(element=>{
				element.data['status']= true;
			});
			this.allCheckedUpdate = true;
		} else {
			this.finalData[0]['dataToUpdate'].forEach(element=>{
				console.log(element)
				element.data['status']= false;
			});
			this.allCheckedUpdate = false;
		}

	}


	/**Single Select/Deselect All Data to update */
	selectDataToUpdate(ev,element){
		if(ev.checked){
			element.data['status']= true;
			const isallChecked = this.finalData[0]['dataToUpdate'].filter(data=> data.data.status === false);
			this.allCheckedUpdate = isallChecked.length === 0 ? true : false;
		} else {
			element.data['status']= false;
			this.allCheckedUpdate = false;
		}
	}


	/**Select/Unselect All Data to update */
	selectAllDataToDelete(ev){
		if(ev.checked){
			this.finalData[0]['dataToDelete'].forEach(element=>{
				element.data['status']= true;
			});
			this.allCheckedDelete = true;
		} else {
			this.finalData[0]['dataToDelete'].forEach(element=>{
				console.log(element)
				element.data['status']= false;
			});
			this.allCheckedDelete = false;
		}

	}


	/**Single Select/Deselect All Data to update */
	selectDataToDelete(ev,element){
		if(ev.checked){
			element.data['status']= true;
			const isallChecked = this.finalData[0]['dataToDelete'].filter(data=> data.data.status === false);
			this.allCheckedDelete = isallChecked.length === 0 ? true : false;
		} else {
			element.data['status']= false;
			this.allCheckedDelete = false;
		}
	}

}