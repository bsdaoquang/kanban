/** @format */

export const getTreeValues = (data: any[], isSelect?: boolean) => {
	const values: any = [];
	const items = data.filter((element) => !element.parentId);
	const newItems = items.map((item) =>
		isSelect
			? {
					label: item.title,
					value: item._id,
			  }
			: { ...item, key: item._id }
	);

	newItems.forEach((item) => {
		const children = changeMenu(
			data,
			isSelect ? item.value : item._id,
			isSelect ?? false
		);
		values.push({
			...item,
			children,
		});
	});

	return values;
};

const changeMenu = (data: any[], id: string, isSelect: boolean) => {
	const items: any = [];
	const datas = data.filter((element) => element.parentId === id);

	datas.forEach((val) =>
		items.push(
			isSelect
				? {
						label: val.title,
						value: val._id,
						children: changeMenu(data, val._id, isSelect),
				  }
				: {
						...val,
						key: val._id,
						children: changeMenu(data, val._id, isSelect),
				  }
		)
	);
	return items;
};
