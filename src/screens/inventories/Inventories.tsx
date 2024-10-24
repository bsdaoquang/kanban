/** @format */

import {
	Avatar,
	Button,
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
import { FilterProduct } from '../../components';
import CategoryComponent from '../../components/CategoryComponent';
import { FilterProductValue } from '../../components/FilterProduct';
import { colors } from '../../constants/colors';
import { AddSubProductModal } from '../../modals';
import { ProductModel, SubProductModel } from '../../models/Products';
import { replaceName } from '../../utils/replaceName';

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

	// useEffect(() => {
	// 	getProducts(`/products?page=${page}&pageSize=${pageSize}`);
	// }, [page, pageSize]);

	useEffect(() => {
		getProducts(`/products`);
	}, []);

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

	return (
		<div>
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
