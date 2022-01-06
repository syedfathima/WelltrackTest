import {
	Component,
	ViewChild,
	ViewEncapsulation,
	OnInit,
	Input,
	Inject,
} from "@angular/core";
import {
	FormGroup,
	FormArray,
	FormBuilder,
	Validators,
	FormControl,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../../lib/api.service";
import { LogService } from "../../../lib/log.service";
import { ModalService } from "../../../lib/modal.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Assessment, Question, Option } from "../../../models/assessment-admin";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
	selector: "app-assessment-edit",
	templateUrl: "./assessments-edit.component.html",
	styleUrls: ["./assessments-edit.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class AssessmentEditComponent implements OnInit {
	assessmentEditForm: FormGroup;
	assessmentId: number;
	courseKey: string;
	title: string;
	mode: string;
	assessment: Assessment;
	isLoaded: boolean = false;
	questionTypes: Array<object>;
	submitButtonPressed: boolean = false;
	errors: string = "";

	constructor(
		private translate: TranslateService,
		private formBuilder: FormBuilder,
		private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
		public dialogRef: MatDialogRef<AssessmentEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.assessmentId = data.data;
		if (this.assessmentId) {
			this.title = "Edit this Assessment";
			this.mode = "update";
		} else {
			this.assessment = new Assessment({});
			this.title = "Create an Assessment";
			this.mode = "create";
		}

		this.createAssessmentEditForm(new Assessment({}));
	}
	ngOnInit() {
		this.questionTypes = [
			{ value: 1, label: 'One answer' },
			{ value: 2, label: 'Multiple answers' },
			{ value: 3, label: 'Resource Yes/No' }
		];

		this.isLoaded =true;

		if (this.assessmentId) {
			this.isLoaded = false;
			this.api.get('assessment/listing/' + this.assessmentId).subscribe(
			  (result: any) => {
				this.assessment = new Assessment(result.data);
				this.createAssessmentEditForm(this.assessment);
				this.isLoaded = true;
			  },
			  (error: any) => {
				this.log.error('Error getting assessment. ' + error.message);
				this.isLoaded = true;
			  });
		  }
	}

	get f() {
		return this.assessmentEditForm.controls;
	}

	createAssessmentEditForm(data: any) {
		this.assessmentEditForm = this.formBuilder.group({
			id: [data.id || null],
			quizType: [data.quizType || "", [Validators.required]],
			comment: [data.comment || "", [Validators.required]],
			questions: this.formBuilder.array([]),
		});

		data.questions?.forEach((question: any) => {
			this.addQuestion(question);
		});
	}

	get questions() {
		return this.assessmentEditForm.get("questions") as FormArray;
	}

	getQuestion(index: number) {
		const revisionsForm = this.assessmentEditForm.get("questions") as FormArray;
		const formGroup = revisionsForm.controls[index] as FormGroup;
		return formGroup;
	}

	getOption(i: number, r:number) {
		const questionFormArray = this.assessmentEditForm.get("questions") as FormArray;
		const questionFormGroup = questionFormArray.controls[i] as FormGroup;
		const optionFormArray = questionFormGroup.get("options") as FormArray;
		const optionFormGroup = optionFormArray.controls[r] as FormGroup;
		return optionFormGroup;
	}

	onClose() {
		this.dialogRef.close();
	}

	addQuestion(data: any) {
		this.assessment.questions.push(new Question({}));

		const questionList = this.assessmentEditForm.get("questions") as FormArray;
		questionList.push(this.createQuestion(data));

		if (data.questions) {
			data.questions.forEach((question: any) => {
				this.addOption(questionList.length - 1, question);
			});
		}
	}

	createQuestion(data: any) {
		return this.formBuilder.group({
			id: [data.id || null],
			quizId: [data.quizId || null],
			comment: [data.comment || "", [Validators.required]],
			sortOrder: [data.sortOrder || null],
			tabulate: [data.tabulate || null],
			group: [data.group || ""],
			type: [data.type || null],
			active: [data.active || null],
			options: this.formBuilder.array([]),
		});
	}

	onRemoveQuestion(i: number) {
		this.assessment.questions.splice(i, 1);

		const assessmentList = this.assessmentEditForm.get('questions') as FormArray;
		assessmentList.removeAt(i);
	}

	addOption(i: number, data:any) {
		this.assessment.questions[i].options.push(new Option({}));

		const questionList = this.assessmentEditForm.get("questions") as FormArray;
		const optionList = questionList.at(i).get("options") as FormArray;
		optionList.push(this.createOption(data));
	}

	createOption(data: any) {
		return this.formBuilder.group({
			id: [data.id || null],
			questionId: [data.questionId || null],
			optionValue: [data.optionValue || null],
			sortOrder: [data.sortOrder || ""],
			comment: [data.comment || "", [Validators.required]],
		});
	}

	removeOption(i: number, r: number) {
		this.assessment.questions[i].options.splice(r, 1);

		const questionList = this.assessmentEditForm.get("questions") as FormArray;
		const optionsList = questionList.at(i).get("options") as FormArray;
		optionsList.removeAt(r);
	}

	getOptions(i: number){
		const questionList = this.assessmentEditForm.get('questions') as FormArray;
		const optionList = questionList.at(i).get("options") as FormArray;
		return optionList;
	  }

	doSave() {
		this.assessment = new Assessment(this.assessmentEditForm.value);
		this.submitButtonPressed = true;

		if(!this.assessmentEditForm.valid){
			return;
		}

		if (
			!this.assessment.questions ||
			this.assessment.questions.length === 0
		) {
			this.errors = "The assessment must have atleast one question";
			return;
		}

		let questionPass = this.assessment.questions.every((question, index) => {
			if (!question.comment) {
				this.errors = `The comment field of question ${index + 1} is empty!`;
				return false;
			}
			if (!question.options || question.options.length === 0) {
				this.errors = `The question ${index + 1} has no options!`;
				return false;
			}

			return question.options.every((option, optionIndex) => {
				if (!option.comment) {
					this.errors = `The option ${optionIndex + 1} of question ${index + 1} is empty!`
					return false;
				}
				return true;
			});
		});

		if(!questionPass){
			return;
		}

		this.errors = "";

		if (this.mode === "update") {
			this.api
				.put(
					"assessment/listing/" + this.assessment.id,
					this.assessment
				)
				.subscribe(
					(data: any) => {
						this.modalService.showAlert(
							"Success",
							"Assessment has been updated"
						);
						this.dialogRef.close(this.assessment);
					},
					(error: any) => {
						this.modalService.showAlert(
							"Error",
							"Something went wrong. Please try again"
						);
					}
				);
		} else {
			this.api.post("assessment/listing", this.assessment).subscribe(
				(data: any) => {
					this.modalService.showAlert(
						"Success",
						"Assessment has been created"
					);
					this.dialogRef.close();
				},
				(error: any) => {
					this.modalService.showAlert(
						"Error",
						"Something went wrong. Please try again"
					);
				}
			);
		}
	}

	drop(event: CdkDragDrop<string[]>) {
		const questionList = this.assessmentEditForm.get('questions') as FormArray;
		const question = questionList.at(event.previousIndex);
		questionList.removeAt(event.previousIndex);
		questionList.insert(event.currentIndex, question);
		// moveItemInArray(questionList, event.previousIndex, event.currentIndex);
	}

	dropItem(event: CdkDragDrop<string[]>) {
		moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
	}
}
