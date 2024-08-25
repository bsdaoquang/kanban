/** @format */

import {
	Button,
	Card,
	Checkbox,
	Form,
	Input,
	message,
	Space,
	Typography,
} from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLogin from './components/SocialLogin';
import handleAPI from '../../apis/handleAPI';

const { Title, Text, Paragraph } = Typography;
const SignUp = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRemember, setIsRemember] = useState(false);

	const [form] = Form.useForm();

	const handleLogin = async (values: { email: string; password: string }) => {
		const api = `/auth/register`;

		setIsLoading(true);
		try {
			const res = await handleAPI(api, values, 'post');
			console.log(res);
		} catch (error: any) {
			console.log(error);
			message.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Card
				style={{
					width: '50%',
				}}>
				<div className='text-center'>
					<Title level={2}>Create an account</Title>
					<Paragraph type='secondary'>Free trial 30 days</Paragraph>
				</div>

				<Form
					layout='vertical'
					form={form}
					onFinish={handleLogin}
					disabled={isLoading}
					size='large'>
					<Form.Item
						name={'name'}
						label='Name'
						rules={[
							{
								required: true,
								message: 'Please enter your email!!!',
							},
						]}>
						<Input placeholder='Enter your name' allowClear />
					</Form.Item>
					<Form.Item
						name={'email'}
						label='Email'
						rules={[
							{
								required: true,
								message: 'Please enter your email!!!',
							},
						]}>
						<Input
							placeholder='Enter your email'
							allowClear
							maxLength={100}
							type='email'
						/>
					</Form.Item>
					<Form.Item
						name={'password'}
						label='Password'
						rules={[
							{
								required: true,
								message: 'Please enter your password!!!',
							},
							() => ({
								validator: (_, value) => {
									if (value.length < 6) {
										return Promise.reject(
											new Error('Mật khẩu phải chứa ít nhất 6 ký tự')
										);
									} else {
										return Promise.resolve();
									}
								},
							}),
						]}>
						<Input.Password
							placeholder='Creare password'
							maxLength={100}
							type='email'
						/>
					</Form.Item>
				</Form>

				<div className='mt-5 mb-3'>
					<Button
						loading={isLoading}
						onClick={() => form.submit()}
						type='primary'
						style={{
							width: '100%',
						}}
						size='large'>
						Sing up
					</Button>
				</div>
				<SocialLogin />
				<div className='mt-3 text-center'>
					<Space>
						<Text type='secondary'>Already an acount? </Text>
						<Link to={'/login'}>Login</Link>
					</Space>
				</div>
			</Card>
		</>
	);
};

export default SignUp;
