import { Injectable } from "@angular/core";

@Injectable()
export class AuthModuleService {
	constructor() {}

	validateEmail(value) {
		let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		var RegularExp = new RegExp(reg);
		if (RegularExp.test(value)) {
			return true;
		} else {
			return false;
		}
	}

	validatePassword(value) {
		let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
		var RegularExp = new RegExp(reg);
		if (RegularExp.test(value)) {
			return true;
		} else {
			return false;
		}
	}
}
