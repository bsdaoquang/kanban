/** @format */

import { Avatar, Button, QRCode, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import handleAPI from '../../apis/handleAPI';
import { ProductModel } from '../../models/Products';
import { ColumnProps } from 'antd/es/table';
import CategoryComponent from '../../components/CategoryComponent';
import { MdLibraryAdd } from 'react-icons/md';
import { colors } from '../../constants/colors';
import { AddSubProductModal } from '../../modals';
const Inventories = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [products, setProducts] = useState<ProductModel[]>([]);
	const [isVisibleAddSubProduct, setIsVisibleAddSubProduct] = useState(false);
	const [productSelected, setProductSelected] = useState<ProductModel>();

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

	const columns: ColumnProps<ProductModel>[] = [
		{
			key: 'title',
			dataIndex: 'title',
			title: 'Title',
		},
		{
			key: 'description',
			dataIndex: 'description',
			title: 'description',
		},
		{
			key: 'categories',
			dataIndex: 'categories',
			title: 'categories',
			render: (ids: string[]) => (
				<Space>
					{ids.map((id) => (
						<CategoryComponent id={id} />
					))}
				</Space>
			),
		},
		{
			key: 'images',
			dataIndex: 'images',
			title: 'Images',
			render: (imgs: string[]) =>
				imgs &&
				imgs.length > 0 && (
					<Space>
						<Avatar.Group>
							{imgs.map((img) => (
								<Avatar src={img} size={40} />
							))}
						</Avatar.Group>
					</Space>
				),
		},
		{
			key: 'actions',
			title: 'Actions',
			dataIndex: '',
			fixed: 'right',
			render: (item: ProductModel) => (
				<Space>
					<Tooltip title='Add sub product'>
						<Button
							icon={<MdLibraryAdd color={colors.primary500} size={20} />}
							type='text'
							onClick={() => {
								setProductSelected(item);
								setIsVisibleAddSubProduct(true);
							}}
						/>
					</Tooltip>
				</Space>
			),
			align: 'right',
		},
	];

	/*
		sub product

		color
		size? 
		price
		qty

	*/

	return (
		<div>
			<Table
				dataSource={products}
				columns={columns}
				loading={isLoading}
				scroll={{
					x: '100%',
				}}
			/>

			<AddSubProductModal
				product={productSelected}
				visible={isVisibleAddSubProduct}
				onClose={() => {
					setProductSelected(undefined);
					setIsVisibleAddSubProduct(false);
				}}
			/>
		</div>
	);
};

export default Inventories;
