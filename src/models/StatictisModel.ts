/** @format */

import { ReactNode } from 'react';

export interface StatisticModel {
	key: string;
	description: string;
	value: number;
	valueType: 'number' | 'curency';
	type?: 'horizontal' | 'vertical';
	icon: ReactNode;
	color: string;
}
