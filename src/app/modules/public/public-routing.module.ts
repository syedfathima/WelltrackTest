import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { PrivacyPolicyPage } from "../../pages/_static/privacy-policy/privacy-policy.component";
import { CorporatePolicyPage } from "../../pages/_static/corporate-policy/corporate-policy.component";
import { TermsAndConditionsPage } from "../../pages/_static/terms-and-conditions/terms-and-conditions.component";
import { ChallengePublicListing } from "./challenge-public-listing/challenge-public-listing";
import { ChallengePublicDetails } from "./challenge-public-details/challenge-public-details";
import { PaymentIntroPage } from "./payment-intro/payment-intro";
import { RegisterPaymentPage } from "./register-payment/register-payment";
import { UnsubscribePage } from "./unsubscribe/unsubscribe.component";

const publicRoutes = [
	{
		path: "privacy-policy",
		component: PrivacyPolicyPage,
		data: { title: "privacypolicy" },
	},
	{
		path: "terms-and-conditions",
		component: TermsAndConditionsPage,
		data: { title: "termsandconditions" },
	},
	{
		path: "corporate-policy",
		component: CorporatePolicyPage,
		data: { title: "corporatepolicy" },
	},
	{
		path: "medical-resources",
		component: TermsAndConditionsPage,
		data: { title: "medicalresources" },
	},
	{
		path: "challenges",
		component: ChallengePublicListing,
		data: { title: "challengelisting" },
	},
	{
		path: 'challenges/:id',
		component: ChallengePublicDetails,
		data: { title: 'challengedetails' }
	},
	{
		path: 'subscribe/luminohealth',
		component: PaymentIntroPage,
		data: { title: 'payment' }
	},
	{
		path: 'purchase/:promo',
		component: RegisterPaymentPage,
		data: { title: 'payment' }
	},
	{
		path: 'unsubscribe',
		component: UnsubscribePage,
		data: { title: 'unsubscribe' }
	}

];

@NgModule({
	imports: [RouterModule.forChild(publicRoutes)],
	exports: [RouterModule],
})
export class PublicRoutingModule {}
