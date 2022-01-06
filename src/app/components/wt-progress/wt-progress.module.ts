import { NgModule } from '@angular/core';
//import { IonicPageModule } from 'ionic-angular';
import { WtProgress } from './wt-progress';

@NgModule({
	declarations: [
		WtProgress,
	],
	imports: [
		//IonicPageModule.forChild(WtProgress),
	],
	exports: [
		WtProgress
	]
})
export class WtProgressModule { }
