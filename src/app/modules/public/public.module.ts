import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { PublicRoutingModule } from "./public-routing.module";
import { StaticPagesModule } from "../../pages/_static/static-pages.module";
import { ChallengePublicListing } from "./challenge-public-listing/challenge-public-listing";
import { ChallengePublicDetails } from "./challenge-public-details/challenge-public-details";
import { PaymentIntroPage } from "./payment-intro/payment-intro";
import { RegisterPaymentPage } from "./register-payment/register-payment";
import { UnsubscribePage } from "./unsubscribe/unsubscribe.component";

@NgModule({
	declarations: [
		ChallengePublicListing,
		ChallengePublicDetails,
		PaymentIntroPage,
		RegisterPaymentPage,
		UnsubscribePage,
	],
	imports: [
		CommonModule,
		PublicRoutingModule,
		SharedModule,
		StaticPagesModule,
	],
	providers: [],
	exports: [
	],
	entryComponents:[
	],
})
export class PublicModule {}
