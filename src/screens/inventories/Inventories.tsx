/** @format */

import { Button } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const Inventories = () => {
	return (
		<div>
			<Link to={'/inventory/add-product'} onClick={() => {}}>
				Add Product
			</Link>
		</div>
	);
};

export default Inventories;
