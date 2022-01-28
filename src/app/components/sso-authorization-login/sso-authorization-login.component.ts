import { Component, ViewChild, ViewEncapsulation, OnInit, Inject, Input } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { UserService } from '../../lib/user.service';
import { SsoService } from '../../lib/sso.service';
import { variable } from '@angular/compiler/src/output/output_ast';

const endPointUrls = {
	'wtcTesting': 'https://health-canada-test.grnspace.co/oauth2/authorize',
	'wtcStaging': 'https://health-canada-test.grnspace.co/oauth2/authorize',
	'wtcProd': 'https://ca.portal.gs/oauth2/authorize'
};

//testing params
const envParams = {
	'wtcTesting': {
		client_id: 'health-canada-demo-pkce',
		code_challenge_method: 'S256',
		response_type: 'code',
		redirect_uri: 'https://grnspace.github.io/wtc-oidc-client/oidc/',
		scope: 'openid email',
		code_challenge: '4n8lM-b0cQnITX2Gy0mfviaQv_fYhU0pzEGJr7HeA-o',
		response_mode: 'query'
	},
	'wtcStaging': {
		client_id: 'AYdN2kwF5SaA1QOj1hlPvigRlIGmgl71u10dXPRU',
		code_challenge_method: 'S256',
		response_type: 'code',
		redirect_uri: 'https://staging.welltrack.com/sso/canada',
		scope: 'openid email',
		response_mode: 'query'
	},
	'wtcProd': {
		client_id: 'AYdN2kwF5SaA1QOj1hlPvigRlIGmgl71u10dXPRU',
		code_challenge_method: 'S256',
		response_type: 'code',
		redirect_uri: 'https://canada.welltrack.com/sso/canada',
		scope: 'openid email',
		response_mode: 'query'
	}
};

@Component({
	selector: 'sso-authorization-login',
	templateUrl: 'sso-authorization-login.component.html',
	styleUrls: ['./sso-authorization-login.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SsoAuthorizationLoginComponent implements OnInit {
	
	href: string;
	prodParams: Object;
	params: Object;
	testUrl: string;
	stagingUrl: string; 
	@Input() ssoParams: Object;

	constructor(
		private log: LogService,
		private userService: UserService,
		private ssoService: SsoService,
		private apiService: ApiService,
		private storageService: StorageService
	) {
	
	}

	ngOnInit() {
		//const mode = 'wtcTesting';
		const mode = 'wtcStaging';
		//const mode = 'wtcProd';
		var endPointUrl:string = ''; 
		var endPointParams:Object; 
		if(this.ssoParams !== undefined){
			endPointParams = {
				client_id: this.ssoParams['ClientID'],
				code_challenge_method: 'S256',
				response_type: 'code',
				redirect_uri: this.ssoParams['RedirectUrl'],
				scope: 'openid email',
				response_mode: 'query'
			};
			endPointUrl = this.ssoParams['AuthorizeEndPointUrl'];
			this.href = this.ssoService.createLoginLink(endPointUrl, endPointParams);
		}
		else if(envParams[mode]){
			this.href = this.ssoService.createLoginLink(endPointUrls[mode], envParams[mode]);
		}
		else{
			this.log.debug('Error', 'This login is currently not available. Please contact IT.');
		}
	}

	onLogin(){
	
		this.apiService.post('assertion', {
			code_verifier: this.storageService.get('code_verifier'),
			code_challenge: this.storageService.get('code_challenge')
		}).subscribe(
			(result: any) => {
				window.open(this.href);
			},
			(error: any) => {
				this.log.error('Something went wrong. Please try again');
			}
		);
	}



}
