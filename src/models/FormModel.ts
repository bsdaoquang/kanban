/** @format */

import { FormLayout } from 'antd/es/form/Form';

export interface FormModel {
	title: string;
	layout?: FormLayout;
	labelCol: number;
	wrapperCol: number;
	formItems: FormItemModel[];
}

export interface FormItemModel {
	key: string;
	value: string;
	label: string;
	placeholder: string;
	type: 'default' | 'select' | 'number' | 'email' | 'tel' | 'file' | 'checkbox';
	lockup_item: SelectModel[];
	required: boolean;
	message: string;
	default_value: string;
}

export interface SelectModel {
	label: string;
	value: string;
}

export interface TreeModel {
	label: string;
	value: string;
	children?: SelectModel[];
}
