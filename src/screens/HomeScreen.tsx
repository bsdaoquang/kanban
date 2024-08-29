/** @format */

import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
	authSeletor,
	refreshtoken,
	removeAuth,
} from '../redux/reducers/authReducer';
import handleAPI from '../apis/handleAPI';

const HomeScreen = () => {
	const dispatch = useDispatch();
	const auth = useSelector(authSeletor);

	const logout = () => {
		dispatch(removeAuth({}));
	};

	const getProducts = async () => {
		const api = `/storage/products`;

		try {
			const res = await handleAPI(api);
			console.log(res);
		} catch (error: any) {
			console.log(error);
			if (error.error === 'jwt expired') {
				handleRefreshtoken();
			}
		}
	};

	const handleRefreshtoken = async () => {
		const api = `auth/refresh-token?id=${auth._id}`;
		try {
			const res = await handleAPI(api);
			dispatch(refreshtoken(res.data.token));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<Button onClick={getProducts}>Logout</Button>
		</div>
	);
};

export default HomeScreen;
