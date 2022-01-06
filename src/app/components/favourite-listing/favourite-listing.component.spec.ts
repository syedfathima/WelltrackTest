import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteListingComponent } from './favourite-listing.component';

describe('FavouriteListingComponent', () => {
  let component: FavouriteListingComponent;
  let fixture: ComponentFixture<FavouriteListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavouriteListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
