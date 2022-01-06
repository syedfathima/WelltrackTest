import { browser, by, element } from 'protractor';
import { LoginHandler } from './app.po';

describe('Access-Code', () => {
	let button = element(by.css('.btn.btn-primary'));

	let email = element(by.css('input[type="email"]'));
	let password = element(by.css('input[type="password"]'));


	beforeEach(() => {
		browser.get('/');
		//browser.waitForAngular();
	});

	afterEach(function () {
		browser.manage().deleteAllCookies();
		browser.executeScript('window.sessionStorage.clear(); window.localStorage.clear();')
	});


	it('should fail on improper access code', () => {
		let page = new LoginHandler();
		page.login('test@email.com', 'test-password', '/access-code').then(function () {
			let code = element(by.css('input[type="text"]'));
			code.sendKeys('eroginsert');
			let codeButton = element(by.css('.btn.btn-primary'));
			codeButton.click().then(function () {
				expect(element(by.css('.error')).getText()).toEqual('Error');
			});
		})
	});

	it('should fail on empty access code', () => {
		let page = new LoginHandler();
		page.login('test@email.com', 'test-password', '/access-code').then(function () {
			let code = element(by.css('input[type="text"]'));
			code.sendKeys('');
			let codeButton = element(by.css('.btn.btn-primary'));
			codeButton.click().then(function () {
				expect(element(by.css('.error')).getText()).toEqual('Oops!');
			});
		})
	});

	it('should fail on empty email-access', () => {
		let page = new LoginHandler();
		page.login('test@email.com', 'test-password', '/access-code').then(function () {
			element(by.linkText('I don\'t know my access code')).click().then(function () {
				let code = element(by.css('input[type="email"]'));
				code.sendKeys('');
				let codeButton = element(by.css('.btn.btn-primary'));
				codeButton.click().then(function () {
					expect(element(by.css('.error')).getText()).toEqual('Error');
				});
			});
		})
	});

	it('should  fail on improper email-access', () => {
		let page = new LoginHandler();
		page.login('test@email.com', 'test-password', '/access-code').then(function () {
			element(by.linkText('I don\'t know my access code')).click().then(function () {
				let code = element(by.css('input[type="email"]'));
				code.sendKeys('thise@bad.comeroginsert');
				let codeButton = element(by.css('.btn.btn-primary'));
				codeButton.click().then(function () {
					expect(element(by.css('.error')).getText()).toEqual('Error');
				});
			});
		})
	});

	it('should allow user to skip access code, and email-access', () => {
		let page = new LoginHandler();
		page.login('test@email.com', 'test-password', '/access-code').then(function () {
			element(by.linkText('I don\'t know my access code')).click().then(function () {
				element(by.linkText('Skip for now')).click().then(function () {
					expect(element(by.linkText('Start using WellTrack')).getText()).toEqual('Start using WellTrack');
				});
			});
		})
	});
});
