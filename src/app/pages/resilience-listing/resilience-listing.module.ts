import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResilienceListingPage } from './resilience-listing';

@NgModule({
  declarations: [ ResilienceListingPage ],
  exports: [ ResilienceListingPage ],
  imports: [ CommonModule ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CustomModule {}
