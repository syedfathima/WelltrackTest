import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import * as _ from 'lodash';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UtilityService } from './utility.service';
import { LogService } from './log.service';
import { environment } from '../../environments/environment';
import { ApiError } from './api-error';


@Injectable()
export class ApiRestService {

	private defaultHeaders = {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json; charset=UTF-8',
	};

	constructor(
		private http: Http,
		private util: UtilityService,
		private log: LogService
	) {
		this.log.trace('Api Loaded');
	}

	private getHeaders(upload = false) {
		let additionalHeaders = {};

		if (upload) {
			additionalHeaders['Content-Type'] = 'multipart/form-data; charset=utf-8; boundary="another cool boundary"';
			//additionalHeaders['Accept'] = 'application/json';
		}

		return new Headers(
			_.assign({}, this.defaultHeaders, additionalHeaders)
		);
	}

	private handleResponse(res: Response) {
		return res.json();
	}

	// private handleError(error: Response | any) {
	// 	let err = new ApiError('An unknown error occured');



	// 	if (error instanceof Response) {
	// 		const body = error.json() || '';
	// 		err.message = body.message || JSON.stringify(body);
	// 		err.status = error.status;
	// 	} else {
	// 		err.message = error.message || error.toString();
	// 		err.status = error.status;
	// 	}

	// 	return Observable.throw(err);
	// }

	private handleError(error: Response | any) {
		let err = new ApiError('An unknown error occured');


		//this.log.debug('ERROR', error);

		if (error instanceof Response) {
			const body = error.json() || '';
			//Check for invalid fields

			if (body.invalid_fields) {
				err.message = _.values(body.invalid_fields).join(' ');
			} else {
				err.message = body.message || JSON.stringify(body);
			}
			err.status = error.status;

		} else {
			err.message = error.message || error.toString();
			err.status = error.status;
		}

		return Observable.throw(err);
	}

	authenticateSso(endPoint: string, type: string, assertion: string, orgId?: number): Observable<{}> {
		return this.http.post(
			endPoint,
			JSON.stringify({
				org_id: orgId ? orgId : null,
				grant_type: type,
				assertion: assertion,
				client_id: environment.api.clientId,
				client_secret: environment.api.clientSecret,
				scope: '*'
			}),
			{
				headers: new Headers(this.defaultHeaders)
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}


	post(endpoint: string, params: any, upload = false): Observable<{}> {

		return this.http.post(
			endpoint,
			upload ? params : JSON.stringify(params),
			{
				headers: this.getHeaders(upload)
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

	put(endpoint: string, params: any, upload = false): Observable<{}> {

		return this.http.put(
			endpoint,
			upload ? params : JSON.stringify(params),
			{
				headers: this.getHeaders(upload)
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

	get(endpoint: string, params?: any): Observable<{}> {
		let qs = '';

		if (params) {
			qs = '?' + this.util.toQueryStringParams(params);
		}

		return this.http.get(
			endpoint,
			{
				headers: this.getHeaders()
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

	delete(endpoint: string, params?: any): Observable<{}> {

		let qs = '';

		if (params) {
			qs = '?' + this.util.toQueryStringParams(params);
		}

		return this.http.delete(
			endpoint,
			{
				headers: this.getHeaders()
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

	ssoToken(endpoint: string, params: any): Observable<{}> {

		return this.http.post(
			endpoint,
			params,
			{
				headers: new Headers({
					'Content-Type': 'multipart/form-data',
					'accept': '*/*'
				})
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

}
