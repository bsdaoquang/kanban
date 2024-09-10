/** @format */

import { Editor } from '@tinymce/tinymce-react';
import {
	Button,
	Card,
	Divider,
	Form,
	Input,
	message,
	Select,
	Space,
	Typography,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import handleAPI from '../../apis/handleAPI';
import { SelectModel } from '../../models/FormModel';
import { replaceName } from '../../utils/replaceName';
import { uploadFile } from '../../utils/uploadFile';

const { Text, Title, Paragraph } = Typography;

const AddProduct = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [content, setcontent] = useState('');
	const [supplierOptions, setSupplierOptions] = useState<SelectModel[]>([]);
	const [fileUrl, setFileUrl] = useState('');

	const editorRef = useRef<any>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		try {
			await getSuppliers();
		} catch (error: any) {
			message.error(error.message);
		}
	};

	const handleAddNewProduct = async (values: any) => {
		const content = editorRef.current.getContent();

		console.log(content);
	};

	const getSuppliers = async () => {
		const api = `/supplier`;
		const res = await handleAPI(api);

		const data = res.data.items;
		const options = data.map((item: any) => ({
			value: item._id,
			label: item.name,
		}));

		setSupplierOptions(options);
	};

	return (
		<div>
			<div className='container'>
				<Title level={3}>Add new Product</Title>
				<Form
					size='large'
					form={form}
					onFinish={handleAddNewProduct}
					layout='vertical'>
					<div className='row'>
						<div className='col-8'>
							<Form.Item
								name={'title'}
								label='Title'
								rules={[
									{
										required: true,
										message: 'Please enter product title',
									},
								]}>
								<Input allowClear maxLength={150} showCount />
							</Form.Item>
							<Form.Item name={'description'} label='Description'>
								<Input.TextArea
									maxLength={1000}
									showCount
									rows={4}
									allowClear
								/>
							</Form.Item>
							<Editor
								disabled={isLoading}
								apiKey='ikfkh2oosyq8z4b77hhj1ssxu7js46chtdrcq9j5lqum494c'
								onInit={(evt, editor) => (editorRef.current = editor)}
								initialValue={content !== '' ? content : ''}
								init={{
									height: 500,
									menubar: true,
									plugins: [
										'advlist',
										'autolink',
										'lists',
										'link',
										'image',
										'charmap',
										'preview',
										'anchor',
										'searchreplace',
										'visualblocks',
										'code',
										'fullscreen',
										'insertdatetime',
										'media',
										'table',
										'code',
										'help',
										'wordcount',
									],
									toolbar:
										'undo redo | blocks | ' +
										'bold italic forecolor | alignleft aligncenter ' +
										'alignright alignjustify | bullist numlist outdent indent | ' +
										'removeformat | help',
									content_style:
										'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
								}}
							/>
						</div>
						<div className='col-4'>
							<Card size='small' className='mt-4'>
								<Space>
									<Button size='middle' onClick={() => form.submit()}>
										Cancel
									</Button>
									<Button
										type='primary'
										size='middle'
										onClick={() => form.submit()}>
										Submit
									</Button>
								</Space>
							</Card>
							<Card size='small' className='mt-3' title='Categories'>
								<Form.Item name={'categories'}>
									<Select
										mode='multiple'
										dropdownRender={(menu) => (
											<>
												{menu}

												<Divider />
												<Button type='link'>Add new</Button>
											</>
										)}
									/>
								</Form.Item>
							</Card>
							<Card size='small' className='mt-3' title='Suppliers'>
								<Form.Item
									name={'supplier'}
									rules={[
										{
											required: true,
											message: 'Required',
										},
									]}>
									<Select
										showSearch
										filterOption={(input, option) =>
											replaceName(option?.label ? option.label : '').includes(
												replaceName(input)
											)
										}
										options={supplierOptions}
									/>
								</Form.Item>
							</Card>
							<Card className='mt-3'>
								<Input
									allowClear
									value={fileUrl}
									onChange={(val) => setFileUrl(val.target.value)}
									className='mb-3'
								/>
								<Input
									type='file'
									accept='image/*'
									onChange={async (files: any) => {
										const file = files.target.files[0];

										if (file) {
											const donwloadUrl = await uploadFile(file);
											donwloadUrl && setFileUrl(donwloadUrl);
										}
									}}
								/>
							</Card>
						</div>
					</div>
				</Form>
			</div>
		</div>
	);
};

export default AddProduct;
