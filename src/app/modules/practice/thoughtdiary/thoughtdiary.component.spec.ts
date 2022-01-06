import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ThoughtDiaryListingPage } from './thoughtdiary.component';

describe('ThoughtDiaryListingPage', () => {
	let component: ThoughtDiaryListingPage;
	let fixture: ComponentFixture<ThoughtDiaryListingPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ThoughtDiaryListingPage]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ThoughtDiaryListingPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
