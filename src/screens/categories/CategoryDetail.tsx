/** @format */

import { useParams, useSearchParams } from 'react-router-dom';

const CategoryDetail = () => {
	const [searchparams] = useSearchParams();
	const params = useParams();

	const id = searchparams.get('id');

	return <div>CategoryDetail</div>;
};

export default CategoryDetail;
