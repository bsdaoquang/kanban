/** @format */

export interface PromotionModel {
	_id: string;
	title: string;
	description: string;
	code: string;
	value: number;
	numOfAvailable: number;
	type: string;
	startAt: string;
	endAt: string;
	imageURL: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}
