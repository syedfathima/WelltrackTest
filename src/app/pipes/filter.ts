import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filter',
	pure: false
})
@Injectable()
export class FilterPipe implements PipeTransform {
	transform(items: any[], field: string, value: any): any[] {
		if (!items) {
			return []
		};
		return items.filter(it => it[field] === value);
	}
}
