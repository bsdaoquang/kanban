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

const { confirm } = Modal;

const Categories = () => {
	const [categories, setCategories] = useState<CategoyModel[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	/*

    - Nếu muốn khi một cái gì đó thay đổi thì làm 1 việc gì đó thì sử dụng useEffect với đối số là cái gì đó
    - Luôn luôn có loading khi làm việc với api
    - Luôn luôn hỏi trước khi xoá
  
  */

	useEffect(() => {
		getCategories();
	}, [page, pageSize]);

	const getCategories = async () => {
		try {
			const res = await handleAPI(
				`/products/get-categories?page=${page}&pageSize=${pageSize}`
			);

			setCategories(res.data);
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
					<div className='col-md-4'>form</div>
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
