import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
	transform(value: string, limitStr: string): string {
		let limit = parseInt(limitStr, 10);
		let trail = '...';

		return value.length > limit ? value.substring(0, limit) + trail : value;
	}
}
