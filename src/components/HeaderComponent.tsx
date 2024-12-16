/** @format */

import {
	Avatar,
	Badge,
	Button,
	Drawer,
	Dropdown,
	Input,
	List,
	MenuProps,
	Space,
	Typography,
} from 'antd';
import { Notification, SearchNormal1 } from 'iconsax-react';
import { colors } from '../constants/colors';
import { auth } from '../firebase/firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { authSeletor, removeAuth } from '../redux/reducers/authReducer';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import handleAPI from '../apis/handleAPI';
import { useEffect, useState } from 'react';
import { NotificationModel } from '../models/NotificationModel';
import { DateTime } from '../utils/dateTime';

const HeaderComponent = () => {
	const [notifications, setNotifications] = useState<NotificationModel[]>([]);
	const [visibleModalNotification, setVisibleModalNotification] =
		useState(false);

	const user = useSelector(authSeletor);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const items: MenuProps['items'] = [
		{
			key: 'logout',
			label: 'Đăng xuất',
			onClick: async () => {
				signOut(auth);
				dispatch(removeAuth({}));
				localStorage.clear();

				navigate('/');
			},
		},
	];

	useEffect(() => {
		getNotifications();
	}, []);

	const getNotifications = async () => {
		const api = `/notifications`;

		try {
			const res = await handleAPI(api);
			setNotifications(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	const handleReadNotification = async (item: NotificationModel) => {
		if (!item.isRead) {
			const api = `/notifications/update?id=${item._id}`;
			try {
				const res = await handleAPI(api, { isRead: true }, 'put');

				await getNotifications();
			} catch (error) {
				console.log(error);
			}
		}
		setVisibleModalNotification(false);
		navigate(`/order?id=${item.id}`);
	};

	return (
		<div className='p-2 row bg-white m-0'>
			<div className='col'>
				<Input
					placeholder='Search product, supplier, order'
					style={{
						borderRadius: 100,
						width: '50%',
					}}
					size='large'
					prefix={<SearchNormal1 className='text-muted' size={20} />}
				/>
			</div>
			<div className='col text-right'>
				<Space>
					<Button
						onClick={() => setVisibleModalNotification(true)}
						type='text'
						icon={
							<Badge
								count={
									notifications.filter((element) => !element.isRead).length
								}>
								<Notification size={22} color={colors.gray600} />
							</Badge>
						}
					/>
					<Dropdown menu={{ items }}>
						<Avatar src={user.photoUrl} size={40} />
					</Dropdown>
				</Space>
			</div>

			<Drawer
				title='Notifications'
				open={visibleModalNotification}
				onClose={() => setVisibleModalNotification(false)}>
				<List
					dataSource={notifications}
					renderItem={(item) => (
						<List.Item key={item._id}>
							<List.Item.Meta
								title={
									<a onClick={() => handleReadNotification(item)}>
										<Typography.Text
											className={item.isRead ? 'text-muted' : ''}>
											{item.title}
										</Typography.Text>
									</a>
								}
								description={item.body}
							/>
							<Typography.Text type='secondary'>
								{DateTime.CalendarDate(item.createdAt)}
							</Typography.Text>
						</List.Item>
					)}
				/>
			</Drawer>
		</div>
	);
};

export default HeaderComponent;
