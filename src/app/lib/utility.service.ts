import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ModalService } from '../lib/modal.service';

@Injectable()
export class UtilityService {

	constructor(
		private modalService: ModalService
	) {

	}
	public static strToDate(str: string): Date {
		str = str.replace(/\s/i, 'T');
		str = str.replace(/\..*$/i, 'Z');
		return new Date(str); //UTC hack
	}

	public static convertToDate(date: any): Date {
		if (date instanceof Date) {
			return date;
		} else if(date.date){
			return UtilityService.strToDate(date.date);
		} else {
			return UtilityService.strToDate(date);
		}
	}


	public static getSubdomain(): string {
		let full = window.location.host;

		let parts = full.split('.');
		let sub;
		if (parts.length > 2) {
			sub = parts[0];
		}
		else {
			sub = '';
		}

		return sub;
	}

	public static getAccessCode(): string {

		return '';
	}

	toQueryStringParams(obj: any): string {
		let str = [];

		for (let p in obj) {
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
			}
		}

		return str.join('&');
	}

	capitalizeFirstLetter(str: string): string {
		return str[0].toUpperCase() + str.slice(1)
	}

	strRandom(length: number) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	demoMode(){
		if (environment.demo) {
			this.modalService.showAlert('Demo mode', 'Any account updates have been disabled on this demo site.');
			return true;
		}
		else{
			return false;
		}
	}

	isDemoMode(){
		if (environment.demo) {
			return true;
		}
		else{
			return false;
		}
	}

	urlValidationPattern(){
		return '^(https?:\\/\\/)'+ // protocol
		'((([a-z\\d]([a-zA-Z\\d-]*[a-z\\d])*)\\.)+[a-zA-Z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-zA-Z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-zA-Z\\d_]*)?$';
	}

	commaSeparatedUrlPattern(){
		const urlPattern = "(http[s]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}(\\/[a-zA-Z0-9\\.\\-]+)*[\\/]{0,1}";
		return  "^" + urlPattern + "(,[ ]*" + urlPattern + ")*[\\,]{0,1}[ ]*$";
		// return  "^(" + urlPattern + "(,[ ]*))*$";
	}

	phoneValidationPattern(){
		return "^[(][0-9]{3}[)][ ][0-9]{3}[-]?[0-9]{4}(,,[0-9],,[0-9],[0-9])?$";
	}

	emailValidationPattern(){
		return "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$";
	}
}
