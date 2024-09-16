/** @format */

import { Table } from 'antd';
import { useEffect, useState } from 'react';
import handleAPI from '../../apis/handleAPI';
import { ProductModel } from '../../models/Products';
const Inventories = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [products, setProducts] = useState<ProductModel[]>([]);

	useEffect(() => {
		getProducts();
	}, []);

	const getProducts = async () => {
		setIsLoading(true);
		try {
			const res = await handleAPI('/products');
			setProducts(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	/*
		title,
		description
		categories,
		colors
		size
		price,
		comments
		buys
		stocks
		actions
		images
	*/

	return (
		<div>
			<Table dataSource={products} columns={[]} loading={isLoading} />
		</div>
	);
};

export default Inventories;
