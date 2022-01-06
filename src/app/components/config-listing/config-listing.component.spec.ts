import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigListingComponent } from './config-listing.component';

describe('ConfigListingComponent', () => {
  let component: ConfigListingComponent;
  let fixture: ComponentFixture<ConfigListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
