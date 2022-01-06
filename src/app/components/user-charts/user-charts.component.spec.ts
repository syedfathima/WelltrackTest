import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserChartsComponent } from './user-charts.component';

describe('UserChartsComponent', () => {
	let component: UserChartsComponent;
	let fixture: ComponentFixture<UserChartsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UserChartsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserChartsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
