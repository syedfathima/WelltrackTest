import { forEach } from "lodash";

export class Assessment {
	id: number;
	quizType: string;
	comment: string;
	questions: Question[] = [];

	constructor(data: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.quizType = data.QuizType || data.quizType;
			this.comment = data.Comment || data.comment;
			this.questions = Question.initializeArray(
				data.Questions || data.questions || []
			);
		}
	}

	initializeAssessment(data: any) {
		this.id = data.ID || data.id;
		this.quizType = data.QuizType || data.quizType;
		this.comment = data.Comment || data.comment;
		this.questions = [];

		data.data &&
			data.data.forEach((question) => {
				question = question[0];
				let options: Option[] = [];
				question.options &&
					question.options.forEach((option: any) => {
						options.push(
							new Option({
								id: option.id || option.ID,
								questionId:
									option.questionId || option.questionId,
								optionValue:
									parseInt(option.optionValue) || parseInt(option.OptionValue),
								sortOrder: option.sortOrder || option.SortOrder,
								comment: option.comment || option.Comment,
							})
						);
					});

				this.questions.push(
					new Question({
						id: question.id || question.ID,
						quizId: question.quizId || question.QuizID,
						comment: question.comment || question.Comment,
						sortOrder: question.sortOrder || question.SortOrder,
						tabulate: question.tabulate || question.Tabulate,
						group: question.group || question.Group,
						type: question.type || question.Type,
						active: question.active || question.Active,
						options: options,
					})
				);
			});
	}

	static forApi(data: Assessment) {
		return {
			ID: data.id,
			QuizType: data.quizType,
			Comment: data.comment,
			Questions: data.questions.map((question) => ({
				ID: question.id,
				QuizId: question.quizId,
				Comment: question.comment,
				SortOrder: question.sortOrder,
				Tabulate: question.tabulate,
				Group: question.group,
				Type: question.type,
				Active: question.active,
				Options: question.options.map((option) => ({
					ID: option.id,
					QuestionId: option.questionId,
					OptionValue: option.optionValue,
					SortOrder: option.sortOrder,
					Comment: option.comment,
				})),
			})),
		};
	}

	public static initializeArray(objects: any): Assessment[] {
		let results: Assessment[] = [];

		for (let i = 0; i < objects.length; i++) {
			let obj = new Assessment(objects[i]);
			results.push(obj);
		}
		return results;
	}
}

export class Question {
	id: number;
	quizId: number;
	comment: string;
	sortOrder: number;
	tabulate: number;
	group: string;
	type: number;
	active: number;
	options: Option[] = [];

	constructor(data: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.quizId = data.QuizID || data.quizId;
			this.comment = data.Comment || data.comment;
			this.sortOrder = data.SortOrder || data.sortOrder;
			this.tabulate = data.Tabulate || data.tabulate;
			this.group = data.Group || data.group;
			this.type = data.Type || data.type;
			this.active = data.Active || data.active;
			this.options = Option.initializeArray(
				data.Options || data.options || []
			);
		}
	}

	public static initializeArray(objects: any): Question[] {
		let results: Question[] = [];
		for (let i = 0; i < objects.length; i++) {
			let obj = new Question(objects[i]);
			results.push(obj);
		}

		return results;
	}
}

export class Option {
	id: number;
	questionId: number;
	optionValue: number;
	sortOrder: number;
	comment: string;

	constructor(data: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.questionId = data.QuestionID || data.questionId;
			this.optionValue = parseInt(data.OptionValue || data.optionValue);
			this.sortOrder = data.SortOrder || data.sortOrder;
			this.comment = data.Comment || data.comment;
		}
	}

	public static initializeArray(objects: any): Option[] {
		let results: Option[] = [];
		for (let i = 0; i < objects.length; i++) {
			let obj = new Option(objects[i]);
			results.push(obj);
		}

		return results;
	}
}
