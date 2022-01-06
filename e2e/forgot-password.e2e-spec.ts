import { browser, by, element } from 'protractor';
import { LoginHandler } from './app.po';

describe('Forgot-Password', () => {
	let button = element(by.css('.btn.btn-primary'));

	let email = element(by.css('input[type="email"]'));
	let password = element(by.css('input[type="password"]'));


	beforeEach(() => {
		browser.get('/');
		//browser.waitForAngular();
	});


	it('should navigate to forget your password', () => {
		let forgotLink = element(by.linkText('Forgot Password?'));

		forgotLink.click().then(function () {
			expect(element(by.linkText('Sign In')).getText()).toEqual('Sign In');
		});
	});

	it('should return to frontpage', () => {
		let forgotLink = element(by.linkText('Forgot Password?'));

		forgotLink.click().then(function () {
			let signLink = element(by.linkText('Sign In'));
			signLink.click().then(function () {
				expect(element(by.css('.btn.btn-primary')).getText()).toEqual('Sign In');

			})
		});
	});

	it('empty email fails', () => {
		let forgotLink = element(by.linkText('Forgot Password?'));

		forgotLink.click().then(function () {
			email.sendKeys('');
			let sendButton = element(by.linkText('Send me an email'));
			sendButton.click().then(function () {
				expect(element(by.css('.error')).getText()).toEqual('Oops!');

			})
		});
	});

});

