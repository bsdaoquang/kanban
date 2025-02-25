/** @format */

import { Card, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import handleAPI from '../apis/handleAPI';
import {
	SalesAndPurchaseStatistic,
	StatisticComponent,
	TopSellingAndLowQuantityStatictis,
} from '../components';
import { BillModel } from '../models/BillModel';
import { VND } from '../utils/handleCurrency';

const HomeScreen = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [statictisValues, setStatictisValues] = useState<{
		sales?: BillModel[];
		products: number;
		suppliers: number;
		orders: number;
		totalOrder: number;
		subProduct: number;
		totalSubProduct: number;
	}>();
	useEffect(() => {
		getStatistics();
	}, []);

	const getStatistics = async () => {
		setIsLoading(true);
		const api = `/payments/statistics`;

		try {
			const res = await handleAPI(api);
			// console.log(res);
			setStatictisValues(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const totalcost = (value: BillModel[]) => {
		const items = value.map((item) => {
			return item.products.reduce((a, b) => a + b.price * (b.cost ?? 0), 0);
		});
		return items.reduce((a, b) => a + b, 0);
	};

	return isLoading ? (
		<div className='container text-center py-5'>
			<Spin />
		</div>
	) : (
		<div className='container py-5'>
			<div className='row'>
				<div className='col-sm-12 col-md-8'>
					{statictisValues?.sales && statictisValues.sales.length > 0 && (
						<Card className='mb-4'>
							<Typography.Title level={3}>Sales Overviews</Typography.Title>
							<div className='row mt-4'>
								<StatisticComponent
									value={statictisValues.sales.length.toLocaleString()}
									title='Sales'
									image='./access/icons8-sales-32.png'
								/>
								<StatisticComponent
									value={VND.format(
										statictisValues.sales.reduce((a, b) => a + b.total, 0)
									)}
									title='Revenue'
									color='#DE5AFF'
									image='./access/icons8-revenue-50.png'
								/>

								<StatisticComponent
									value={VND.format(
										statictisValues.sales.reduce((a, b) => a + b.total, 0) -
											totalcost(statictisValues.sales)
									)}
									title='Profit'
									color='#FFB946'
									image='./access/icons8-profit-80.png'
								/>

								<StatisticComponent
									value={VND.format(totalcost(statictisValues.sales))}
									title='Sales'
									color='#FF5959'
									image='./access/icons8-sales-32.png'
								/>
							</div>
						</Card>
					)}
				</div>
				<div className='col-sm-12 col-md-4'>
					<div className='row'>
						<div className='col-sm-12'>
							{statictisValues?.sales && statictisValues.sales.length > 0 && (
								<Card className='mb-4'>
									<div className='row mt-4'>
										<div className='col'>
											<StatisticComponent
												type='vertical'
												value={`${statictisValues.sales
													.filter((element) => element.paymentStatus === 1)
													.reduce(
														(a, b) =>
															a +
															(b.products.length > 0 ? b.products.length : 0),
														0
													)
													.toLocaleString()}`}
												title='Quantity in Hand'
											/>
										</div>
										<div className='col'>
											<StatisticComponent
												type='vertical'
												value={`${statictisValues.sales
													.filter((element) => element.paymentStatus === 2)
													.reduce(
														(a, b) =>
															a +
															(b.products.length > 0 ? b.products.length : 0),
														0
													)
													.toLocaleString()}`}
												title='To be received'
											/>
										</div>
									</div>
								</Card>
							)}
						</div>
						<div className='col-sm-12'></div>
					</div>
				</div>
			</div>
			<div className='row mt-4'>
				<div className='col-sm-12 col-md-8'>
					{statictisValues?.orders && statictisValues.subProduct > 0 && (
						<Card className='mb-4'>
							<Typography.Title level={3}>Purchase Overview</Typography.Title>
							<div className='row mt-4'>
								<StatisticComponent
									value={statictisValues.orders.toLocaleString()}
									title='Orders'
									image='./access/icons8-sales-32.png'
								/>
								<StatisticComponent
									value={VND.format(statictisValues.totalOrder)}
									title='Revenue'
									color='#DE5AFF'
									image='./access/icons8-revenue-50.png'
								/>

								<StatisticComponent
									value={statictisValues.subProduct.toLocaleString()}
									title='Sub product'
									color='#FFB946'
									image='./access/icons8-profit-80.png'
								/>

								<StatisticComponent
									value={VND.format(statictisValues.totalSubProduct)}
									title='Total'
									color='#FF5959'
									image='./access/icons8-sales-32.png'
								/>
							</div>
						</Card>
					)}
				</div>
				<div className='col-sm-12 col-md-4'>
					<div className='row'>
						<div className='col-sm-12'>
							{statictisValues?.products && statictisValues.suppliers && (
								<Card className='mb-4'>
									<div className='row mt-4'>
										<div className='col'>
											<StatisticComponent
												type='vertical'
												value={statictisValues.products.toLocaleString()}
												title='Products'
											/>
										</div>
										<div className='col'>
											<StatisticComponent
												type='vertical'
												value={`${statictisValues.suppliers.toLocaleString()}`}
												title='Suppliers'
											/>
										</div>
									</div>
								</Card>
							)}
						</div>
						<div className='col-sm-12'></div>
					</div>
				</div>
			</div>

			<SalesAndPurchaseStatistic />
			<TopSellingAndLowQuantityStatictis />
		</div>
	);
};

export default HomeScreen;
