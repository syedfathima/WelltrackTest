import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FunAchievementListingComponent } from './fun-achievement-listing.component';

describe('FunAchievementListingComponent', () => {
	let component: FunAchievementListingComponent;
	let fixture: ComponentFixture<FunAchievementListingComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [FunAchievementListingComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FunAchievementListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
