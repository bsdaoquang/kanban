/** @format */

import React, { useEffect, useState } from 'react';
import { LogModel } from '../models/LogModel';
import handleAPI from '../apis/handleAPI';
import { ColumnProps } from 'antd/es/table';
import { Table } from 'antd';

const Actions = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [logs, setLogs] = useState<LogModel[]>([]);
	const [api, setApi] = useState('');
	const [total, setTotal] = useState(0);
	const [limit, setLimit] = useState(20);
	const [page, setPage] = useState(1);

	useEffect(() => {
		setApi(`/logs?limit=${limit}&page=${page}`);
	}, []);

	useEffect(() => {
		setApi(`/logs?limit=${limit}&page=${page}`);
	}, [page, limit]);

	useEffect(() => {
		api && getLogs(api);
	}, [api]);

	const getLogs = async (url: string) => {
		setIsLoading(true);
		try {
			const res = await handleAPI(url);
			setLogs(res.data.items);
			setTotal(res.data.total);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const columns: ColumnProps<LogModel>[] = [
		{
			key: '#',
			title: '#',
			dataIndex: 'id',
			render: (text, record, index) => index + 1,
			align: 'center',
			width: 50,
		},
		{
			key: 'method',
			title: 'Method',
			dataIndex: 'method',
		},
		{
			key: 'url',
			title: 'URL',
			dataIndex: 'url',
		},

		{
			key: 'createdAt',
			title: 'Created At',
			dataIndex: 'createdAt',
			render: (text, record) => new Date(record.createdAt).toLocaleString(),
			align: 'center',
			width: 200,
		},
	];

	return (
		<div className='container'>
			<Table
				pagination={{
					total,
					pageSize: limit,
					current: page,
					onChange: (page, limit) => {
						setPage(page);
						setLimit(limit);
					},
				}}
				columns={columns}
				dataSource={logs}
				loading={isLoading}
				size='small'
			/>
		</div>
	);
};

export default Actions;
