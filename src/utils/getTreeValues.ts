/** @format */

export const getTreeValues = (data: any[], key: string) => {
	const items: any[] = [];
	const keys: string[] = [];

	data.forEach((item) => {
		if (item[`${key}`] && !keys.includes(item[`${key}`])) {
			keys.push(item[`${key}`]);
		}
	});

	data.forEach((item) => {
		if (item[`${key}`]) {
			const index = items.findIndex(
				(element) => element.value === item[`${key}`]
			);

			const children = data.filter(
				(element) => element[`${key}`] === item[`${key}`]
			);

			if (index !== -1) {
				items[index].children = children.map((value) => ({
					title: value.title,
					value: value._id,
				}));
			}
		} else {
			items.push({ title: item.title, value: item._id });
		}
	});

	return items;
};
