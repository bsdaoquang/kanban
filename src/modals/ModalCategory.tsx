/** @format */

import { Modal } from 'antd';
import { AddCategory } from '../components';
import { TreeModel } from '../models/FormModel';

interface Props {
	visible: boolean;
	onClose: () => void;
	onAddNew: (val: any) => void;
	values: TreeModel[];
}

const ModalCategory = (props: Props) => {
	const { visible, onClose, onAddNew, values } = props;

	const handleClose = () => {
		onClose();
	};

	return (
		<Modal
			title={'Add category'}
			open={visible}
			onCancel={handleClose}
			onClose={handleClose}
			footer={[null]}>
			<AddCategory
				values={values}
				onAddNew={(val) => {
					onAddNew(val);
					onClose();
				}}
			/>
		</Modal>
	);
};

export default ModalCategory;
