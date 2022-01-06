import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ThoughtDiaryDetailsPage } from './thoughtdiary-details.component';

describe('ThoughtDiaryDetailsPage', () => {
	let component: ThoughtDiaryDetailsPage;
	let fixture: ComponentFixture<ThoughtDiaryDetailsPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ThoughtDiaryDetailsPage]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ThoughtDiaryDetailsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
