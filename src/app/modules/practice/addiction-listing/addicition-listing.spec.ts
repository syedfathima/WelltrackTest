import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddictionListingPage } from './addiction-listing';

describe('ThoughtDiaryDetailsPage', () => {
	let component: AddictionListingPage;
	let fixture: ComponentFixture<AddictionListingPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [AddictionListingPage]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddictionListingPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
