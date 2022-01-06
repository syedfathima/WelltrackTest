import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrivacyPolicyPage } from './privacy-policy.component';

describe('PrivacyPolicyPage', () => {
  let component: PrivacyPolicyPage;
  let fixture: ComponentFixture<PrivacyPolicyPage>;

  beforeEach(waitForAsync(() => {
	TestBed.configureTestingModule({
		declarations: [ PrivacyPolicyPage ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(PrivacyPolicyPage);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should be created', () => {
	expect(component).toBeTruthy();
  });
});
