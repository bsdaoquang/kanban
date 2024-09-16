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
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import handleAPI from '../../apis/handleAPI';
import { SelectModel, TreeModel } from '../../models/FormModel';
import { replaceName } from '../../utils/replaceName';
import { uploadFile } from '../../utils/uploadFile';
import { Add } from 'iconsax-react';
import { ModalCategory } from '../../modals';
import { getTreeValues } from '../../utils/getTreeValues';

const { Text, Title, Paragraph } = Typography;

const AddProduct = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [content, setcontent] = useState('');
	const [supplierOptions, setSupplierOptions] = useState<SelectModel[]>([]);
	const [fileUrl, setFileUrl] = useState('');
	const [isVisibleAddCategory, setIsVisibleAddCategory] = useState(false);
	const [categories, setCategories] = useState<TreeModel[]>([]);
	const [isCreating, setIsCreating] = useState(false);
	const [files, setFiles] = useState<any[]>([]);

	const editorRef = useRef<any>(null);
	const inpFileRef = useRef<any>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		getData();
	}, []);

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

	const handleAddNewProduct = async (values: any) => {
		const content = editorRef.current.getContent();
		const data: any = {};
		setIsCreating(true);
		for (const i in values) {
			data[`${i}`] = values[i] ?? '';
		}

		data.content = content;
		data.slug = replaceName(values.title);

		if (files.length > 0) {
			const urls: string[] = [];

			for (const i in files) {
				if (files[i].size && files[i].size > 0) {
					const url = await uploadFile(files[i]);
					urls.push(url);
				}
			}
			data.images = urls;
		}

		try {
			await handleAPI('/products/add-new', data, 'post');
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
										Submit
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
							<Card
								size='small'
								className='mt-3'
								title='Images'
								extra={
									<Button
										size='small'
										onClick={() => inpFileRef.current.click()}>
										Upload images
									</Button>
								}>
								{files.length > 0 && (
									<Image.PreviewGroup>
										{Object.keys(files).map(
											(i) =>
												files[parseInt(i)].size &&
												files[parseInt(i)].size > 0 && (
													<Image
														src={URL.createObjectURL(files[parseInt(i)])}
														width={'50%'}
													/>
												)
										)}
									</Image.PreviewGroup>
								)}
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
			<div className='d-none'>
				<input
					type='file'
					multiple
					accept='image/*'
					onChange={(vals: any) => setFiles(vals.target.files)}
					ref={inpFileRef}
				/>
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
