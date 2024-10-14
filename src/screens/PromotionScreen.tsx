/** @format */

import { Badge, Button, List, Spin } from 'antd';
import { useEffect, useState } from 'react';
import handleAPI from '../apis/handleAPI';
import { AddPromotion } from '../modals';
import { PromotionModel } from '../models/PromotionModel';
import { Card, CardTick } from 'iconsax-react';

const PromotionScreen = () => {
	const [isVisibleModalAddPromotion, setIsVisibleModalAddPromotion] =
		useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [promotions, setPromotions] = useState<PromotionModel[]>([]);
	const [cards, setCards] = useState<any[]>([]);
	const [myCarts, setMyCarts] = useState<any[]>([]);
	const [auth, setAuth] = useState('');

	useEffect(() => {
		getPromotions();
	}, []);

	useEffect(() => {
		const items = cards.filter((element) => element.uid === auth);

		console.log(auth);
		console.log(items);

		setMyCarts(items);
	}, [auth]);

	const getPromotions = async () => {
		const api = `/promotions/`;
		setIsLoading(true);
		try {
			const res = await handleAPI(api);
			setPromotions(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const testAddTocard = () => {
		const data = promotions[0];

		const items: any = [];

		Array.from({ length: 110 }).map((item) => {
			items.push({
				...data,
				uid: `user${Math.floor(Math.random() * 2)}`,
			});
		});

		setCards(items);
	};

	return (
		<div>
			<div className='container'>
				<div className='mb-3'>
					<Badge count={myCarts.length}>
						<CardTick />
					</Badge>
				</div>
				{Array.from({ length: 3 }).map((item, index) => (
					<Button onClick={() => setAuth(`user${index}`)}>User{index}</Button>
				))}
				<Button onClick={testAddTocard}>Test</Button>
				<div className='row'>
					<div className='col-sm-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3'>
						<List
							dataSource={promotions}
							loading={isLoading}
							renderItem={(item) => (
								<List.Item key={item._id}>
									<List.Item.Meta title={item.title} />
								</List.Item>
							)}
						/>
					</div>
				</div>
			</div>

			<AddPromotion
				onAddNew={(val) => console.log(val)}
				visible={isVisibleModalAddPromotion}
				onClose={() => setIsVisibleModalAddPromotion(false)}
			/>
		</div>
	);
};

export default PromotionScreen;
