import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZenRoomPage } from './zen-room.component';

describe('ZenRoomPage', () => {
	let component: ZenRoomPage;
	let fixture: ComponentFixture<ZenRoomPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ZenRoomPage]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ZenRoomPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
