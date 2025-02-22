/** @format */

import { Typography } from 'antd';

interface Props {
	value: string;
	title: string;
	color?: string;
	type?: 'vertical' | 'horizontal';
	image?: string;
}

const StatisticComponent = (props: Props) => {
	const { value, title, color, type, image } = props;

	return (
		<div className='col text-center'>
			<div className='d-flex justify-content-center align-items-center mb-3'>
				<div
					style={{
						width: 50,
						height: 50,
						backgroundColor: `${color ?? '#339AF0'}1a`,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: 8,
					}}>
					<img
						style={{
							width: '60%',
							height: 'auto',
							borderRadius: 2,
						}}
						src={image ?? './access/icons8-sales-32.png'}
						alt=''
					/>
				</div>
			</div>
			<div
				className={''}
				style={{
					width: '100%',
				}}>
				<div
					className={
						!type || type !== 'vertical'
							? 'd-flex justify-content-between align-items-center'
							: 'd-grid justify-content-center align-items-center'
					}>
					<Typography.Paragraph
						className='mb-0'
						type='secondary'
						style={{
							fontSize: '1.1rem',
							fontWeight: '500',
						}}>
						{value}
					</Typography.Paragraph>
					<div>
						<Typography.Paragraph
							className='m-0'
							ellipsis
							type='secondary'
							style={{
								fontSize: '0.9rem',
							}}>
							{title}
						</Typography.Paragraph>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StatisticComponent;
