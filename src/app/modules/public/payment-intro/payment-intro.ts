import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'payment-intro-page',
	templateUrl: 'payment-intro.html',
	styleUrls: ['./payment-intro.scss']
})
export class PaymentIntroPage implements OnInit {

	constructor(
		private translate: TranslateService) {

	}

	ngOnInit() {
		this.translate.stream('signUp').subscribe((res: any) => {

		});

	}
}