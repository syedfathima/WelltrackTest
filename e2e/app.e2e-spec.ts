import { WebAppPage } from './app.po';

describe('App', () => {
  let page: WebAppPage;

  beforeEach(() => {
	page = new WebAppPage();
  });

  it('should load', () => {
	page.navigateTo();
	expect(page.getTitle()).toEqual('WellTrack');
  });
});
