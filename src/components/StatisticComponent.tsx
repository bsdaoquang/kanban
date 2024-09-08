/** @format */

import { Card, Space, Typography } from 'antd';
import { ReactNode } from 'react';
import { colors } from '../constants/colors';
import { StatisticModel } from '../models/StatictisModel';
import { FormatCurrency } from '../utils/formatNumber';

interface Props {
	title: string;
	datas: StatisticModel[];
}

const { Title, Text } = Typography;

const renderDescriptionData = (item: StatisticModel) => (
	<>
		<Title
			style={{ fontWeight: 600 }}
			type='secondary'
			className='m-0'
			level={5}>
			{item.valueType === 'number'
				? item.value.toLocaleString()
				: FormatCurrency.VND.format(item.value)}
		</Title>
		<Text style={{ fontWeight: 500 }} type='secondary'>
			{item.description}
		</Text>
	</>
);

const StatisticComponent = (props: Props) => {
	const { title, datas } = props;
	return (
		<Card className='mt-2 mb-4'>
			<Title style={{ color: colors.gray600, fontWeight: '500', fontSize: 20 }}>
				{title}
			</Title>
			<div className='row mt-3'>
				{datas.map((item, index) => (
					<div
						className='col'
						key={item.key}
						style={{
							borderRight: `${
								index < datas.length - 1 ? 1 : 0
							}px solid #e0e0e0 `,
						}}>
						<div
							className='mb-3'
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<div>
								<div
									className='icon-wapper'
									style={{
										backgroundColor: item.color,
									}}>
									{item.icon}
								</div>
							</div>
						</div>
						{!item.type || item.type === 'horizontal' ? (
							<Space
								style={{
									justifyContent: 'space-between',
									display: 'flex',
								}}>
								{renderDescriptionData(item)}
							</Space>
						) : (
							<div className='text-center'>{renderDescriptionData(item)}</div>
						)}
					</div>
				))}
			</div>
		</Card>
	);
};

export default StatisticComponent;
