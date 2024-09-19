/** @format */

export interface CategoyModel {
	_id: string;
	title: string;
	parentId: string;
	slug: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface ProductModel {
	_id: string;
	title: string;
	slug: string;
	description: string;
	categories: string[];
	supplier: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	isDeleted: boolean;
	subItems: SubProductModel[];
}

export interface SubProductModel {
	size: string;
	color: string;
	price: number;
	qty: number;
	productId: string;
	images: any[];
	_id: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}
