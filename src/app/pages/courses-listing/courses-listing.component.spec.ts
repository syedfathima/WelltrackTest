import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CoursesListingComponent } from './courses-listing.component';

describe('CoursesListingComponent', () => {
  let component: CoursesListingComponent;
  let fixture: ComponentFixture<CoursesListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CoursesListingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
