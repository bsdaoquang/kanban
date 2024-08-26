/** @format */

import { Button } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { removeAuth } from '../redux/reducers/authReducer';

const HomeScreen = () => {
	const dispatch = useDispatch();

	const logout = () => {
		dispatch(removeAuth({}));
	};

	return (
		<div>
			<Button onClick={logout}>Logout</Button>
		</div>
	);
};

export default HomeScreen;
