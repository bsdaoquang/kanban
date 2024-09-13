/** @format */

import { useEffect, useState } from 'react';
import handleAPI from '../apis/handleAPI';
import { CategoyModel } from '../models/Products';
import {
	Button,
	Card,
	message,
	Modal,
	Popover,
	Space,
	Spin,
	Table,
	Tooltip,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { Edit, Edit2, Trash } from 'iconsax-react';
import { colors } from '../constants/colors';
import { TreeModel } from '../models/FormModel';
import { getTreeValues } from '../utils/getTreeValues';
import { AddCategory } from '../components';

const { confirm } = Modal;

const Categories = () => {
	const [categories, setCategories] = useState<CategoyModel[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [treeValues, setTreeValues] = useState<TreeModel[]>([]);
	const [categorySelected, setCategorySelected] = useState<CategoyModel>();

	/*

    - Nếu muốn khi một cái gì đó thay đổi thì làm 1 việc gì đó thì sử dụng useEffect với đối số là cái gì đó
    - Luôn luôn có loading khi làm việc với api
    - Luôn luôn hỏi trước khi xoá
  
  */

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

			setCategories(res.data);

			if (isSelect) {
				setTreeValues(getTreeValues(res.data, 'parentId'));
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		console.log(categories);
	}, [categories]);

	const columns: ColumnProps<CategoyModel>[] = [
		{
			key: 'title',
			title: 'Name',
			dataIndex: 'title',
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
								onAddNew={(val) => {
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
							<Table
								// pagination={{
								// 	pageSize: 1,
								// 	showSizeChanger: true,
								// 	onChange: (vals) => {
								// 		setPage(vals);
								// 	},
								// 	onShowSizeChange: (val) => {
								// 		console.log(val);
								// 	},
								// }}
								size='small'
								dataSource={categories}
								columns={columns}
							/>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Categories;
