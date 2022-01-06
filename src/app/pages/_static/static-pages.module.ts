import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrivacyPolicyPage } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsPage } from './terms-and-conditions/terms-and-conditions.component';
import { CorporatePolicyPage } from './corporate-policy/corporate-policy.component';

@NgModule({
	declarations: [
		PrivacyPolicyPage,
		TermsAndConditionsPage,
		CorporatePolicyPage
	],
	imports: [
		FormsModule,
		RouterModule
	],
	exports: [
		PrivacyPolicyPage,
		TermsAndConditionsPage,
		CorporatePolicyPage,
	],
	entryComponents: [
		PrivacyPolicyPage,
		TermsAndConditionsPage,
		CorporatePolicyPage
	],
	providers: [
	]
})
export class StaticPagesModule { }
