/** @format */

import { Affix, Layout } from 'antd';
import HomeScreen from '../screens/HomeScreen';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
	Inventories,
	ManageStore,
	Orders,
	ProductDetail,
	ReportScreen,
	Suppliers,
} from '../screens';
import { HeaderComponent, SiderComponent } from '../components';
import AddProduct from '../screens/inventories/AddProduct';
import Categories from '../screens/categories/Categories';
import CategoryDetail from '../screens/categories/CategoryDetail';
import PromotionScreen from '../screens/PromotionScreen';

const { Content, Footer, Header, Sider } = Layout;

const MainRouter = () => {
	return (
		<BrowserRouter>
			<Layout>
				<Affix offsetTop={0}>
					<SiderComponent />
				</Affix>
				<Layout
					style={{
						backgroundColor: 'white !important',
					}}>
					<Affix offsetTop={0}>
						<HeaderComponent />
					</Affix>
					<Content className='pt-3 container-fluid'>
						<Routes>
							<Route path='/' element={<HomeScreen />} />
							<Route>
								<Route path='/inventory' element={<Inventories />} />
								<Route path='/inventory/add-product' element={<AddProduct />} />
								<Route
									path='/inventory/detail/:slug'
									element={<ProductDetail />}
								/>
							</Route>
							<Route path='/report' element={<ReportScreen />} />
							<Route path='/suppliers' element={<Suppliers />} />
							<Route path='/orders' element={<Orders />} />
							<Route>
								<Route path='/categories' element={<Categories />} />
								<Route
									path='/categories/detail/:slug'
									element={<CategoryDetail />}
								/>
							</Route>

							<Route path='/manage-store' element={<ManageStore />} />
							<Route path='/promotions' element={<PromotionScreen />} />
						</Routes>
					</Content>
					<Footer className='bg-white' />
				</Layout>
			</Layout>
		</BrowserRouter>
	);
};

export default MainRouter;
