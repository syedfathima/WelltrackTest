import { Component, OnInit } from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormBuilder,
	Validators,
} from "@angular/forms";
import {
	Organization,
	resourceSet,
	questionSet,
	ResourceSetGroup,
} from "../../../models/organization";
import { ApiService } from "../../../lib/api.service";
import { LogService } from "../../../lib/log.service";
import { ModalService } from "../../../lib/modal.service";
import * as XLSX from "xlsx";
// import {
//     Workbook
// } from 'exceljs';
import {
	DatePipe
} from '@angular/common';
// import * as fs from 'file-saver';
import * as moment from 'moment'

const EXCEL_EXTENSION = ".xlsx";

@Component({
	selector: "app-resource-export",
	templateUrl: "resource-export.component.html",
	styleUrls: ["./resource-export.component.scss"],
})
export class ResouceExport implements OnInit {
	exportResourceForm: FormGroup;
	organization: Organization;
	organizations: Organization[];
	isLoaded: boolean = false;
	organizationID: number;
	arrayBuffer: any;
	file: File = undefined;
	resourceSet: resourceSet[] = [];
	questionSet: questionSet[] = [];
	orgError: string = "";
	fileError: string = "";

	constructor(
		private formBuilder: FormBuilder,
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService
	) {
		this.exportResourceForm = this.formBuilder.group({
			organizationID: ["", [Validators.required]],
		});
	}

	ngOnInit() {
		this.api.get("admin/organizations", { Active: true }).subscribe(
			(results: any) => {
				this.organizations = Organization.initializeArray(results.data);
				this.isLoaded = true;
			},
			(error: any) => {
				this.log.error("Error loading. " + error.message);
			}
		);
	}

	get f() {
		return this.exportResourceForm.controls;
	}

	doSave() {
		this.orgError = "";
		this.fileError = "";

		if (
			!this.exportResourceForm.value.organizationID ||
			this.exportResourceForm.value.organizationID <= 0
		) {
			this.orgError = "Please select an organization";
			return;
		}

		if (!this.file) {
			this.fileError = "Please upload a valid file";
			return;
		}

		this.organizationID = this.exportResourceForm.value.organizationID;
	}

	incomingfile(event) {
		this.file = event.target.files[0];
	}

	importResources() {
		this.api
			.post(
				`resources/import-resources`,
				{
					OrgID: this.organizationID,
					ResourceSet: JSON.stringify(this.resourceSet),
					QuestionSet: JSON.stringify(this.questionSet),
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
					// this.dialogRef.close();
				},
				(error: any) => {
					this.modalService.showAlert(
						"Error",
						"Something went wrong. " + error.message
					);
				}
			);
	}

	exportToExcel() {
		this.orgError = "";
		if (this.exportResourceForm.value.organizationID) {
			this.api
				.get(
					"organizations/" +
					this.exportResourceForm.value.organizationID
				)
				.subscribe(
					(result: any) => {
						this.organization = new Organization(
							result.data,
							"full"
						);

						const data = [];

						for (let i = 0; i < 3; i++) {
							data.push({
								Category: "",
								"": "",
								"Additional Questions": "",
								Message: "",
								Title: "",
								Contact: "",
								"Alternative Contact": "",
								Address: "",
								"Website (include http://)": "",
							});
						}

						let i = 0;
						this.organization.resourceSet.forEach((element) => {
							data.push({
								Category: element.title,
								"": "Question " + (i + 1),
								"Additional Questions":
									this.organization.questionSet[i] &&
									this.organization.questionSet[i].question,
								Message:
									this.organization.questionSet[i] &&
									this.organization.questionSet[i]
										.instruction,
								Title: element.resourcesetGroup[0].title,
								Contact: element.resourcesetGroup[0].contact,
								"Alternative Contact":
									element.resourcesetGroup[0]
										.alternateContact,
								Address: element.resourcesetGroup[0].address,
								"Website (include http://)":
									element.resourcesetGroup[0].website,
							});

							for (
								let j = 1;
								j < element.resourcesetGroup.length;
								j++
							) {
								data.push({
									Title: element.resourcesetGroup[j].title,
									Contact:
										element.resourcesetGroup[j].contact,
									"Alternative Contact":
										element.resourcesetGroup[j]
											.alternateContact,
									Address:
										element.resourcesetGroup[j].address,
									"Website (include http://)":
										element.resourcesetGroup[j].website,
								});
							}
							i++;
						});

						const filename: string = "resource-list";

						const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
							data
						);
						// generate workbook and add the worksheet

						var wscols = [
							{ wch: 20 },
							{ wch: 20 },
							{ wch: 80 },
							{ wch: 50 },
							{ wch: 50 },
							{ wch: 30 },
							{ wch: 20 },
							{ wch: 20 },
							{ wch: 20 },
						];

						ws["!cols"] = wscols;
						ws["A1"].s = {
							fill: {
								fgColor: {
									rgb: "FFFF0000",
								},
							},
						};
						ws["B1"].s = {
							font: {
								name: "Arial",
								sz: 24,
								color: {
									theme: "5",
								},
							},
						};

						// ws["A1"].v = "Red";

						const workbook: XLSX.WorkBook = XLSX.utils.book_new();
						XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");
						var cell_ref = XLSX.utils.encode_cell({ c: 0, r: 0 });

						// save to file
						XLSX.writeFile(
							workbook,
							`${filename}${EXCEL_EXTENSION}`
						);
						return;
					},
					(error: any) => {
						this.log.error(
							"Error getting organizations. " + error.message
						);
					}
				);
		} else {
			this.orgError = "Please select an organization";
		}
	}

	// exportToExcel2(){
	// 	const header = ['User Name', 'Email', 'Phone Number', 'Address'];
	// 	const data: any = [{
	// 		username: 'Satheesh Elumalai',
	// 		email: 'satheesh123@gmail.com',
	// 		phone: '1122334455',
	// 		address: 1000
	// 	}, {
	// 		username: 'Smith',
	// 		email: 'smith123@gmail.com',
	// 		phone: '1122334455',
	// 		address: 1000
	// 	}, {
	// 		username: 'Steve',
	// 		email: 'steve123@gmail.com',
	// 		phone: '1122334455',
	// 		address: 1000
	// 	}, {
	// 		username: 'Wilson',
	// 		email: 'wilson@gmail.com',
	// 		phone: '1122334455',
	// 		address: 1000
	// 	}];
	//     // Create workbook and worksheet
	//     const workbook = new Workbook();
	//     const worksheet = workbook.addWorksheet();
	//     // Cell Style : Fill and Header
	//     var TodayDate = new Date();
	//     let MMDDYY = moment(TodayDate).format('MMDDYY').toString();
	//     var FileName = "ExportuserData" + MMDDYY;
	//     const headerRow = worksheet.addRow(header);
	//     headerRow.eachCell((cell, number) => {
	//         cell.fill = {
	//             type: 'pattern',
	//             pattern: 'solid',
	//             fgColor: {
	//                 argb: 'FFFFFFFF'
	//             },
	//             bgColor: {
	//                 argb: 'FF0000FF'
	//             },
	//         };
	//         cell.font = {
	//             color: {
	//                 argb: '00000000',
	//             },
	//             bold: true
	//         }
	//         cell.border = {
	//             top: {
	//                 style: 'thin'
	//             },
	//             left: {
	//                 style: 'thin'
	//             },
	//             bottom: {
	//                 style: 'thin'
	//             },
	//             right: {
	//                 style: 'thin'
	//             }
	//         };
	//     });
	//     data.forEach(d => {
	//         const row = worksheet.addRow(d);
	//         row.fill = {
	//             type: 'pattern',
	//             pattern: 'solid',
	//             fgColor: {
	//                 argb: '00FFFFFF'
	//             },
	// 			bgColor: {
	//                 argb: 'FF0000FF'
	//             },
	//         };
	//         row.font = {
	//             color: {
	//                 argb: '00000000',
	//             },
	//             bold: false
	//         }
	//         row.eachCell((cell, number) => {
	//             cell.border = {
	//                 top: {
	//                     style: 'thin'
	//                 },
	//                 left: {
	//                     style: 'thin'
	//                 },
	//                 bottom: {
	//                     style: 'thin'
	//                 },
	//                 right: {
	//                     style: 'thin'
	//                 }
	//             };
	//         });
	//     });
	//     worksheet.getColumn(1).width = 30;
	//     worksheet.getColumn(2).width = 40;
	//     worksheet.getColumn(3).width = 20;
	//     worksheet.getColumn(4).width = 20;
	//     workbook.xlsx.writeBuffer().then((data: any) => {
	//         const blob = new Blob([data], {
	//             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	//         });
	//         fs.saveAs(blob, FileName + '.xlsx');
	//     });
	// }
}
