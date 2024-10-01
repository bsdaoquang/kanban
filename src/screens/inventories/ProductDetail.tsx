/** @format */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import handleAPI from '../../apis/handleAPI';
import { ProductModel, SubProductModel } from '../../models/Products';
import {
	Empty,
	Space,
	Spin,
	Typography,
	Table,
	Avatar,
	Tag,
	Button,
	Modal,
	message,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { Edit2, Trash } from 'iconsax-react';
import { VND } from '../../utils/handleCurrency';
import { colors } from '../../constants/colors';
import { AddSubProductModal } from '../../modals';

const ProductDetail = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [productDetail, setProductDetail] = useState<ProductModel>();
	const [subProducts, setSubProducts] = useState<SubProductModel[]>([]);
	const [productSelected, setProductSelected] = useState<ProductModel>();
	const [isVisibleAddSubProduct, setIsVisibleAddSubProduct] = useState(false);

	const [searchParams] = useSearchParams();

	const id = searchParams.get('id');

	useEffect(() => {
		if (id) {
			getProductDetail();
		}
	}, [id]);

	useEffect(() => {
		setProductSelected(productDetail);
	}, [productDetail]);

	const getProductDetail = async () => {
		const api = `/products/detail?id=${id}`;

		setIsLoading(true);
		try {
			const res = await handleAPI(api);
			setProductDetail(res.data.product);
			setSubProducts(res.data.subProducts);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemoveSubProduct = async (id: string) => {
		const api = `/products/remove-sub-product?id=${id}&isSoftDelete=true`;

		try {
			await handleAPI(api, undefined, 'delete');
			message.success('sub product removed!!!');

			// update state
			const items = [...subProducts];
			const index = items.findIndex((element) => element._id === id);

			if (index - 1) {
				items.splice(index, 1);
			}

			setSubProducts(items);

			// call api again
		} catch (error) {
			console.log(error);
		}
	};

	const columns: ColumnProps<SubProductModel>[] = [
		{
			key: 'images',
			dataIndex: 'images',
			title: 'Images',
			render: (imgs: string[]) => (
				<Space>
					{imgs.length > 0 && imgs.map((img) => <Avatar src={img} size={40} />)}
				</Space>
			),
		},
		{
			title: 'Size',
			key: 'size',
			dataIndex: 'size',
			render: (size: string) => <Tag>{size}</Tag>,
			align: 'center',
		},
		{
			title: 'Color',
			key: 'color',
			dataIndex: 'color',
			render: (color: string) => <Tag color={color}>{color}</Tag>,
			align: 'center',
		},
		{
			key: 'price',
			title: 'Price',
			dataIndex: 'price',
			render: (price: number) => VND.format(price),
			align: 'right',
		},
		{
			key: 'stock',
			title: 'stock',
			dataIndex: 'qty',
			render: (qty: number) => qty.toLocaleString(),
			align: 'right',
		},
		{
			key: 'actions',
			dataIndex: '',
			render: (item: SubProductModel) => (
				<Space>
					<Button
						type='text'
						icon={<Edit2 variant='Bold' color={colors.primary500} size={18} />}
					/>
					<Button
						onClick={() =>
							Modal.confirm({
								title: 'Confirm',
								content:
									'Are you sure you want to remove this sub product item?',
								onOk: async () => await handleRemoveSubProduct(item._id),
							})
						}
						type='text'
						danger
						icon={<Trash variant='Bold' size={18} />}
					/>
				</Space>
			),
			align: 'right',
			fixed: 'right',
		},
	];

	return isLoading ? (
		<Spin />
	) : productDetail ? (
		<div className='container'>
			<div className='row'>
				<div className='col'>
					<Typography.Title level={3}>{productDetail?.title}</Typography.Title>
				</div>
				<div className='col text-right'>
					<Button
						onClick={() => setIsVisibleAddSubProduct(true)}
						type='primary'>
						Add sub product
					</Button>
				</div>
			</div>
			<div className='mt-4'>
				<Table columns={columns} dataSource={subProducts} />
			</div>
			{productDetail && (
				<AddSubProductModal
					product={productSelected}
					visible={isVisibleAddSubProduct}
					onClose={() => {
						setProductSelected(undefined);
						setIsVisibleAddSubProduct(false);
					}}
					onAddNew={async (val) => {
						await getProductDetail();
						// setSubProducts([...subProducts, val]);
					}}
				/>
			)}
		</div>
	) : (
		<Empty description='Data not found!!!' />
	);
};

export default ProductDetail;
