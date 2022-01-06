import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssessmentsPage } from './assessments';

describe('PracticeComponent', () => {
	let component: AssessmentsPage;
	let fixture: ComponentFixture<AssessmentsPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [AssessmentsPage]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssessmentsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
