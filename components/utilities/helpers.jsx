export const getElementDataSet = element => {
	let {dataset = {}} = element;
	let data = {};
	for ( let k in dataset ) {
		data[k] = JSON.parse( dataset[k] );
	}

	return data;
}
