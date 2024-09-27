/** @format */

import { Button } from 'antd';
import axios from 'axios';
import { replaceName } from '../../utils/replaceName';
import { useState } from 'react';
import handleAPI from '../../apis/handleAPI';

const ProductDetail = () => {
	const [isLoading, setIsLoading] = useState(false);

	const handleFakeProduct = async () => {
		const api = `https://fakestoreapi.com/products`;
		setIsLoading(true);
		try {
			const res = await axios(api);

			if (res.status === 200 && res.data) {
				const data = res.data;

				data.forEach(async (item: any) => await handleAddDemoData(item));
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
			console.log('Done');
		}
	};

	const handleAddDemoData = async (item: any) => {
		const api = `/products/add-new`;

		const data = {
			title: item.title,
			slug: replaceName(item.title),
			description: item.description,
			images: [item.image],
			categories: ['66f3c241d77ff9a6b618ceb5'],
			supplier: '66d47670a6d4f4e9f09d12aa',
		};

		await handleAPI(api, data, 'post');
		console.log('Added product!!');
	};

	return (
		<div>
			<Button loading={isLoading} onClick={handleFakeProduct}>
				Face Product
			</Button>
		</div>
	);
};

export default ProductDetail;
