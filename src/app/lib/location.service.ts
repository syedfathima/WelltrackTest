
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { HttpClient, HttpResponse } from '@angular/common/http';



declare var window;

export class CrisisHotline {
	location: string;
	title: string;
	url: string;
}

@Injectable()
export class LocationService {

	private provinces = {
		'A': 'Newfoundland and Labrador',
		'B': 'Nova Scotia',
		'C': 'Prince Edward Island',
		'E': 'New Brunswick',
		'G': 'Quebec',
		'H': 'Quebec',
		'J': 'Quebec',
		'K': 'Ontario',
		'L': 'Ontario',
		'M': 'Ontario',
		'N': 'Ontario',
		'P': 'Ontario',
		'R': 'Manitoba',
		'S': 'Saskatchewan',
		'T': 'Alberta',
		'V': 'British Columbia',
		'X': 'Northwest Territories and Nunavut',
		'Y': 'Yukon'
	};

	private canadianHotlines: CrisisHotline[] = [
		{
			location: 'Newfoundland and Labrador',
			title: '1-888-737-4668',
			url: 'tel:1-888-737-4668'
		},
		{
			location: 'Nova Scotia',
			title: '1-888-429-8167',
			url: 'tel:1-888-429-8167'
		},
		{
			location: 'Prince Edward Island',
			title: '1-800-218-2885',
			url: 'tel:1-800-218-2885'
		},
		{
			location: 'New Brunswick',
			title: '1-800-667-5005',
			url: 'tel:1-800-667-5005'
		},
		{
			location: 'Quebec',
			title: '1-866-277-3553',
			url: 'tel:1-866-277-3553'
		},
		{
			location: 'Ontario',
			title: '1-866-531-2600',
			url: 'tel:1-866-531-2600'
		},
		{
			location: 'Manitoba',
			title: '1-888-310-4593',
			url: 'tel:1-888-310-4593'
		},
		{
			location: 'Saskatchewan',
			title: '1-866-865-7274',
			url: 'tel:1-866-865-7274'
		},
		{
			location: 'Alberta',
			title: '1-800-263-3045',
			url: 'tel:1-800-263-3045'
		},
		{
			location: 'Northwest Territories and Nunavut',
			title: '1-800-661-0844',
			url: 'tel:1-800-661-0844'
		},
		{
			location: 'Yukon',
			title: '1-844-533-3030',
			url: 'tel:1-844-533-3030'
		}
	];

	constructor(private http: HttpClient) {

	}

	getLocation(): Observable<{}> {
		return this.http.get('https://freegeoip.net/json/')
			.map((res: Response) => res.json())
			.catch((error: any) => observableThrowError(error.json().error || 'Server error'));
	}

	getProvince(postalCode: string) {
		if (!postalCode) {
			return 'Unknown';
		}

		let firstLetter = postalCode[0];

		if (this.provinces[firstLetter]) {
			return this.provinces[firstLetter];
		}

		return 'Unknown';

	}

	getHelpline(country: string, postalCode: string): CrisisHotline {

		if (country === 'Canada') {
			let province = this.getProvince(postalCode);
			let hotline = _.find(this.canadianHotlines, { location: province });

			if (hotline) {
				return hotline;
			} else {
				return {
					location: 'Canada',
					title: 'CASP/ACPS',
					url: 'http://suicideprevention.ca/need-help/'
				}
			}

		} else {
			return {
				location: 'United States',
				title: '1-800-273-8255',
				url: 'tel:1-800-273-8255'
			}
		}
	}
}
