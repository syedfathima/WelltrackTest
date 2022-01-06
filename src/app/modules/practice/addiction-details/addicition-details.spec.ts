import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddictionDetailsPage } from './addiction-details';

describe('ThoughtDiaryDetailsPage', () => {
	let component: AddictionDetailsPage;
	let fixture: ComponentFixture<AddictionDetailsPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [AddictionDetailsPage]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddictionDetailsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
