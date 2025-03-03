/** @format */

import { Card, Divider, Empty, Statistic, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BillModel } from '../models/BillModel';
import { OrderModel } from '../models/OrderModel';
import handleAPI from '../apis/handleAPI';
import { VND } from '../utils/handleCurrency';
import { CategoyModel } from '../models/Products';

interface TopCategoryModel extends CategoyModel {
	count: number;
	total: number;
}

const ReportScreen = () => {
	const [totalProfitDatas, setTotalProfitDatas] = useState<{
		bills: BillModel[];
		orders: OrderModel[];
		revenue: number;
		profitMonth: number;
		profitYear: number;
	}>();
	const [loadings, setLoadings] = useState({
		loadingTotalProfitDatas: false,
		loadingTopCategories: false,
	});
	const [topCategories, setTopCategories] = useState<TopCategoryModel[]>([]);

	useEffect(() => {
		getDatas();
	}, []);

	const getDatas = async () => {
		try {
			await getTotalProfitDatas();
			await getTopCategories();
		} catch (error) {
			console.log(error);
			setLoadings({
				loadingTotalProfitDatas: false,
				loadingTopCategories: false,
			});
		}
	};

	const getTotalProfitDatas = async () => {
		setLoadings({ ...loadings, loadingTotalProfitDatas: true });

		const res = await handleAPI(`/admin/total-profit`);
		setTotalProfitDatas(res.data);

		setLoadings({ ...loadings, loadingTotalProfitDatas: false });
	};

	const getTopCategories = async () => {
		setLoadings({ ...loadings, loadingTopCategories: true });
		const res = await handleAPI(`/admin/top-categories`);
		setTopCategories(res.data);
		setLoadings({ ...loadings, loadingTopCategories: false });
	};

	return (
		<div className='container'>
			<div className='row'>
				<div className='col'>
					<Card title='Overviews' loading={loadings.loadingTotalProfitDatas}>
						{totalProfitDatas ? (
							<>
								<div className='row'>
									<div className='col'>
										<Statistic
											title='Profit'
											value={VND.format(
												totalProfitDatas.bills.reduce((a, b) => a + b.total, 0)
											)}
										/>
									</div>
									<div className='col'>
										<Statistic
											title='Reveneu'
											value={VND.format(totalProfitDatas.revenue)}
										/>
									</div>
									<div className='col'>
										<Statistic
											title='Order'
											value={VND.format(
												totalProfitDatas.orders.reduce((a, b) => a + b.total, 0)
											)}
										/>
									</div>
								</div>
								<Divider />
								<div className='row'>
									<div className='col'>
										<Statistic
											title='Total Bills'
											value={totalProfitDatas.bills.length}
										/>
									</div>
									<div className='col'>
										<Statistic
											title='Total orders'
											value={totalProfitDatas.orders.length}
										/>
									</div>
									<div className='col'>
										<Statistic
											title='Profit MOM'
											valueStyle={{
												color:
													totalProfitDatas.profitMonth < 0 ? 'coral' : 'green',
											}}
											value={VND.format(totalProfitDatas.profitMonth)}
										/>
									</div>
									<div className='col'>
										<Statistic
											title='Profit YOY'
											value={VND.format(totalProfitDatas.profitYear)}
										/>
									</div>
								</div>
							</>
						) : (
							<Empty />
						)}
					</Card>
				</div>
				<div className='col'>
					<Card
						loading={loadings.loadingTopCategories}
						title='Best selling catetories'
						extra={<Link to={`#`}>See all</Link>}>
						<Table
							dataSource={topCategories}
							showHeader={false}
							pagination={{
								pageSize: 5,
								hideOnSinglePage: true,
							}}
							columns={[
								{
									key: 'name',
									title: 'Name',
									dataIndex: 'title',
								},
								{
									key: 'count',
									title: 'Count',
									dataIndex: 'count',
								},
								{
									key: 'total',
									title: 'Total',
									dataIndex: 'total',
									render: (total: number) => VND.format(total),
								},
							]}
						/>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ReportScreen;
