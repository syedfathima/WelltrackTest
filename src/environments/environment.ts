// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	demo: false,
	domain: 'staging.welltrack.com',
	api: {
		endpoint: 'https://api.welltrack.com', // 'http://127.0.0.1:8000/api/v2'
		clientId: 2,
		clientSecret: 'tHNTir1jxDTG8o03K0dvaRMm1ljPiO9f1ip4xm0g'
	},
	video: {
		api_key: '45811332',
		secret: '580065157cbf46031441eac753a7d968baa00ec3'
	},
	stripe: {
		api_key: 'pk_test_kucICdCOP6D0UQ90zrr40Oyi'
	},
	ssoReturnEndPoint: {
		url: 'sso/canada'
	},
	logLevel: 1
	// tslint:disable-next-line:max-line-length
};

