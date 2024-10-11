/** @format */

import { Button } from 'antd';
import React, { useState } from 'react';
import { AddPromotion } from '../modals';

const PromotionScreen = () => {
	const [isVisibleModalAddPromotion, setIsVisibleModalAddPromotion] =
		useState(false);

	return (
		<div>
			<Button onClick={() => setIsVisibleModalAddPromotion(true)}>
				Add Promotion
			</Button>

			<AddPromotion
				visible={isVisibleModalAddPromotion}
				onClose={() => setIsVisibleModalAddPromotion(false)}
			/>
		</div>
	);
};

export default PromotionScreen;
