/** @format */

import { Button, Checkbox, DatePicker, List, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormModel } from '../models/FormModel';
import handleAPI from '../apis/handleAPI';

interface Props {
	visible: boolean;
	onClose: () => void;
	api: string;
	name?: string;
}

const { RangePicker } = DatePicker;

const ModalExportData = (props: Props) => {
	const { visible, onClose, api, name } = props;

	const [isLoading, setIsLoading] = useState(false);
	const [isGetting, setIsGetting] = useState(false);
	const [forms, setForms] = useState<FormModel>();
	const [checkedValues, setCheckedValues] = useState<string[]>([]);

	useEffect(() => {
		if (visible) {
			getFroms();
		}
	}, [visible, api]);

	const handleExport = async () => {
		console.log(checkedValues);
	};

	const getFroms = async () => {
		const url = `/${api}/get-form`;
		setIsGetting(true);
		try {
			const res = await handleAPI(url);
			res.data && setForms(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsGetting(false);
		}
	};

	const handleChangeCheckedValue = (val: string) => {
		const items = [...checkedValues];
		const index = items.findIndex((element) => element === val);

		if (index !== -1) {
			items.splice(index, 1);
		} else {
			items.push(val);
		}

		setCheckedValues(items);
	};

	return (
		<Modal
			loading={isGetting}
			open={visible}
			onCancel={onClose}
			onClose={onClose}
			onOk={handleExport}
			okButtonProps={{
				loading: isLoading,
			}}
			title='Export to excel'>
			<div>
				<Space>
					<RangePicker onChange={(val) => console.log(val)} />
					<Button type='link'>Export all</Button>
				</Space>
			</div>
			<div className='mt-2'>
				<List
					dataSource={forms?.formItems}
					renderItem={(item) => (
						<List.Item key={item.key}>
							<Checkbox
								checked={checkedValues.includes(item.value)}
								onChange={() => handleChangeCheckedValue(item.value)}>
								{item.label}
							</Checkbox>
						</List.Item>
					)}
				/>
			</div>
		</Modal>
	);
};

export default ModalExportData;
