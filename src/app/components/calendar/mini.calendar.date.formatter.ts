import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Injectable } from "@angular/core";

@Injectable()
export class MiniCalendarDateFormatter extends CalendarDateFormatter {

    public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
        return new DatePipe(locale).transform(date, 'E', locale);
    }

    public monthViewTitle({ date, locale }: DateFormatterParams): string {
        return new DatePipe(locale).transform(date, 'MMM yyyy', locale);
    }
}
