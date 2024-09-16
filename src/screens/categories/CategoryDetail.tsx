/** @format */

import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const CategoryDetail = () => {
	const [searchparams] = useSearchParams();
	const params = useParams();

	console.log(params);

	const id = searchparams.get('id');

	console.log(id);
	return <div>CategoryDetail</div>;
};

export default CategoryDetail;
