/** @format */

import { Button, message, Modal, Space, Table, Typography } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { Edit2, Sort, UserRemove } from 'iconsax-react';
import { useEffect, useState } from 'react';
import handleAPI from '../apis/handleAPI';
import { colors } from '../constants/colors';
import { ToogleSupplier } from '../modals';
import { SupplierModel } from '../models/SupplierModel';

const { Title, Text } = Typography;
const { confirm } = Modal;

const Suppliers = () => {
	const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
	const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [supplierSelected, setSupplierSelected] = useState<SupplierModel>();

	const columns: ColumnProps<SupplierModel>[] = [
		{
			key: 'name',
			dataIndex: 'name',
			title: 'Supplirer name',
		},
		{
			key: 'product',
			dataIndex: 'product',
			title: 'Product',
		},
		{
			key: 'contact',
			dataIndex: 'contact',
			title: 'Contact',
		},
		{
			key: 'email',
			dataIndex: 'email',
			title: 'Email',
		},
		{
			key: 'type',
			dataIndex: 'isTaking',
			title: 'Type',
			render: (isTaking: boolean) => (
				<Text type={isTaking ? 'success' : 'danger'}>
					{isTaking ? 'Taking Return' : 'Not Taking Return'}
				</Text>
			),
		},
		{
			key: 'on',
			dataIndex: 'active',
			title: 'On the way',
			render: (num) => num ?? '-',
		},
		{
			key: 'buttonContainer',
			title: 'Actions',
			dataIndex: '',
			render: (item: SupplierModel) => (
				<Space>
					<Button
						type='text'
						onClick={() => {
							setSupplierSelected(item);
							setIsVisibleModalAddNew(true);
						}}
						icon={<Edit2 size={18} className='text-info' />}
					/>

					<Button
						onClick={() =>
							confirm({
								title: 'Comfirm',
								content: 'Are you sure you want to remove this supplier?',
								onOk: () => removeSuppiler(item._id),
							})
						}
						type='text'
						icon={<UserRemove size={18} className='text-danger' />}
					/>
				</Space>
			),
			fixed: 'right',
			align: 'right',
		},
	];

	useEffect(() => {
		getSuppliers();
	}, []);

	const getSuppliers = async () => {
		const api = `/supplier?page=1&pageSize=10`;
		setIsLoading(true);
		try {
			const res = await handleAPI(api);

			res.data && setSuppliers(res.data);
		} catch (error: any) {
			message.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const removeSuppiler = async (id: string) => {
		try {
			// // soft delete
			// await handleAPI(`/supplier/update?id=${id}`, { isDeleted: true }, 'put');

			// delete

			await handleAPI(`/supplier/remove?id=${id}`, undefined, 'delete');

			getSuppliers();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<Table
				loading={isLoading}
				dataSource={suppliers}
				columns={columns}
				title={() => (
					<div className='row'>
						<div className='col'>
							<Title level={5}>Suppliers</Title>
						</div>
						<div className='col text-right'>
							<Space>
								<Button
									type='primary'
									onClick={() => setIsVisibleModalAddNew(true)}>
									Add Supplier
								</Button>
								<Button icon={<Sort size={20} color={colors.gray600} />}>
									Filters
								</Button>
								<Button>Download all</Button>
							</Space>
						</div>
					</div>
				)}
			/>

			<ToogleSupplier
				visible={isVisibleModalAddNew}
				onClose={() => {
					supplierSelected && getSuppliers();
					setSupplierSelected(undefined);
					setIsVisibleModalAddNew(false);
				}}
				onAddNew={(val) => setSuppliers([...suppliers, val])}
				supplier={supplierSelected}
			/>
		</div>
	);
};

export default Suppliers;
