/** @format */

import {
	Avatar,
	Button,
	message,
	Modal,
	QRCode,
	Space,
	Table,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import handleAPI from '../../apis/handleAPI';
import { ProductModel, SubProductModel } from '../../models/Products';
import { ColumnProps } from 'antd/es/table';
import CategoryComponent from '../../components/CategoryComponent';
import { MdLibraryAdd } from 'react-icons/md';
import { colors } from '../../constants/colors';
import { AddSubProductModal } from '../../modals';
import { Link } from 'react-router-dom';
import { Edit2, Trash } from 'iconsax-react';

const { confirm } = Modal;

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
			// console.log(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const getMinMaxValues = (data: SubProductModel[]) => {
		const nums: number[] = [];

		if (data.length > 0) {
			data.forEach((item) => nums.push(item.price));
		}

		return nums.length > 0
			? `${Math.min(...nums).toLocaleString()} - ${Math.max(
					...nums
			  ).toLocaleString()}`
			: '';
	};

	const hanleRemoveProduct = async (id: string) => {
		const api = `/products/delete?id=${id}`;
		try {
			await handleAPI(api, undefined, 'delete');

			// cach 1: gọi lại api để load lại dữ liệu
			// await getProducts()

			// Cách 2: xoá item ra khỏi mảng, set lại state
			const items = [...products];
			const index = items.findIndex((element) => element._id === id);

			if (index !== -1) {
				items.splice(index, 1);
			}

			setProducts(items);

			message.success('Product removed!!!');
		} catch (error: any) {
			message.error(error.message);
		}
	};

	const columns: ColumnProps<ProductModel>[] = [
		{
			key: 'title',
			dataIndex: '',
			title: 'Title',
			width: 300,
			render: (item: ProductModel) => (
				<Link to={`/inventory/detail/${item.slug}?id=${item._id}`}>
					{item.title}
				</Link>
			),
		},
		{
			key: 'description',
			dataIndex: 'description',
			title: 'description',
			width: 400,
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
			width: 300,
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
			width: 300,
		},
		{
			key: 'colors',
			dataIndex: 'subItems',
			title: 'Color',
			render: (items: SubProductModel[]) => (
				<Space>
					{items.length > 0 &&
						items.map((item, index) => (
							<div
								style={{
									width: 24,
									height: 24,
									backgroundColor: item.color,
									borderRadius: 12,
								}}
								key={`color${item.color}${index}`}
							/>
						))}
				</Space>
			),
			width: 300,
		},
		{
			key: 'sizes',
			dataIndex: 'subItems',
			title: 'Sizes',
			render: (items: SubProductModel[]) => (
				<Space wrap>
					{items.length > 0 &&
						items.map((item) => (
							<Tag key={`size${item.size}`}>{item.size}</Tag>
						))}
				</Space>
			),
			width: 150,
		},
		{
			key: 'price',
			dataIndex: 'subItems',
			title: 'Price',
			render: (items: SubProductModel[]) => (
				<Typography.Text>{getMinMaxValues(items)}</Typography.Text>
			),
			width: 200,
		},
		{
			key: 'stock',
			dataIndex: 'subItems',
			title: 'Stock',
			render: (items: SubProductModel[]) =>
				items.reduce((a, b) => a + b.qty, 0),
			align: 'right',
			width: 100,
		},
		{
			key: 'actions',
			title: 'Actions',
			dataIndex: '',
			fixed: 'right',
			width: 150,
			render: (item: ProductModel) => (
				<Space>
					<Tooltip title='Add sub product' key={'addSubProduct'}>
						<Button
							icon={<MdLibraryAdd color={colors.primary500} size={20} />}
							type='text'
							onClick={() => {
								setProductSelected(item);
								setIsVisibleAddSubProduct(true);
							}}
						/>
					</Tooltip>
					<Tooltip title='Edit product' key={'btnEdit'}>
						<Button
							icon={<Edit2 color={colors.primary500} size={20} />}
							type='text'
							onClick={() => {
								setProductSelected(item);
								console.log(productSelected);
							}}
						/>
					</Tooltip>
					<Tooltip title='Delete product' key={'btnDelete'}>
						<Button
							icon={<Trash className='text-danger' size={20} />}
							type='text'
							onClick={() =>
								confirm({
									title: 'Confirm?',
									content: 'Are you sure you want to delete this item?',
									onCancel: () => console.log('cancel'),
									onOk: () => hanleRemoveProduct(item._id),
								})
							}
						/>
					</Tooltip>
				</Space>
			),
			align: 'right',
		},
	];

	return (
		<div>
			<Table
				dataSource={products}
				columns={columns}
				loading={isLoading}
				scroll={{
					x: '100%',
				}}
				bordered
				size='small'
			/>

			<AddSubProductModal
				product={productSelected}
				visible={isVisibleAddSubProduct}
				onClose={() => {
					setProductSelected(undefined);
					setIsVisibleAddSubProduct(false);
				}}
				onAddNew={async (val) => {
					// cách 1: Thêm dữ liệu, không gọi lại api

					// cách 2: gọi lại api
					await getProducts();
				}}
			/>
		</div>
	);
};

export default Inventories;
