/** @format */

export interface BillModel {
	_id: string;
	products: Product[];
	total: number;
	status: number;
	customer_id: string;
	shippingAddress: ShippingAddress;
	paymentStatus: number;
	paymentMethod: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface Product {
	_id: string;
	createdBy: string;
	count: number;
	cost: number;
	subProductId: string;
	image: string;
	size: string;
	color: string;
	price: number;
	qty: number;
	productId: string;
	title: string;
	__v: number;
}

export interface ShippingAddress {
	address: string;
	_id: string;
}

export const BillStatus = ['pending', 'shipping', 'success', 'cancel'];
export const BillStatusColor = ['warning', 'processing', 'success', 'error'];
