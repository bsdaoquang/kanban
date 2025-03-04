/** @format */

import React, { useEffect, useState } from 'react';
import { BillModel, BillStatus, BillStatusColor } from '../../models/BillModel';
import handleAPI from '../../apis/handleAPI';
import { ColumnProps } from 'antd/es/table';
import { DatePicker, Input, Table, Tag, Typography } from 'antd';

const BillsScreen = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [bills, setBills] = useState<BillModel[]>([]);
	const [total, setTotal] = useState(0);
	const [limit, setLimit] = useState(20);
	const [page, setPage] = useState(1);
	const [api, setApi] = useState('');

	useEffect(() => {
		setApi(`/payments/bills?limit=${limit}&page=${page}`);
	}, []);

	useEffect(() => {
		setApi(`/payments/bills?limit=${limit}&page=${page}`);
	}, [limit, page]);

	useEffect(() => {
		api && getBills(api);
	}, [api]);

	const getBills = async (url: string) => {
		setIsLoading(true);
		try {
			const res = await handleAPI(url);
			setBills(res.data.items);
			setTotal(res.data.total);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const columns: ColumnProps<BillModel>[] = [
		{
			title: '#',
			dataIndex: '_id',
			key: '#',
			render: (_id: string, record: BillModel, index: number) => index + 1,
			align: 'center',
			width: 50,
		},
		{
			title: 'Customer',
			dataIndex: 'customer_id',
			key: 'customer',
			render: (customer: any) => customer,
		},
		{
			title: 'Shipping Address',
			dataIndex: 'shippingAddress',
			key: 'shippingAddress',
			render: (shippingAddress: any) => '',
		},
		{
			title: 'Payment Method',
			dataIndex: 'paymentMethod',
			key: 'paymentMethod',
			render: (paymentMethod: any) => (
				<Typography.Text
					style={{
						textTransform: 'uppercase',
					}}>
					{paymentMethod}
				</Typography.Text>
			),
			align: 'center',
		},
		{
			key: 'products',
			title: 'Products',
			dataIndex: 'products',
			render: (products: any) => products.length,
			align: 'right',
		},
		{
			title: 'Amount',
			dataIndex: 'total',
			key: 'total',
			render: (total: number) => total.toLocaleString(),
			align: 'right',
			sorter: (a: BillModel, b: BillModel) => a.total - b.total,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status: number) => (
				<Tag color={BillStatusColor[status]}>{BillStatus[status]}</Tag>
			),
			align: 'center',
			sorter: (a: BillModel, b: BillModel) => a.status - b.status,
		},
	];

	return (
		<div className='container'>
			<div className='py-3'>
				<div className='row'>
					<div className='col'>
						<Input.Search placeholder='Search' />
					</div>
					<div className='col text-right'>
						<DatePicker.RangePicker />
					</div>
				</div>
			</div>
			<Table
				loading={isLoading}
				dataSource={bills}
				columns={columns}
				size='small'
				pagination={{
					total,
					showSizeChanger: true,
					pageSizeOptions: ['20', '50', '100'],
					onShowSizeChange(current, size) {
						setLimit(size);
					},
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} of ${total} items`,
					pageSize: limit,
					current: page,
					onChange: (page, limit) => {
						setPage(page);
						setLimit(limit);
					},
				}}
			/>
		</div>
	);
};

export default BillsScreen;
