/** @format */

import { Avatar, Button, Input, Space } from 'antd';
import { Notification, SearchNormal1 } from 'iconsax-react';
import { colors } from '../constants/colors';

const HeaderComponent = () => {
	return (
		<div className='p-2 row bg-white'>
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
						type='text'
						icon={<Notification size={22} color={colors.gray600} />}
					/>
					<Avatar
						src={
							'https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/1/b/4/9/1b49b879bd812dbdc5f9daf66c6a48bf.jpg'
						}
						size={40}
					/>
				</Space>
			</div>
		</div>
	);
};

export default HeaderComponent;
