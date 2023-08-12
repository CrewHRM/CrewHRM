import icons from '../icons/crewhrm/style.module.scss';

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

export function getFlag(countryCode) {
  const codePoints = countryCode.toUpperCase().split('').map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export function prepareTexts(inputText, props={}) {
	if ( typeof inputText !== 'string' ) {
		return inputText;
	}

	let {className=''} = props;

	// To Do: Fix malformed url if comma, dot is right after the url without space in between.

	// Regular expression to match URLs
	let urlRegex = /((https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
	
	// Replace URLs with anchor tags
	let replacedText = inputText.replace(urlRegex, function(url) {
		return `<a href="${url}" rel="noopener noreferrer nofollow" target="_blank" class="${className}">${url}</a>`;
	});

	replacedText = replacedText.replaceAll('\n', '<br/>');

	return replacedText;
}

export function getSocialIcon(url) {
	const {host}      = new URL(url);
	const brand       = host.slice(0, host.indexOf( '.' ));
	const class_name  = 'ch-icon-' + brand;
	const final_class = `ch-icon ${icons[class_name] ? class_name : 'ch-icon-anchor'}`.classNames();

	return final_class;
}

export function arrayChunk(inputArray, chunkSize) {
  if (!Array.isArray(inputArray) || !Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error('Invalid input');
  }

  const result = [];
  for (let i = 0; i < inputArray.length; i += chunkSize) {
    result.push(inputArray.slice(i, i + chunkSize));
  }

  return result;
}
