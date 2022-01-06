import { browser, by, element } from 'protractor';

export class WebAppPage {
	navigateTo() {
		return browser.get('/');
	}

	// getParagraphText() {
	//   return element(by.css('app .logo img')).getAttribute('alt');
	// }

	getTitle() {
		return browser.getTitle();
	}

}

export class LoginHandler {

	waitForUrlToChangeTo(urlToMatch) {
		let currentUrl;
		return browser.getCurrentUrl().then(function storeCurrentUrl(url) {
			currentUrl = url;
		})
			.then(function waitForUrlToChangeTo() {
				browser.ignoreSynchronization = true;
				return browser.wait(function waitForUrlToChangeTo() {
					return browser.getCurrentUrl().then(function compareCurrentUrl(url) {
						browser.ignoreSynchronization = false;
						return url.indexOf(urlToMatch) !== -1;
					});
				});
			}
			);
	}

	login(username, password, url) {
		browser.get('/');
		element(by.css('input[type="email"]')).sendKeys(username);
		element(by.css('input[type="password"]')).sendKeys(password);
		element(by.css('.btn.btn-primary')).click();
		return this.waitForUrlToChangeTo(url);
	}

	logout() {
		browser.get('/app');
		element(by.css('.btn.btn-white')).click();
		return this.waitForUrlToChangeTo('/');
	}
}
