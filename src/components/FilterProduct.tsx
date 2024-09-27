/** @format */

import {
	Button,
	Card,
	Empty,
	Form,
	Select,
	Slider,
	Space,
	Spin,
	Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import handleAPI from '../apis/handleAPI';
import { SelectModel } from '../models/SelectModel';

export interface FilterProductValue {
	color?: string;
	categories?: string[];
	size?: string;
	price?: number[];
}

interface Props {
	values: FilterProductValue;
	onFilter: (vals: FilterProductValue) => void;
}

const FilterProduct = (props: Props) => {
	const { values, onFilter } = props;

	const [isLoading, setIsLoading] = useState(false);
	const [selectDatas, setSelectDatas] = useState<{
		categories: SelectModel[];
		colors: SelectModel[];
		prices: number[];
		sizes: SelectModel[];
	}>();
	const [filterValues, setFilterValues] = useState<FilterProductValue>();

	const [form] = Form.useForm();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setIsLoading(true);

		try {
			await getCategories();
			await getFilterValues();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChangeValue = (key: string, val: any) => {
		const items: any = { ...selectDatas };
		items[`${key}`] = val;

		setSelectDatas(items);
	};

	const getCategories = async () => {
		const res = await handleAPI(`/products/get-categories`);

		const data =
			res.data && res.data.length > 0
				? res.data.map((item: any) => ({
						label: item.title,
						value: item._id,
				  }))
				: [];

		handleChangeValue('categories', data);
	};

	const getFilterValues = async () => {
		const res = await handleAPI('/products/get-filter-values');

		setSelectDatas({ ...selectDatas, ...res.data });
	};

	const handleFilter = (values: any) => {
		onFilter(values);
	};

	return (
		<Card
			size='small'
			title='Filter values'
			className='filter-card'
			style={{
				width: 320,
			}}>
			{isLoading ? (
				<Spin />
			) : selectDatas ? (
				<>
					<Form form={form} layout='vertical' onFinish={handleFilter}>
						<Form.Item name='categories' label='Categories'>
							<Select
								placeholder='Categories'
								allowClear
								options={selectDatas.categories}
								mode='multiple'
							/>
						</Form.Item>
						<Form.Item name='color' label='Color'>
							<Select
								options={selectDatas.colors}
								allowClear
								placeholder='Color'
							/>
						</Form.Item>
						<Form.Item name='size' label='Sizes'>
							<Select
								options={selectDatas.sizes}
								allowClear
								placeholder='Size'
							/>
						</Form.Item>
						<Form.Item name={'price'} label='Price'>
							<Slider
								range
								min={Math.min(...selectDatas.prices)}
								max={Math.max(...selectDatas.prices)}
							/>
						</Form.Item>
					</Form>

					<div className='mt-4 text-right'>
						<Button type='primary' onClick={() => form.submit()}>
							Filter
						</Button>
					</div>
				</>
			) : (
				<Empty />
			)}
		</Card>
	);
};

export default FilterProduct;
