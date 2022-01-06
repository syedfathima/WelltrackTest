import { browser, by, element } from 'protractor';
import { LoginHandler } from './app.po';

describe('Login', () => {
	let button = element(by.css('.btn.btn-primary'));

	let email = element(by.css('input[type="email"]'));
	let password = element(by.css('input[type="password"]'));


	beforeEach(() => {
		browser.get('/');
	});

	it('should load', () => {
		expect(browser.getTitle()).toEqual('WellTrack');

	});


	it('should fail on empty sign in', () => {
		button.click().then(function () {
			expect(element(by.css('.error')).getText()).toEqual('Error');
		});
	});

	it('should navigate to forget your password', () => {
		element(by.linkText('Forgot Password?')).click().then(function () {
			expect(element(by.linkText('Sign In')).getText()).toEqual('Sign In');
		});
	});

	it('should open fb window', () => {
		element(by.css('.btn.btn-facebook')).click().then(function () {
			browser.getAllWindowHandles().then(function (handles) {
				browser.ignoreSynchronization = true;
				browser.switchTo().window(handles[1]);

				let homeButton = element(by.id('homelink'));
				expect(homeButton.getText()).toEqual('Facebook');
			});
		});
	});

	it('should log on', () => {
		let page = new LoginHandler();


		page.login('test@email.com', 'test-password', '/access-code').then(function () {
			expect(element(by.css('.btn.btn-primary')).getText()).toEqual('Pair with organization');
			browser.manage().deleteAllCookies();
			browser.executeScript('window.sessionStorage.clear(); window.localStorage.clear();')
		})
	});




});

