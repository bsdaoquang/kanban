/** @format */

import { useEffect, useState } from 'react';
import handleAPI from '../../apis/handleAPI';
import {
	Button,
	Card,
	ColorPicker,
	DatePicker,
	Radio,
	Space,
	Statistic,
	Table,
	Typography,
} from 'antd';
import { OrderModel } from '../../models/OrderModel';
import { ColumnProps } from 'antd/es/table';
import { DateTime } from '../../utils/dateTime';
import { useNavigate } from 'react-router-dom';
import { StatisticComponent } from '../../components';

const Orders = () => {
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const [total, setTotal] = useState(0);
	const [api, setApi] = useState('');
	const [orders, setOrders] = useState<OrderModel[]>([]);
	const [dateSelected, setDateSelected] = useState<
		'day' | 'week' | 'month' | 'year'
	>('month');
	const [dates, setDates] = useState<
		| {
				start: Date;
				end: Date;
		  }
		| undefined
	>();

	const navigate = useNavigate();

	useEffect(() => {
		if (dateSelected) {
			let startDate = new Date();
			let endDate = new Date();
			switch (dateSelected) {
				case 'week':
					startDate.setDate(startDate.getDate() - 7);
					endDate.setDate(endDate.getDate());
					break;

				case 'month':
					startDate.setDate(startDate.getDate() - 30);
					endDate.setDate(endDate.getDate());
					break;

				case 'year':
					startDate.setDate(startDate.getDate() - 365);
					endDate.setDate(endDate.getDate());
					break;

				default:
					setDates({
						start: new Date(new Date().setHours(0, 0, 0, 0)),
						end: new Date(new Date().setHours(23, 59, 59, 999)),
					});
					break;
			}

			setDates({ start: startDate, end: endDate });
		} else {
			setDates(undefined);
		}
	}, [dateSelected]);

	useEffect(() => {
		setApi(
			`/orders?page=${page}&limit=${limit}${
				dates
					? `&start=${dates?.start.toISOString()}&end=${dates?.end.toISOString()}`
					: ''
			}`
		);
	}, [page, limit, dates]);

	useEffect(() => {
		api && getOrders(api);
	}, [api]);

	const getOrders = async (url: string) => {
		setLoading(true);
		// console.log(url);
		try {
			const res: any = await handleAPI(url);

			setOrders(res.data);
			setTotal(res.total);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const columns: ColumnProps<OrderModel>[] = [
		{
			key: '#',
			title: '#',
			dataIndex: '',
			render: (text, record, index) => index + 1,
		},
		{
			key: 'product',
			title: 'Product',
			dataIndex: 'product',
			render: (text, record) => record.product?.title,
		},
		{
			key: 'subProduct',
			title: 'Sub Product',
			dataIndex: 'subProduct',
			render: (text, record) => (
				<ColorPicker disabled value={record.subProduct?.color} />
			),
		},
		{
			key: 'quantity',
			title: 'Quantity',
			dataIndex: 'quantity',
		},
		{
			key: 'cost',
			title: 'Cost',
			dataIndex: 'cost',
		},
		{
			key: 'price',
			title: 'Price',
			dataIndex: 'price',
		},
		{
			key: 'total',
			title: 'Total',
			dataIndex: 'total',
		},
		{
			key: 'status',
			title: 'Status',
			dataIndex: 'status',
		},
		{
			key: 'createdAt',
			title: 'Created At',
			dataIndex: 'createdAt',
			render: (text, record) => DateTime.CalendarDate(record.createdAt),
		},
	];

	const renderStatisticItem = ({
		title,
		value,
		total,
		label,
		desc,
		color,
	}: {
		title: string;
		value: string;
		total?: string;
		label: string;
		desc?: string;
		color?: string;
	}) => {
		return (
			<div className='col px-4'>
				<Typography.Paragraph
					style={{ fontWeight: '500', color: color ?? 'coral' }}
					className='mb-1'>
					{title}
				</Typography.Paragraph>
				<div className='d-flex justify-content-between'>
					<Typography.Title level={4} className='m-0 mb-1'>
						{value}
					</Typography.Title>
					{total && (
						<Typography.Title level={4} className='m-0 mb-1'>
							{total}
						</Typography.Title>
					)}
				</div>
				<div className='d-flex justify-content-between'>
					<Typography.Text type='secondary'>{label}</Typography.Text>
					{desc && <Typography.Text type='secondary'>{desc}</Typography.Text>}
				</div>
			</div>
		);
	};

	const flatArray = (arr: OrderModel[]) => {
		const items: string[] = [];

		arr.map((item) => {
			!items.includes(item.product_id) && items.push(item.product_id);
		});

		return items;
	};
	return (
		<div className='container'>
			<div className='mb-3 text-right'>
				<Space>
					<Radio.Group
						onChange={(val) => setDateSelected(val.target.value)}
						value={dateSelected}>
						<Radio.Button value='day' onClick={() => setDateSelected('day')}>
							Day
						</Radio.Button>
						<Radio.Button value='week' onClick={() => setDateSelected('week')}>
							Week
						</Radio.Button>
						<Radio.Button
							value='month'
							onClick={() => setDateSelected('month')}>
							Month
						</Radio.Button>
						<Radio.Button value='year' onClick={() => setDateSelected('year')}>
							Year
						</Radio.Button>
					</Radio.Group>
					<DatePicker.RangePicker
						format={`DD/MM/YYYY`}
						value={undefined}
						onChange={(vals: any) => {
							if (vals && vals.length === 2) {
								setDates({ start: vals[0].toDate(), end: vals[1].toDate() });
							}
						}}
					/>
				</Space>
			</div>
			<Card className='mb-4'>
				<div className='row'>
					{renderStatisticItem({
						title: 'Products',
						value: `${orders.length > 0 ? flatArray(orders).length : 0} `,
						label: `Last ${30} days`,
					})}
					{renderStatisticItem({
						title: 'Sub Products',
						value: orders.reduce((a, b) => a + b.quantity, 0).toLocaleString(),
						total: orders.reduce((a, b) => a + b.total, 0).toLocaleString(),
						label: `Last ${30} days`,
					})}
					{renderStatisticItem({
						title: 'Done',
						value: orders
							.filter((element) => element.status === 'done')
							.reduce((a, b) => a + b.quantity, 0)
							.toLocaleString(),
						total: orders
							.filter((element) => element.status === 'done')
							.reduce((a, b) => a + b.total, 0)
							.toLocaleString(),
						label: `Last ${30} days`,
					})}
					{renderStatisticItem({
						title: 'Waiting',
						value: orders
							.filter((element) => element.status === 'waiting')
							.reduce((a, b) => a + b.quantity, 0)
							.toLocaleString(),
						total: orders
							.filter((element) => element.status === 'waiting')
							.reduce((a, b) => a + b.total, 0)
							.toLocaleString(),
						label: `Last ${30} days`,
					})}
				</div>
			</Card>
			<Card
				title='Orders'
				extra={
					<Button type='primary' onClick={() => navigate('/orders/add-new')}>
						Add Order
					</Button>
				}>
				<Table
					dataSource={orders}
					columns={columns}
					loading={loading}
					size='small'
					pagination={{
						size: 'small',
						total,
						pageSize: limit,
						current: page,
						onChange: (page) => setPage(page),
					}}
				/>
			</Card>
		</div>
	);
};

export default Orders;
