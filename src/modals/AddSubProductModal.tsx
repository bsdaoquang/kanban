/** @format */

import {
	ColorPicker,
	Form,
	GetProp,
	Input,
	InputNumber,
	Modal,
	Select,
	Typography,
	Upload,
	UploadFile,
	UploadProps,
	Image,
} from 'antd';
import { useEffect, useState } from 'react';
import { ProductModel } from '../models/Products';
import { url } from 'inspector';
import { colors } from '../constants/colors';

interface Props {
	visible: boolean;
	onClose: () => void;
	product?: ProductModel;
}

const AddSubProductModal = (props: Props) => {
	const { visible, onClose, product } = props;

	const [isLoading, setIsLoading] = useState(false);
	const [fileList, setFileList] = useState<any[]>([]);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldValue('color', colors.primary500);
	}, []);

	const handleAddSubproduct = async (values: any) => {
		console.log(product?._id);
	};

	const handleCancel = () => {
		form.resetFields();
		onClose();
	};

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
		const items = newFileList.map(
			(item) =>
				item.originFileObj && {
					...item,
					url: item.originFileObj
						? URL.createObjectURL(item.originFileObj)
						: '',
					status: 'done',
				}
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
					<ColorPicker format='hex' />
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
