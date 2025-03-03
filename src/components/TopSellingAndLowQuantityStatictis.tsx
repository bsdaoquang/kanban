/** @format */

import { Avatar, Button, Card, List, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import handleAPI from '../apis/handleAPI';
import { ProductModel } from '../models/Products';
import { VND } from '../utils/handleCurrency';

const TopSellingAndLowQuantityStatictis = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [datas, setDatas] = useState<{
		topSelling: {
			product: ProductModel;
			total: number;
			count: number;
			qty: number;
			_id: string;
		}[];
		lowQuantity: {
			_id: string;
			qty: number;
			images: string[];
			title: string;
		}[];
	}>();

	useEffect(() => {
		getTopStatictis();
	}, []);

	const getTopStatictis = async () => {
		const api = `/admin/top-selling`;
		setIsLoading(true);
		try {
			const res = await handleAPI(api);

			setDatas(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='row mt-4'>
			<div className='col-sm-12 col-md-8'>
				<Card
					loading={isLoading}
					title='Top selling stock'
					extra={<Link to={``}>See all</Link>}>
					<Table
						dataSource={datas?.topSelling}
						size='small'
						pagination={{
							pageSize: 5,
							hideOnSinglePage: true,
						}}
						columns={[
							{
								title: '#',
								dataIndex: '',
								align: 'center',
								render: (value, record, index) => index + 1,
							},
							{
								title: 'Name',
								dataIndex: 'product',
								key: 'product',
								render: (product: ProductModel) => product.title,
							},
							{
								title: 'Sold',
								dataIndex: 'qty',
								key: 'qty',
								render: (value) => value.toLocaleString(),
								align: 'right',
							},
							{
								title: 'Sell',
								dataIndex: 'count',
								key: 'count',
								render: (value) => value.toLocaleString(),
								align: 'right',
							},
							{
								title: 'Total',
								dataIndex: 'total',
								key: 'total',
								render: (value) => VND.format(value),
								align: 'right',
							},
						]}
					/>
				</Card>
			</div>
			<div className='col-sm-12 col-md-4'>
				<Card
					loading={isLoading}
					title='Low quantity stock'
					extra={<Link to={`/inventory`}>See all</Link>}>
					<List
						dataSource={datas?.lowQuantity}
						renderItem={(item) => (
							<List.Item key={item._id} extra={<Tag>Low</Tag>}>
								<List.Item.Meta
									avatar={
										<Avatar
											src={item.images.length > 0 ? item.images[0] : ''}
										/>
									}
									title={item.title}
									description={`Quantity: ${item.qty}`}
								/>
							</List.Item>
						)}
					/>
				</Card>
			</div>
		</div>
	);
};

export default TopSellingAndLowQuantityStatictis;
