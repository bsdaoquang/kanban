/** @format */

import { Button, Card, ColorPicker, Table } from 'antd';
import React, { useState } from 'react';
import { AddSubProductModal } from '../../modals';
import { SubProductModel } from '../../models/Products';
import { ColumnProps } from 'antd/es/table';
import { authSeletor } from '../../redux/reducers/authReducer';
import { useSelector } from 'react-redux';
import handleAPI from '../../apis/handleAPI';

interface ItemProps extends SubProductModel {
	product: {
		label: string;
		value: string;
	};
}

const AddOrder = () => {
	const [isVisibleAddSubProduct, setIsVisibleAddSubProduct] = useState(false);
	const [subProducts, setSubProducts] = useState<ItemProps[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const auth = useSelector(authSeletor);

	const columns: ColumnProps<ItemProps>[] = [
		{
			key: '#',
			align: 'center',
			title: '#',
			dataIndex: '',
			render: (text, record, index) => index + 1,
			width: 50,
		},
		{
			key: 'title',
			title: 'Title',
			dataIndex: 'product',
			render: (text, record) => record.product?.label,
		},
		{
			key: 'color',
			dataIndex: 'color',
			title: 'Color',
			render: (val) => (
				<ColorPicker disabled value={val} style={{ border: 'none' }} />
			),
		},
		{
			key: 'size',
			dataIndex: 'size',
			title: 'Size',
		},
		{
			key: 'quantity',
			dataIndex: 'qty',
			title: 'Quantity',
		},
		{
			key: 'price',
			dataIndex: 'price',
			title: 'Price',
		},
		{
			key: 'cost',
			dataIndex: 'cost',
			title: 'Cost',
		},
		{
			key: 'total',
			dataIndex: '',
			title: 'Total',
			render: (text, record) => record.qty * record.price,
		},
	];

	const handleAddOrder = async () => {
		// const api = `/orders/add`;

		// /*
		//   {
		// 		product_id: { type: String, required: true, ref: 'Product' },
		// 		total: { type: Number, required: true },
		// 		price: { type: Number, required: true },
		// 		quantity: { type: Number, required: true },
		// 		subProduct_id: { type: String, required: true, ref: 'SubProduct' },
		// 		cost: { type: Number, required: true },
		// 		status: { type: String, required: true },
		// 	},
		// */
		// const data = {
		// 	user_id: auth._id,
		// 	items: subProducts.map((item: any) => {
		//     item.product_id = item.productId;
		//     item.total = item.qty * item.cost
		//     item.status = 'pending';

		// 		delete item.product;
		//     delete item.productId;

		// 		return item;
		// 	}),
		// };

		// console.log(data);

		// tạo 1 subproduct mới
		// lấy id subproduct
		// tạo order mới

		setIsLoading(true);
		try {
			const promises = subProducts.map(async (item: any) => {
				delete item.product;
				const api = `/products/add-sub-product`;
				const res = await handleAPI(api, item, 'post');
				return {
					...item,
					subProduct_id: res.data._id,
					total: item.qty * item.cost,
					status: 'done',
					quantity: item.qty,
					product_id: item.productId,
				};
			});

			const items = await Promise.all(promises);

			const data = {
				items,
				user_id: auth._id,
				total: items.reduce((acc, item) => acc + item.total, 0),
			};

			const result = await handleAPI(`/orders/add`, data, 'post');

			console.log(result);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container py-5'>
			<Card
				title='Add new orders'
				extra={
					<Button
						type='primary'
						onClick={() => setIsVisibleAddSubProduct(true)}>
						Add product
					</Button>
				}>
				<Table
					loading={isLoading}
					size='small'
					columns={columns}
					dataSource={subProducts}
				/>

				<div className=''>
					<Button
						loading={isLoading}
						onClick={handleAddOrder}
						type='primary'
						className='px-5'>
						Submit
					</Button>
				</div>
			</Card>

			<AddSubProductModal
				// product={}
				visible={isVisibleAddSubProduct}
				onClose={() => {
					setIsVisibleAddSubProduct(false);
				}}
				onAddNew={async (val: any) => {
					setIsVisibleAddSubProduct(false);

					const index = subProducts.findIndex(
						(element) =>
							element.product.value === val.product.value &&
							element.color === val.color &&
							element.size === val.size
					);

					if (index !== -1) {
						const item: ItemProps = subProducts[index];
						item.qty += val.qty;
						item.price = val.price;
						item.cost = val.cost;

						const newSubProducts = [...subProducts];
						newSubProducts[index] = item;
						setSubProducts(newSubProducts);
					} else {
						setSubProducts([...subProducts, val]);
					}
				}}
			/>
		</div>
	);
};

export default AddOrder;
