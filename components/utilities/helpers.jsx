export function getElementDataSet(element){
	let {dataset = {}} = element;
	let data = {};
	for ( let k in dataset ) {
		data[k] = JSON.parse( dataset[k] );
	}

	return data;
}

export function getRandomString(){
  const timestamp = new Date().getTime().toString();
  const randomPortion = Math.random().toString(36).substring(2);
  return timestamp + randomPortion;
}

export function __( txt ) {
	const {__} = window.wp?.i18n || {};
    return typeof __ == 'function' ? __( txt, 'crewhrm' ) : txt;
}

export function sprintf(str, ...params) {
	let find = '%s';
	
	while(true) {
		let replace = params.shift();
		if ( replace === undefined || str.indexOf( find ) === -1 ) {
			break;
		}
		
		str = str.replace( find, replace );
	}

	return str;
}