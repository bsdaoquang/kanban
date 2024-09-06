/** @format */

import { add0toNumber } from './add0toNumber';

export class DateTime {
	static CalendarDate = (val: any) => {
		const date = new Date(val);

		// YYYY/MM/DD
		return `${date.getFullYear()}-${add0toNumber(
			date.getMonth() + 1
		)}-${add0toNumber(date.getDate())}`;
	};
}
