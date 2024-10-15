/** @format */

import {
	DatePicker,
	Form,
	Input,
	message,
	Modal,
	Select,
	Upload,
	UploadProps,
} from 'antd';
import { useEffect, useState } from 'react';
import handleAPI from '../apis/handleAPI';
import { uploadFile } from '../utils/uploadFile';
import { PromotionModel } from '../models/PromotionModel';
import dayjs from 'dayjs';
import { url } from 'inspector';

interface Props {
	visible: boolean;
	onClose: () => void;
	promotion?: PromotionModel;
	onAddNew: (val: PromotionModel) => void;
}

const AddPromotion = (props: Props) => {
	const { visible, onClose, promotion, onAddNew } = props;

	const [imageUpload, setImageUpload] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const [form] = Form.useForm();

	useEffect(() => {
		if (promotion) {
			form.setFieldsValue({
				...promotion,
				startAt: dayjs(promotion.startAt),
				endAt: dayjs(promotion.endAt),
			});

			if (promotion.imageURL) {
				setImageUpload([
					{ uid: '-1', url: promotion.imageURL, status: 'done' },
				]);
			}
		}
	}, [promotion]);

	const handleClose = () => {
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

		setImageUpload(items);
	};

	const handleAddNewPromotion = async (values: any) => {
		if (imageUpload.length === 0) {
			message.error('Please upload one image');
		} else {
			const start = values.startAt;
			const end = values.endAt;

			if (new Date(end).getTime() < new Date(start).getTime()) {
				message.error('Thời gian kết thúc phải lớn thời gian bắt đầu');
			} else {
				const data: any = {};

				for (const i in values) {
					data[i] = values[i] ?? '';
				}

				data.startAt = new Date(start);
				data.endAt = new Date(end);

				data.imageURL =
					imageUpload.length > 0 && imageUpload[0].originFileObj
						? await uploadFile(imageUpload[0].originFileObj)
						: '';

				const api = `/promotions/${
					promotion ? `update?id=${promotion._id}` : 'add-new'
				}`;
				setIsLoading(true);

				try {
					const res = await handleAPI(api, data, promotion ? 'put' : 'post');
					onAddNew(res.data);
					handleClose();
				} catch (error) {
					console.log(error);
				} finally {
					setIsLoading(false);
				}
			}
		}
	};
	return (
		<Modal
			title='Add new promotion/discount'
			open={visible}
			onClose={handleClose}
			onCancel={handleClose}
			okButtonProps={{
				loading: isLoading,
			}}
			cancelButtonProps={{
				loading: isLoading,
			}}
			onOk={() => form.submit()}>
			<Upload
				accept='image/*'
				fileList={imageUpload}
				listType='picture-card'
				className='mb-3'
				onChange={handleChange}>
				{imageUpload.length === 0 ? 'Upload' : null}
			</Upload>
			<Form
				form={form}
				disabled={isLoading}
				size='large'
				onFinish={handleAddNewPromotion}
				layout='vertical'>
				<Form.Item
					name={'title'}
					label='Title'
					rules={[{ required: true, message: 'Please enter promotion' }]}>
					<Input placeholder='title' allowClear />
				</Form.Item>
				<Form.Item name={'description'} label='Description'>
					<Input.TextArea rows={4} placeholder='Description' allowClear />
				</Form.Item>
				<div className='row'>
					<div className='col'>
						<Form.Item name='code' label='CODE' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</div>
					<div className='col'>
						<Form.Item name='value' label='Value' rules={[{ required: true }]}>
							<Input type='number' />
						</Form.Item>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<Form.Item name='numOfAvailable' label='Num of value'>
							<Input type='number' />
						</Form.Item>
					</div>
					<div className='col'>
						<Form.Item name='type' label='Type' initialValue={'discount'}>
							<Select
								options={[
									{
										label: 'Discount',
										value: 'discount',
									},
									{
										label: 'Percent',
										value: 'percent',
									},
								]}
							/>
						</Form.Item>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<Form.Item name={'startAt'} label='Start'>
							<DatePicker showTime format={'DD/MM/YYYY HH:mm:ss'} />
						</Form.Item>
					</div>
					<div className='col'>
						<Form.Item name={'endAt'} label='End'>
							<DatePicker showTime format={'DD/MM/YYYY HH:mm:ss'} />
						</Form.Item>
					</div>
				</div>
			</Form>
		</Modal>
	);
};

export default AddPromotion;
