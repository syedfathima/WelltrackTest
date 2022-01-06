import { Component, OnInit } from "@angular/core";
import {
	FormGroup,
	FormBuilder,
	Validators,
} from "@angular/forms";
import {
	Organization,
	resourceSet,
	questionSet,
	ResourceSetGroup,
} from "../../models/organization";
import { ApiService } from "../../lib/api.service";
import { LogService } from "../../lib/log.service";
import { ModalService } from "../../lib/modal.service";
import * as XLSX from "xlsx";
import { ResourceTableViewComponent } from "../../components/resource-table-view/resource-table-view.component";
import { MultiAutoItem } from '../../models/multiautoitem';
import { exit } from "process";
import * as _ from "lodash";

@Component({
	selector: "resource-import.component",
	templateUrl: "resource-import.component.html",
	styleUrls: ["./resource-import.component.scss"],
})
export class ResourceImportPage implements OnInit {
	importResourceForm: FormGroup;
	organizations: Organization[];
	isLoaded: boolean = false;
	organizationID: number;
	arrayBuffer: any;
	file: File = undefined;
	resourceSet: resourceSet[] = [];
	questionSet: questionSet[] = [];
	orgError: string = "";
	fileError: string = "";
	multiSelOrgs: Array<MultiAutoItem> = [];
	organizationIds: Array<number>; 
	category= [];
	constructor(
		private formBuilder: FormBuilder,
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
	) {
		this.importResourceForm = this.formBuilder.group({
			organizationID: ["", [Validators.required]],
			excelFile: ["", [Validators.required]],
		});
	}

	ngOnInit() {
		this.api.get("admin/organizations", { Active: true }).subscribe(
			(results: any) => {
				this.organizations = Organization.initializeArray(results.data);
				this.organizations.forEach((org) => {
					this.multiSelOrgs.push(new MultiAutoItem(org.id, org.name));
				});
				this.isLoaded = true;
			},
			(error: any) => {
				this.log.error("Error loading. " + error.message);
				this.isLoaded = true;
			}
		);
	}

	get f() {
		return this.importResourceForm.controls;
	}


	onSelectOrgs(items: MultiAutoItem[]) {
		this.organizationIds = [];
		this.organizationIds = items.map((item) => item.id);
		this.importResourceForm.patchValue({
			organizationID: this.organizationIds.length === 1 ? this.organizationIds[0] : this.organizationIds
		})
	}

	doSave() {
		this.orgError = "";
		this.fileError = "";

		if (!this.importResourceForm.value.organizationID || this.importResourceForm.value.organizationID <= 0) {
			this.orgError = "Please select an organization";
			return;
		}

		if (!this.file) {
			this.fileError = "Please upload a valid file";
			return;
		}

		this.organizationID = this.importResourceForm.value.organizationID;
		this.uploadSpreadsheet();
	}

	incomingfile(event) {
		this.file = event.target.files[0];
	}

	uploadSpreadsheet() {
		this.resourceSet = [];
		this.questionSet = [];
		this.fileError = "";

		let fileReader = new FileReader();
		fileReader.readAsArrayBuffer(this.file);
		fileReader.onload = (e) => {
			this.arrayBuffer = fileReader.result;
			var data = new Uint8Array(this.arrayBuffer);
			var arr = new Array();
			for (var i = 0; i != data.length; ++i)
				arr[i] = String.fromCharCode(data[i]);
			var bstr = arr.join("");
			var workbook = XLSX.read(bstr, { type: "binary" });
			var first_sheet_name = workbook.SheetNames[0];
			var worksheet = workbook.Sheets[first_sheet_name];

			const importedData = XLSX.utils.sheet_to_json(worksheet, {
				raw: true,
			});

			this.log.debug(importedData);

			let setIndex = 0;

			for (let i: number = 0; i < importedData.length; i++) {
				let groupIndex: number = 0;

				if (
					importedData[i]["Category"] &&
					importedData[i]["Category"] !== ""
				) {
					this.resourceSet.push(new resourceSet());

					this.resourceSet[setIndex].title = importedData[i]["Category"];
                    this.questionSet.push(new questionSet());

					if (!importedData[i]["Additional Questions"]) {
						this.fileError = "File Error: No question found for Category:" + importedData[i]["Category"];
						return;
					}
					this.category.push(importedData[i]["Category"]);
					this.questionSet[setIndex].question =
						importedData[i]["Additional Questions"];
					this.questionSet[setIndex].instruction =
						importedData[i]["Message"];
					this.questionSet[setIndex].resourceNumber = setIndex + 1;
					this.questionSet[setIndex].category = importedData[i]["Category"];

					if (
						importedData[i]["Title"] &&
						importedData[i]["Title"] !== ""
					) {
						this.resourceSet[setIndex].resourcesetGroup[groupIndex].title = importedData[i]["Title"];
						this.resourceSet[setIndex].resourcesetGroup[groupIndex].contact = importedData[i]["Contact"];
						this.resourceSet[setIndex].resourcesetGroup[groupIndex].alternateContact = importedData[i]["Alternative Contact"];
						this.resourceSet[setIndex].resourcesetGroup[groupIndex].address = importedData[i]["Address"];
						this.resourceSet[setIndex].resourcesetGroup[groupIndex].website = importedData[i]["Website (include http://)"];
						groupIndex++;
						i++;

						while (
							importedData[i] &&
							(!importedData[i]["Category"] ||
								importedData[i]["Category"] === "")
						) {
							this.resourceSet[setIndex].resourcesetGroup.push(
								new ResourceSetGroup()
							);

							this.resourceSet[setIndex].resourcesetGroup[groupIndex].title = importedData[i]["Title"];
							this.resourceSet[setIndex].resourcesetGroup[groupIndex].contact = importedData[i]["Contact"];
							this.resourceSet[setIndex].resourcesetGroup[groupIndex].alternateContact = importedData[i]["Alternative Contact"];
							this.resourceSet[setIndex].resourcesetGroup[groupIndex].address = importedData[i]["Address"];
							this.resourceSet[setIndex].resourcesetGroup[groupIndex].website = importedData[i]["Website (include http://)"];
							groupIndex++;
							i++;
						}
						i--;
					} else {
						this.fileError = `File Error: No resource group title for Category:${this.resourceSet[setIndex].title}`;
						return;
					}

					setIndex++;
				}
			}

			if (this.resourceSet.length === 0) {
				this.fileError = "Invalid file or no items found"!;
				return;
			}

			this.importResources();
		};
	}

	importResources() {
		this.isLoaded = false;

		this.api
			.post(
				`resources/check-resources`,
				{
					OrgID: this.organizationID,
					ResourceSet: JSON.stringify(this.resourceSet),
					QuestionSet: JSON.stringify(this.questionSet)
				},
				true,
				false
			)
			.subscribe(
				(data: any) => {
					this.updateIntermediateData(data);
					this.isLoaded = true;
				},
				(error: any) => {
					this.modalService.showAlert(
						"Error",
						"Something went wrong. " + error.message
					);
					this.organizationIds = []
					this.importResourceForm.patchValue({
						organizationID : []
					});
					delete this.file;
					this.isLoaded = true;
				}
			);

	}


	/**
	 * Grouping resource set data
	 */
	groupByCategory(data){
		const result = data.reduce(function (r, a) {
			if (a.hasOwnProperty('name')) {
				r[a.name] = r[a.name] || [];
				if (a.data.status){
					r[a.name].push(a.data);
				}
				return r;
			}
		}, Object.create(null));
		return result;
	}

	updateIntermediateData(data: any){
		this.modalService.setCloseOnClickAway(false);
		const modal = this.modalService.showComponent(ResourceTableViewComponent, data.data);
		modal.beforeClosed().subscribe((data: any) => {
			this.organizationIds = []
			this.importResourceForm.patchValue({
				organizationID: []
			});
			delete this.file;
			const questionDataSet = []
			let addResourceSet;
			let updateResourceSet;
			let deleteResourceSet;
			if (data) {
				if (data[0].dataToAdd.length > 0){
					const selectedResource = data[0].dataToAdd.filter(resource =>{
						return resource.data['status'] === true;
					});
					addResourceSet = this.groupByCategory(selectedResource)
				}
				if (data[0].dataToUpdate.length > 0){
					const selectedResource = data[0].dataToUpdate.filter(resource =>{
						return resource.data['status'] === true;
					});
					 updateResourceSet = this.groupByCategory(selectedResource);
				}
				if (data[0].dataToDelete.length > 0){
					const selectedResource = data[0].dataToDelete.filter(resource =>{
						return resource.data['status'] === true;
					});
					 deleteResourceSet = this.groupByCategory(selectedResource)
				}
			    this.api
				.post(
					`resources/import-resources`,
					{
						OrgID: this.organizationID,
						add: JSON.stringify(addResourceSet) === undefined ? {} :  JSON.stringify(addResourceSet),
						update: JSON.stringify(updateResourceSet) === undefined ? {} :  JSON.stringify(updateResourceSet),
						delete: JSON.stringify(deleteResourceSet) === undefined ? {} :  JSON.stringify(deleteResourceSet),
						questionSet: JSON.stringify(this.questionSet)
					},
					true,
					false
				)
				.subscribe(
					(data: any) => {
						this.modalService.showAlert(
							"Success",
							"Successfully imported organization resources."
						);
					},
					(error: any) => {
						this.modalService.showAlert(
							"Error",
							"Something went wrong. " + error.message
						);
					}
				);
			}
		});
	}



}
