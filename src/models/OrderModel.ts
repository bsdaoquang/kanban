/** @format */

import { ProductModel, SubProductModel } from './Products';

export interface OrderModel {
	_id: string;
	user_id: string;
	product_id: string;
	total: number;
	quantity: number;
	subProduct_id: string;
	cost: number;
	status: string;
	price: number;
	createdAt: string;
	updatedAt: string;
	__v: number;
	product?: ProductModel;
	subProduct?: SubProductModel;
}
