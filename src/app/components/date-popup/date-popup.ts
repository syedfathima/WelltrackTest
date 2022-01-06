import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { DatePickerOptions, DateModel } from '../ng2-datepicker/ng2-datepicker.module';
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment'

@Component({
	selector: 'date-popup',
	templateUrl: './date-popup.html',
	styleUrls: ['./date-popup.scss'],
})
export class DatePopup implements OnInit {
	date: DateModel;
	options: DatePickerOptions;
	@Output() update = new EventEmitter<any>();
	datepickerEvents = new EventEmitter<any>();
	@Input() readOnly = false;
	@Input() initial: Date;
	@Input() test: string;
	canShow: boolean;
	dateFormatted: string;

	constructor(private translate: TranslateService) {
		this.options = new DatePickerOptions();
		this.options.locale = translate.currentLang;

		this.canShow = true;
	}

	ngOnInit() {
		this.translate.stream('lang').subscribe((res: any) => {
			this.options.locale = res;
			this.canShow = false;
			setTimeout(() => {
				this.canShow = true;
			}, 0);
		});
		this.translate.stream('datePicker').subscribe((res: any) => {
			this.options.clearText = res.clear;
			this.options.todayText = res.today;
			this.options.selectYearText = res.select;
		});

		if(this.initial){
			this.setInitial(new Date(this.initial));
		}
		else{
			this.setInitial(new Date());
		}

	}

	setInitial(date: Date) {
		this.options.initialDate = date;
	}

	onPick($event) {
		if ($event.type === 'dateChanged') {
			this.update.emit({
				date: new Date($event.data.formatted)
			});
			this.dateFormatted = $event.data.formatted; 
		}

	}

	onToggle() {
		if (!this.readOnly) {
			this.datepickerEvents.emit({
				type: 'action',
				data: 'toggle'
			})
		}
	}

	toggleReadOnly() {
		this.readOnly = !this.readOnly;
	}
}
