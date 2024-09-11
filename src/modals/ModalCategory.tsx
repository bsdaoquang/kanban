/** @format */

import { Form, Input, message, Modal, TreeSelect } from 'antd';
import { useState } from 'react';
import { replaceName } from '../utils/replaceName';
import handleAPI from '../apis/handleAPI';
import { SelectModel, TreeModel } from '../models/FormModel';

interface Props {
	visible: boolean;
	onClose: () => void;
	onAddNew: (val: any) => void;
	values: TreeModel[];
}

const ModalCategory = (props: Props) => {
	const { visible, onClose, onAddNew, values } = props;

	const [isLoading, setIsLoading] = useState(false);

	const [form] = Form.useForm();

	console.log(values);

	const handleCategory = async (values: any) => {
		// setIsLoading(true);
		const api = `/products/add-category`;

		const data: any = {};

		for (const i in values) {
			data[i] = values[i] ?? '';
		}

		data.slug = replaceName(values.title);

		try {
			const res = await handleAPI(api, data, 'post');
			message.success('Add new category successfuly!!');

			onAddNew(res.data);
			handleClose();
		} catch (error: any) {
			message.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		form.resetFields();
		onClose();
	};

	return (
		<Modal
			title={'Add category'}
			open={visible}
			closable={!isLoading}
			onCancel={handleClose}
			onClose={handleClose}
			onOk={() => form.submit()}
			okButtonProps={{
				loading: isLoading,
				disabled: isLoading,
			}}
			cancelButtonProps={{
				loading: isLoading,
				disabled: isLoading,
			}}>
			<Form
				disabled={isLoading}
				form={form}
				layout='vertical'
				onFinish={handleCategory}
				size='large'>
				<Form.Item name={'parentId'} label='Parent category'>
					<TreeSelect
						treeData={values}
						allowClear
						showSearch
						treeDefaultExpandAll
					/>
				</Form.Item>
				<Form.Item
					name={'title'}
					rules={[
						{
							required: true,
							message: 'Enter category title',
						},
					]}
					label='Title'>
					<Input allowClear />
				</Form.Item>
				<Form.Item name={'description'} label='Description'>
					<Input.TextArea rows={4} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ModalCategory;
