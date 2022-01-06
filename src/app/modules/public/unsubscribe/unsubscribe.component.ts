import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-unsubscribe',
	templateUrl: './unsubscribe.component.html',
	styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribePage implements OnInit {
	title: string;
	message: string;

	constructor(private translate: TranslateService) { }

	ngOnInit() {
		this.translate.stream('unsubscribe').subscribe((res: any) => {
			this.title = res.title;
			this.message = res.message
		});
	}

}
