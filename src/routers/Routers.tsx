/** @format */

import React from 'react';
import AuthRouter from './AuthRouter';
import MainRouter from './MainRouter';
import { useDispatch, useSelector } from 'react-redux';
import { authSeletor, AuthState } from '../redux/reducers/authReducer';

const Routers = () => {
	const auth: AuthState = useSelector(authSeletor);
	const dispatch = useDispatch();

	return !auth.token ? <AuthRouter /> : <MainRouter />;
};

export default Routers;
