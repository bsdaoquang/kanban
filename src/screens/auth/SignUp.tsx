/** @format */

import { Button, Card, Checkbox, Form, Input, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLogin from './components/SocialLogin';

const { Title, Text, Paragraph } = Typography;
const SignUp = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRemember, setIsRemember] = useState(false);

	const [form] = Form.useForm();

	const handleLogin = (values: { email: string; password: string }) => {
		console.log(values);
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
						]}>
						<Input.Password
							placeholder='Creare password'
							maxLength={100}
							type='email'
						/>
					</Form.Item>
				</Form>

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
						<Text type='secondary'>Already an acount? </Text>
						<Link to={'/login'}>Login</Link>
					</Space>
				</div>
			</Card>
		</>
	);
};

export default SignUp;
