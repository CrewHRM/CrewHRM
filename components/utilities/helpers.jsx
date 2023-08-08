export const getElementDataSet = element => {
	let {dataset = {}} = element;
	let data = {};
	for ( let k in dataset ) {
		data[k] = JSON.parse( dataset[k] );
	}

	return data;
}

export const getRandomString=()=>{
  const timestamp = new Date().getTime().toString();
  const randomPortion = Math.random().toString(36).substring(2);
  return timestamp + randomPortion;
}

export function __( txt ) {
	const {__} = window.wp?.i18n || {};
    return typeof __ == 'function' ? __( txt, 'crewhrm' ) : txt;
}