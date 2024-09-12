/** @format */

import { ConfigProvider, message } from 'antd';
import Routers from './routers/Routers';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';

message.config({
	top: 20,
	duration: 2,
	maxCount: 3,
	rtl: true,
	prefixCls: 'my-message',
});

function App() {
	return (
		<>
			<ConfigProvider
				theme={{
					token: {},
					components: {},
				}}>
				<Provider store={store}>
					<Routers />
				</Provider>
			</ConfigProvider>
		</>
	);
}

export default App;
