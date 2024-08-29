/** @format */

import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { authSeletor, removeAuth } from '../redux/reducers/authReducer';

const HomeScreen = () => {
	const dispatch = useDispatch();
	const auth = useSelector(authSeletor);

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
