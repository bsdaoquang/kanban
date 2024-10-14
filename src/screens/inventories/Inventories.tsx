/** @format */

import {
	Avatar,
	Button,
	Card,
	Divider,
	Dropdown,
	Input,
	message,
	Modal,
	Space,
	Table,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import { Edit2, Sort, Trash } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import { MdLibraryAdd } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import handleAPI from '../../apis/handleAPI';
import CategoryComponent from '../../components/CategoryComponent';
import { colors } from '../../constants/colors';
import { AddSubProductModal } from '../../modals';
import { ProductModel, SubProductModel } from '../../models/Products';
import { replaceName } from '../../utils/replaceName';
import { FilterProduct } from '../../components';
import { FilterProductValue } from '../../components/FilterProduct';
import axios from 'axios';

const { confirm } = Modal;

type TableRowSelection<T extends object = object> =
	TableProps<T>['rowSelection'];

const Inventories = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [products, setProducts] = useState<ProductModel[]>([]);
	const [isVisibleAddSubProduct, setIsVisibleAddSubProduct] = useState(false);
	const [productSelected, setProductSelected] = useState<ProductModel>();
	const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [total, setTotal] = useState<number>(10);
	const [searchKey, setSearchKey] = useState('');
	const [isFilting, setIsFilting] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (!searchKey) {
			setPage(1);
			getProducts(`/products?page=${page}&pageSize=${pageSize}`);
		}
	}, [searchKey]);

	useEffect(() => {
		getProducts(`/products?page=${page}&pageSize=${pageSize}`);
	}, [page, pageSize]);

	const getProducts = async (api: string) => {
		setIsLoading(true);
		try {
			const res = await handleAPI(api);
			const data = res.data;
			setProducts(data.items.map((item: any) => ({ ...item, key: item._id })));

			setTotal(data.totalItems);
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

	const onSelectChange = (newSelectRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectRowKeys);
	};

	const rowSelection: TableRowSelection<ProductModel> = {
		selectedRowKeys,
		onChange: onSelectChange,
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
			render: (desc: string) => (
				<Tooltip style={{ width: 320 }} title={desc}>
					<div className='text-2-line'>{desc}</div>
				</Tooltip>
			),
		},
		{
			key: 'categories',
			dataIndex: 'categories',
			title: 'categories',
			render: (ids: string[]) => (
				<Space key={'categories-nd'} wrap>
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
			render: (items: SubProductModel[]) => {
				const colors: string[] = [];

				items.forEach(
					(sub) => !colors.includes(sub.color) && colors.push(sub.color)
				);

				return (
					<Space>
						{colors.length > 0 &&
							colors.map((item, index) => (
								<div
									style={{
										width: 24,
										height: 24,
										backgroundColor: item,
										borderRadius: 12,
									}}
									key={`color${item}${index}`}
								/>
							))}
					</Space>
				);
			},
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
							onClick={() => navigate(`/inventory/add-product?id=${item._id}`)}
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

	const handleSelectAllProduct = async () => {
		try {
			const res = await handleAPI('/products');

			const items = res.data.items;

			if (items.length > 0) {
				const keys = items.map((item: any) => item._id);

				setSelectedRowKeys(keys);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearchProducts = async () => {
		const key = replaceName(searchKey);
		setPage(1);
		const api = `/products?title=${key}&page=${page}&pageSize=${pageSize}`;
		setIsLoading(true);
		try {
			const res = await handleAPI(api);

			setProducts(res.data.items);
			setTotal(res.data.total);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFilterProducts = async (vals: FilterProductValue) => {
		const api = `/products/filter-products`;
		setIsFilting(true);
		try {
			// console.log(vals);
			const res = await handleAPI(api, vals, 'post');
			setTotal(res.data.totalItems);
			setProducts(res.data.items);
		} catch (error) {
			console.log(error);
		}
	};

	const democolors = [
		'#131118',
		'#5553E1',
		'#A3D139',
		'#E15353',
		'#E1A053',
		'#E1D353',
	];
	const sizes = ['S', 'M', 'X', 'XL', 'XXL', 'XXXL'];
	const images = [
		'https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/2752045/pexels-photo-2752045.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/1485031/pexels-photo-1485031.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/2010812/pexels-photo-2010812.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/2233703/pexels-photo-2233703.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/3363204/pexels-photo-3363204.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/983497/pexels-photo-983497.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/3672825/pexels-photo-3672825.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/36029/aroni-arsa-children-little.jpg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/2738792/pexels-photo-2738792.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/2010925/pexels-photo-2010925.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/3054973/pexels-photo-3054973.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/2693849/pexels-photo-2693849.jpeg?auto=compress&cs=tinysrgb&w=600',
		'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
	];

	const cats = [
		'66fd64d9909d3dbc02cdb0bd',
		'66fd64d9909d3dbc02cdb0bf',
		'66fd64d9909d3dbc02cdb0c1',
		'66fd64d9909d3dbc02cdb0c3',
		'66fd64d9909d3dbc02cdb0c9',
		'66fd64d9909d3dbc02cdb0cb',
		'66fd64d9909d3dbc02cdb0cd',
		'66fd64d9909d3dbc02cdb0cf',
		'66fd64d9909d3dbc02cdb0d5',
		'66fd64d9909d3dbc02cdb0d7',
		'66fd64d9909d3dbc02cdb0db',
		'66fd64d9909d3dbc02cdb0d9',
		'66fd64d9909d3dbc02cdb0dd',
		'66fd64d9909d3dbc02cdb0e4',
		'66fd64d9909d3dbc02cdb0e6',
		'66fd64d9909d3dbc02cdb0ea',
		'66fd64d9909d3dbc02cdb0e8',
		'66fd64d9909d3dbc02cdb0ec',
		'66fd64d9909d3dbc02cdb0f3',
		'66fd64d9909d3dbc02cdb0f5',
		'66fd64d9909d3dbc02cdb0f7',
		'66fd64d9909d3dbc02cdb0f9',
		'66fd64d9909d3dbc02cdb0fb',
		'66fd64da909d3dbc02cdb102',
		'66fd64da909d3dbc02cdb104',
		'66fd64da909d3dbc02cdb106',
		'66fd64da909d3dbc02cdb108',
		'66fd64da909d3dbc02cdb10c',
		'66fd64da909d3dbc02cdb10a',
		'66fd64da909d3dbc02cdb113',
		'66fd64da909d3dbc02cdb116',
		'66fd64da909d3dbc02cdb118',
		'66fd64da909d3dbc02cdb11a',
		'66fd64da909d3dbc02cdb11c',
		'66fd64da909d3dbc02cdb11e',
		'66fd64da909d3dbc02cdb126',
		'66fd64da909d3dbc02cdb128',
		'66fd64da909d3dbc02cdb12a',
		'66fd64da909d3dbc02cdb12c',
		'66fd64da909d3dbc02cdb12e',
		'66fd64da909d3dbc02cdb130',
		'66fd64da909d3dbc02cdb133',
	];
	const handleAddDemoProduct = () => {
		Array.from({ length: 500 }).forEach(async (_item) => {
			const catNums = Math.floor(Math.random() * cats.length);

			const categories: string[] = [];
			Array.from({ length: cats.length }).forEach(
				(num) => categories.length < 3 && categories.push(cats[catNums])
			);

			const data = {
				title: 'Demo title Lorem ipsum dolor sit.',
				slug: replaceName(`Demo title Lorem ipsum dolor sit.`),
				description:
					'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum cupiditate, repellendus aperiam provident ex accusantium numquam aliquid eligendi odit ea omnis iste quisquam, quos suscipit, tenetur expedita nihil similique impedit!',
				categories,
				supplier: 'YK Disney',
				content: '',
				images: [images[Math.floor(Math.random() * images.length)]],
			};

			try {
				const res = await handleAPI(`/products/add-new`, data, 'post');
				console.log('Add product done');
				if (res.data) {
					await handleAddSubProduct(res.data._id);
				}
			} catch (error) {
				console.log(error);
			}
		});
	};

	const handleAddSubProduct = async (id: string) => {
		Array.from({ length: 5 }).forEach(async () => {
			const data = {
				productId: id,
				size: sizes[Math.floor(Math.random() * sizes.length)],
				color: democolors[Math.floor(Math.random() * democolors.length)],
				price: Math.floor(Math.random() * 1000),
				qty: Math.floor(Math.random() * 100),

				images: [images[Math.floor(Math.random() * images.length)]],
			};

			try {
				const res = await handleAPI('/products/add-sub-product', data, 'post');
				console.log('Add sub product done');
			} catch (error) {
				console.log(error);
			}
		});
	};

	return (
		<div>
			<Button onClick={handleAddDemoProduct}>Add Demo Product</Button>
			<div className='row'>
				<div className='col'>
					<Typography.Title level={4}>Product</Typography.Title>
				</div>
				<div className='col'>
					{selectedRowKeys.length > 0 && (
						<Space>
							<Tooltip title='Delete product'>
								<Button
									onClick={() =>
										confirm({
											title: 'Confirm?',
											content: 'Are you sure you want to delete this item?',
											onCancel: () => {
												setSelectedRowKeys([]);
											},
											onOk: () => {
												selectedRowKeys.forEach(
													async (key) => await hanleRemoveProduct(key)
												);
											},
										})
									}
									danger
									type='text'
									icon={<Trash size={18} className='text-danger' />}>
									Delete
								</Button>
							</Tooltip>
							<Typography.Text>
								{selectedRowKeys.length} items selected
							</Typography.Text>
							{selectedRowKeys.length < total && (
								<Button type='link' onClick={handleSelectAllProduct}>
									Select all
								</Button>
							)}
						</Space>
					)}
				</div>

				<div className='col text-right'>
					<Space>
						{isFilting && (
							<Button
								onClick={async () => {
									setPage(1);
									await getProducts(
										`/products?page=${page}&pageSize=${pageSize}`
									);
									setIsFilting(false);
								}}>
								Clear filter values
							</Button>
						)}
						<Input.Search
							value={searchKey}
							onChange={(val) => setSearchKey(val.target.value)}
							onSearch={handleSearchProducts}
							placeholder='Search'
							allowClear
						/>
						<Dropdown
							dropdownRender={(menu) => (
								<FilterProduct
									values={{}}
									onFilter={(vals) => handleFilterProducts(vals)}
								/>
							)}>
							<Button icon={<Sort size={20} />}>Filter</Button>
						</Dropdown>
						<Divider type='vertical' />
						<Button type='primary'>Add Product</Button>
					</Space>
				</div>
			</div>
			<Table
				pagination={{
					showSizeChanger: true,
					onShowSizeChange: (current, size) => {
						// console.log(current, size);
						// console.log('size');
					},
					total,
					onChange(page, pageSize) {
						setPage(page);
						setPageSize(pageSize);
					},
					showQuickJumper: false,
				}}
				rowSelection={rowSelection}
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
					// await getProducts();
				}}
			/>
		</div>
	);
};

export default Inventories;
