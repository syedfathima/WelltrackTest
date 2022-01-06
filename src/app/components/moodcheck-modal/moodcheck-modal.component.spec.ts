import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MoodcheckModalComponent } from './moodcheck-modal.component';

describe('MoodcheckModalComponent', () => {
	let component: MoodcheckModalComponent;
	let fixture: ComponentFixture<MoodcheckModalComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [MoodcheckModalComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MoodcheckModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
