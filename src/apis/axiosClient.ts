/** @format */

import axios from 'axios';
import queryString from 'query-string';
import { localDataNames } from '../constants/appInfos';

const baseURL = `http://192.168.1.244:3001`;
const baseURLProduction = `https://server-kanban.onrender.com`;

const getAssetToken = () => {
	const res = localStorage.getItem(localDataNames.authData);

	if (res) {
		const auth = JSON.parse(res);
		return auth && auth.token ? auth.token : '';
	} else {
		return '';
	}
};

const axiosClient = axios.create({
	baseURL: baseURL,
	paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
	const accesstoken = getAssetToken();

	config.headers = {
		Authorization: accesstoken ? `Bearer ${accesstoken}` : '',
		Accept: 'application/json',
		...config.headers,
	};

	return { ...config, data: config.data ?? null };
});

axiosClient.interceptors.response.use(
	(res) => {
		if (res.data && res.status >= 200 && res.status < 300) {
			return res.data;
		} else {
			return Promise.reject(res.data);
		}
	},
	(error) => {
		const { response } = error;
		return Promise.reject(response.data);
	}
);

export default axiosClient;
