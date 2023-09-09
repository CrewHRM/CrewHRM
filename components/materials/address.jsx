import { countries_object } from "../utilities/helpers.jsx";

export function Address({street_address, city, province, zip_code, country_code}) {
	return [
		street_address, 
		city, 
		province+ ' ' + zip_code,
		countries_object[country_code]
		
	].map(a=>(a || '').trim()).filter(a=>a).join(', ');
}
