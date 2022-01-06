import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FunAchievementDetailsComponent } from './fun-achievement-details.component';

describe('FunAchievementDetailsComponent', () => {
	let component: FunAchievementDetailsComponent;
	let fixture: ComponentFixture<FunAchievementDetailsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [FunAchievementDetailsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FunAchievementDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
