import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardPage } from './dashboard.component';
import { TestingModule } from '../../testing.module';


describe('DashboardPage', () => {
	let component: DashboardPage;
	let fixture: ComponentFixture<DashboardPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [DashboardPage],
			imports: [
				TestingModule
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
