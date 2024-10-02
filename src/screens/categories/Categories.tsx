/** @format */

import {
	Button,
	Card,
	message,
	Modal,
	Space,
	Spin,
	Tooltip,
	Table,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { Edit2, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import handleAPI from '../../apis/handleAPI';
import { colors } from '../../constants/colors';
import { TreeModel } from '../../models/FormModel';
import { CategoyModel } from '../../models/Products';
import { getTreeValues } from '../../utils/getTreeValues';
import { AddCategory } from '../../components';

const { confirm } = Modal;

const Categories = () => {
	const [categories, setCategories] = useState<CategoyModel[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [treeValues, setTreeValues] = useState<TreeModel[]>([]);
	const [categorySelected, setCategorySelected] = useState<CategoyModel>();

	useEffect(() => {
		getCategories(`/products/get-categories`, true);
	}, []);

	useEffect(() => {
		const api = `/products/get-categories?page=${page}&pageSize=${pageSize}`;
		getCategories(api);
	}, [page, pageSize]);

	const getCategories = async (api: string, isSelect?: boolean) => {
		try {
			const res = await handleAPI(api);

			setCategories(getTreeValues(res.data, false));

			if (isSelect) {
				setTreeValues(getTreeValues(res.data, true));
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const columns: ColumnProps<CategoyModel>[] = [
		{
			key: 'title',
			title: 'Name',
			dataIndex: '',
			render: (item: CategoyModel) => (
				<Link to={`/categories/detail/${item.slug}?id=${item._id}`}>
					{item.title}
				</Link>
			),
		},
		{
			key: 'description',
			title: 'Description',
			dataIndex: 'description',
		},
		{
			key: 'btnContainer',
			title: 'Actions',
			dataIndex: '',
			render: (item: any) => (
				<Space>
					<Tooltip title='Edit categories' key={'btnEdit'}>
						<Button
							onClick={() => setCategorySelected(item)}
							icon={<Edit2 size={20} color={colors.gray600} />}
							type='text'
						/>
					</Tooltip>
					<Tooltip title='Xoá categories' key={'btnDelete'}>
						<Button
							onClick={() =>
								confirm({
									title: 'Confirm',
									content: 'What are you sure you want to remove this item?',
									onOk: async () => handleRemove(item._id),
								})
							}
							icon={<Trash size={20} className='text-danger' />}
							type='text'
						/>
					</Tooltip>
				</Space>
			),
			align: 'right',
		},
	];

	const handleRemove = async (id: string) => {
		const api = `/products/delete-category?id=${id}`;

		try {
			await handleAPI(api, undefined, 'delete');
			setCategories((categories) =>
				categories.filter((element) => element._id !== id)
			);
			message.success('Deleted!!');
		} catch (error: any) {
			console.log(error);
			message.error(error.message);
		}
	};

	return isLoading ? (
		<Spin />
	) : (
		<div>
			<div className='container'>
				<div className='row'>
					<div className='col-md-4'>
						<Card title={'Add new'}>
							<AddCategory
								onClose={() => setCategorySelected(undefined)}
								seleted={categorySelected}
								values={treeValues}
								onAddNew={async (val) => {
									if (categorySelected) {
										const items = [...categories];
										const index = items.findIndex(
											(element) => element._id === categorySelected._id
										);
										if (index !== -1) {
											items[index] = val;
										}

										setCategories(items);
										setCategorySelected(undefined);

										await getCategories(`/products/get-categories`, true);
									} else {
										getCategories(
											`/products/get-categories?page=${page}&pageSize=${pageSize}`
										);
									}
								}}
							/>
						</Card>
					</div>
					<div className='col-md-8'>
						<Card>
							<Table size='small' dataSource={categories} columns={columns} />
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Categories;
