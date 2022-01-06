
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
// import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import * as _ from 'lodash';

// Import RxJs required methods



import { UtilityService } from './utility.service';
import { StorageService } from './storage.service';
//import { Env } from '../env/env.token';
import { LogService } from './log.service';
import { ModalService } from './modal.service';

import { environment } from '../../environments/environment';
import { ApiError } from './api-error';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ApiService {

	demoMode: boolean;

	private defaultHeaders: any;

	constructor(
		private http: HttpClient,
		private util: UtilityService,
		private storage: StorageService,
		private log: LogService,
		private translate: TranslateService,
		private utilityService: UtilityService,
		private modalService: ModalService) {
		this.log.trace('Api Loaded');
		this.demoMode = this.utilityService.isDemoMode();

	}

	private getHeaders(authenticate = true, upload = false) {
		let additionalHeaders = {};

		if (authenticate) {
			additionalHeaders = { 'Authorization': 'Bearer ' + this.storage.get('accessToken'), 'X-Localization': this.translate.getDefaultLang(), 'X-Application': 'web' };

		}
		else {
			additionalHeaders = { 'X-Localization': this.translate.currentLang, 'X-Application': 'web' };
		}

		if (upload) {
			this.defaultHeaders = {
				//'Content-Type': 'multipart/form-data' 
			};
		}
		else {
			this.defaultHeaders = {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json; charset=UTF-8',
			};
		}

		return new HttpHeaders(
			_.assign({}, this.defaultHeaders, additionalHeaders)
		);
	}

	private handleResponse(res: HttpResponse<Object>) {
		return res;
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

	private handleError(error: HttpErrorResponse | any) {
		let err = new ApiError('An unknown error occured');


		//this.log.debug('ERROR', error);

		if (error instanceof HttpErrorResponse) {
			const body = error.error || '';
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

		return observableThrowError(err);
	}


	authenticate(username: string, password: string): Observable<{}> {
		return this.http.post(
			`${environment.api.endpoint}/oauth/token`,
			JSON.stringify({
				username: username,
				password: password,
				grant_type: 'password',
				client_id: environment.api.clientId,
				client_secret: environment.api.clientSecret,
				scope: '*'
			}),
			{
				headers: this.getHeaders(false)
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

	authenticateSso(type: string, assertion: string, orgId?: number): Observable<{}> {
		return this.http.post(
			`${environment.api.endpoint}/oauth/token`,
			JSON.stringify({
				org_id: orgId ? orgId : null,
				grant_type: type,
				assertion: assertion,
				client_id: environment.api.clientId,
				client_secret: environment.api.clientSecret,
				scope: '*'
			}),
			{
				headers: this.getHeaders(false)
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

	authenticateOauth2AuthFlow(endpointUrl: string, clientId: string, code: string, redirect_uri: string, code_verifier: string): Observable<{}> {
		return this.http.post(
			`${environment.api.endpoint}/oauth/token`,
			JSON.stringify({
				grant_type: 'ssoAuthorization',
				payload: {
					end_point_url: endpointUrl,
					client_id: clientId,
					code: code,
					code_verifier: code_verifier,
					redirect_uri: redirect_uri
				},
				client_id: environment.api.clientId,
				client_secret: environment.api.clientSecret,
				scope: '*'
			}),
			{
				headers: this.getHeaders(false)
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

	fbAuthenticate(accessToken: string): Observable<{}> {

		return this.http.post(
			`${environment.api.endpoint}/oauth/token`,
			JSON.stringify({
				Token: accessToken,
				grant_type: 'social',
				client_id: environment.api.clientId,
				client_secret: environment.api.clientSecret,
				scope: 'basic'
			}),
			{
				headers: this.getHeaders(false)
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

	post(endpoint: string, params: any, authenticate = true, upload = false): Observable<{}> {

		if (this.demoMode) {
			this.modalService.showAlert('Demo mode', 'The demo site is for display purposes only. Saving of any data has been disabled');
			return;
		}
		return this.http.post(
			`${environment.api.endpoint}/${endpoint}`,
			JSON.stringify(params),
			{
				headers: this.getHeaders(authenticate, upload)
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

	file(endpoint: string, params: any, authenticate = true): Observable<{}> {

		if (this.demoMode) {
			this.modalService.showAlert('Demo mode', 'The demo site is for display purposes only. Saving of any data has been disabled');
			return;
		}



		return this.http.post(
			`${environment.api.endpoint}/${endpoint}`,
			params,
			{
				headers: this.getHeaders(authenticate, true)
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

	put(endpoint: string, params: any, authenticate = true, upload = false): Observable<{}> {
		if (this.demoMode) {
			this.modalService.showAlert('Demo mode', 'The demo site is for display purposes only. Saving of any data has been disabled');
			return;
		}

		return this.http.put(
			`${environment.api.endpoint}/${endpoint}`,
			JSON.stringify(params),
			{
				headers: this.getHeaders(authenticate, upload)
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}

	get(endpoint: string, params?: any, authenticate = true): Observable<{}> {
		let qs = '';

		if (params) {
			qs = '?' + this.util.toQueryStringParams(params);
		}

		return this.http.get(
			`${environment.api.endpoint}/${endpoint}${qs}`,
			{
				headers: this.getHeaders(authenticate)
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
			`${environment.api.endpoint}/${endpoint}${qs}`,
			{
				headers: this.getHeaders()
			}
		)
			.map(this.handleResponse)
			.catch(this.handleError);
	}


}
