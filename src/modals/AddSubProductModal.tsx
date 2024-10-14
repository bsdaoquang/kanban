/** @format */

import {
	ColorPicker,
	Form,
	Image,
	Input,
	InputNumber,
	message,
	Modal,
	Typography,
	Upload,
	UploadProps,
} from 'antd';
import { useEffect, useState } from 'react';
import handleAPI from '../apis/handleAPI';
import { colors } from '../constants/colors';
import { ProductModel, SubProductModel } from '../models/Products';
import { uploadFile } from '../utils/uploadFile';

interface Props {
	visible: boolean;
	onClose: () => void;
	product?: ProductModel;
	onAddNew: (val: SubProductModel) => void;
	subProduct?: SubProductModel;
}

const AddSubProductModal = (props: Props) => {
	const { visible, onClose, product, onAddNew, subProduct } = props;

	const [isLoading, setIsLoading] = useState(false);
	const [fileList, setFileList] = useState<any[]>([]);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldValue('color', colors.primary500);
	}, []);

	useEffect(() => {
		if (subProduct) {
			form.setFieldsValue(subProduct);

			if (subProduct.images && subProduct.images.length > 0) {
				const items = subProduct.images.map((item) => ({
					url: item,
				}));

				setFileList(items);
			}
		}
	}, [subProduct]);

	const handleAddSubproduct = async (values: any) => {
		if (product) {
			const data: any = {};
			for (const i in values) {
				data[i] = values[i] ?? '';
			}
			data.productId = product._id;

			if (data.color) {
				data.color =
					typeof data.color === 'string'
						? data.color
						: data.color.toHexString();
			}

			setIsLoading(true);
			const api = `/products/${
				subProduct
					? `update-sub-product?id=${subProduct._id}`
					: 'add-sub-product'
			}`;
			try {
				const res = await handleAPI(api, data, subProduct ? 'put' : 'post');
				onAddNew(res.data);
				handleCancel();
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		} else {
			message.error('Need to product detail');
		}
	};

	const uploadFileForId = async (subId: string) => {
		try {
			if (fileList.length > 0) {
				const urls: string[] = [];
				fileList.forEach(async (file) => {
					const url = await uploadFile(file.originFileObj);
					url && urls.push(url);

					if (urls.length === fileList.length) {
						await handleAPI(
							`/products/update-sub-product?id=${subId}`,
							{ images: urls },
							'put'
						);
					}
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		onClose();
	};

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
		const items = newFileList.map((item) =>
			item.originFileObj
				? {
						...item,
						url: item.originFileObj
							? URL.createObjectURL(item.originFileObj)
							: '',
						status: 'done',
				  }
				: { ...item }
		);

		setFileList(items);
	};

	return (
		<Modal
			title='Add Sub product'
			open={visible}
			onCancel={handleCancel}
			onClose={handleCancel}
			onOk={() => form.submit()}
			okButtonProps={{
				loading: isLoading,
			}}>
			<Typography.Title level={5}>{product?.title}</Typography.Title>
			<Form
				layout='vertical'
				onFinish={handleAddSubproduct}
				size='large'
				form={form}
				disabled={isLoading}>
				<Form.Item name='color' label='Color'>
					<ColorPicker
						format='hex'
						// onChange={(val) => {
						// 	const color = typeof val === 'string' ? val : val.toHexString();

						// 	console.log(color);
						// }}
					/>
				</Form.Item>
				<Form.Item
					rules={[
						{
							required: true,
							message: 'type device size',
						},
					]}
					name='size'
					label='Size'>
					<Input allowClear />
				</Form.Item>

				<div className='row'>
					<div className='col'>
						<Form.Item name={'qty'} label='Quantity'>
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
					</div>
					<div className='col'>
						<Form.Item name={'price'} label='Price'>
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
					</div>
					<div className='col'>
						<Form.Item name={'discount'} label='Discount'>
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
					</div>
				</div>
			</Form>
			<Upload
				multiple
				fileList={fileList}
				accept='image/*'
				listType='picture-card'
				onChange={handleChange}>
				Upload
			</Upload>

			{previewImage && (
				<Image
					wrapperStyle={{ display: 'none' }}
					preview={{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewImage(''),
					}}
					src={previewImage}
				/>
			)}
		</Modal>
	);
};

export default AddSubProductModal;
