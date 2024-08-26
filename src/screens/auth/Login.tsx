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
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/reducers/authReducer';

const { Title, Paragraph, Text } = Typography;

const Login = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRemember, setIsRemember] = useState(false);

	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const handleLogin = async (values: { email: string; password: string }) => {
		try {
			const res: any = await handleAPI('/auth/login', values, 'post');

			message.success(res.message);
			res.data && dispatch(addAuth(res.data));
		} catch (error: any) {
			message.error(error.message);
			console.log(error.message);
		}
	};

	return (
		<>
			<Card
				style={{
					width: '50%',
				}}>
				<div className='text-center'>
					<img
						className='mb-3'
						src={
							'https://firebasestorage.googleapis.com/v0/b/kanban-c0323.appspot.com/o/kanban-logo.png?alt=media&token=a3e8c386-57da-49a3-b9a2-94b8fd93ff83'
						}
						alt=''
						style={{
							width: 48,
							height: 48,
						}}
					/>
					<Title level={2}>Log in to your account</Title>
					<Paragraph type='secondary'>
						Welcome back! please enter your details
					</Paragraph>
				</div>

				<Form
					layout='vertical'
					form={form}
					onFinish={handleLogin}
					disabled={isLoading}
					size='large'>
					<Form.Item
						name={'email'}
						label='Email'
						rules={[
							{
								required: true,
								message: 'Please enter your email!!!',
							},
						]}>
						<Input allowClear maxLength={100} type='email' />
					</Form.Item>
					<Form.Item
						name={'password'}
						label='Password'
						rules={[
							{
								required: true,
								message: 'Please enter your password!!!',
							},
						]}>
						<Input.Password maxLength={100} type='email' />
					</Form.Item>
				</Form>

				<div className='row'>
					<div className='col'>
						<Checkbox
							checked={isRemember}
							onChange={(val) => setIsRemember(val.target.checked)}>
							Remember for 30 days
						</Checkbox>
					</div>
					<div className='col text-right'>
						<Link to={'/'}>Forgot password?</Link>
					</div>
				</div>

				<div className='mt-4 mb-3'>
					<Button
						onClick={() => form.submit()}
						type='primary'
						style={{
							width: '100%',
						}}
						size='large'>
						Login
					</Button>
				</div>
				<SocialLogin />
				<div className='mt-3 text-center'>
					<Space>
						<Text>Don't have an acount? </Text>
						<Link to={'/sign-up'}>Sign up</Link>
					</Space>
				</div>
			</Card>
		</>
	);
};

export default Login;
