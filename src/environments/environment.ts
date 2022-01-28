// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	demo: false,
	domain: 'http://127.0.0.1:8000',
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
	logLevel: 1,
	firebaseConfig : {
		apiKey: "AIzaSyB4_35bvG7J58MaxnKdGp19tw2YPJV_szM",
		authDomain: "fir-chat-609bd.firebaseapp.com",
		databaseURL: "https://fir-chat-609bd-default-rtdb.firebaseio.com",
		projectId: "fir-chat-609bd",
		storageBucket: "fir-chat-609bd.appspot.com",
		messagingSenderId: "473435309709",
		appId: "1:473435309709:web:27e8954dde0233710e84c4"
	  }
	// tslint:disable-next-line:max-line-length
};

