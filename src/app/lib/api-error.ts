export class ApiError {

	status: number;
	message: string;

	constructor(message) {
		this.message = message;
	}
}
