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
	Spin,
	TreeSelect,
	Typography,
	Image,
	Upload,
	UploadProps,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import handleAPI from '../../apis/handleAPI';
import { SelectModel, TreeModel } from '../../models/FormModel';
import { replaceName } from '../../utils/replaceName';
import { uploadFile } from '../../utils/uploadFile';
import { Add } from 'iconsax-react';
import { ModalCategory } from '../../modals';
import { getTreeValues } from '../../utils/getTreeValues';
import { useSearchParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';

const { Text, Title, Paragraph } = Typography;

const AddProduct = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [content, setcontent] = useState('');
	const [supplierOptions, setSupplierOptions] = useState<SelectModel[]>([]);
	const [isVisibleAddCategory, setIsVisibleAddCategory] = useState(false);
	const [categories, setCategories] = useState<TreeModel[]>([]);
	const [isCreating, setIsCreating] = useState(false);
	const [fileUrl, setFileUrl] = useState('');
	const [fileList, setFileList] = useState<any[]>([]);

	const [searchParams] = useSearchParams();

	const id = searchParams.get('id');

	const editorRef = useRef<any>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (id) {
			getProductDetail(id);
		}
	}, [id]);

	const getData = async () => {
		setIsLoading(true);
		try {
			await getSuppliers();
			await getCategories();
		} catch (error: any) {
			message.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const getProductDetail = async (id: string) => {
		const api = `/products/detail?id=${id}`;
		try {
			const res = await handleAPI(api);
			const item = res.data;

			if (item) {
				form.setFieldsValue(item);
				setcontent(item.content);
				if (item.images && item.images.length > 0) {
					const items = [...fileList];
					item.images.forEach((url: string) =>
						items.push({
							uid: `${Math.floor(Math.random() * 1000000)}`,
							name: url,
							status: 'done',
							url,
						})
					);

					setFileList(items);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleAddNewProduct = async (values: any) => {
		const content = editorRef.current.getContent();
		const data: any = {};
		setIsCreating(true);
		for (const i in values) {
			data[`${i}`] = values[i] ?? '';
		}

		data.content = content;
		data.slug = replaceName(values.title);

		if (fileList.length > 0) {
			const urls: string[] = [];
			fileList.forEach(async (file) => {
				if (file.originFileObj) {
					const url = await uploadFile(file.originFileObj);
					url && urls.push(url);
				} else {
					urls.push(file.url);
				}
			});

			data.images = urls;
		}

		try {
			await handleAPI(
				`/products/${id ? `update?id=${id}` : 'add-new'}`,
				data,
				id ? 'put' : 'post'
			);
			window.history.back();
		} catch (error) {
			console.log(error);
		} finally {
			setIsCreating(false);
		}
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

	const getCategories = async () => {
		const res = await handleAPI(`/products/get-categories`);
		const datas = res.data;

		const data = datas.length > 0 ? getTreeValues(datas, true) : [];

		setCategories(data);
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

	return isLoading ? (
		<Spin />
	) : (
		<div>
			<div className='container'>
				<Title level={3}>Add new Product</Title>
				<Form
					disabled={isCreating}
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
								disabled={isLoading || isCreating}
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
									<Button
										loading={isCreating}
										size='middle'
										onClick={() => form.submit()}>
										Cancel
									</Button>
									<Button
										loading={isCreating}
										type='primary'
										size='middle'
										onClick={() => form.submit()}>
										{id ? 'Update' : 'Submit'}
									</Button>
								</Space>
							</Card>
							<Card size='small' className='mt-3' title='Categories'>
								<Form.Item name={'categories'}>
									<TreeSelect
										treeData={categories}
										multiple
										dropdownRender={(menu) => (
											<>
												{menu}

												<Divider className='m-0' />
												<Button
													onClick={() => setIsVisibleAddCategory(true)}
													type='link'
													icon={<Add size={20} />}
													style={{
														padding: '0 16px',
													}}>
													Add new
												</Button>
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
							<Card size='small' className='mt-3' title='Images'>
								<Upload
									multiple
									fileList={fileList}
									accept='image/*'
									listType='picture-card'
									onChange={handleChange}>
									Upload
								</Upload>
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

			<ModalCategory
				visible={isVisibleAddCategory}
				onClose={() => setIsVisibleAddCategory(false)}
				onAddNew={async (val) => {
					await getCategories();
				}}
				values={categories}
			/>
		</div>
	);
};

export default AddProduct;
