import style_library from '../styles/index.module.scss';
import icons from '../icons/crewhrm/style.module.scss';

String.prototype.classNames = function(style) {
	let dump = '';
	let cls  = this.split(' '); 		// Split multiples by space
	cls      = cls.map(c=>c.trim()); // Trim leading and trailing slashes
	cls      = cls.filter(c=>c); 	// Remove empty strings

	// Apply dynamic classes
	cls = cls.map(c=>{
		let source = style || (c.indexOf('ch-icon')>-1 ? icons : style_library);
		
		// Log if the class not found
		if ( ! source[c] ) {
			dump += ' ' + c;
		}

		return (source[c] || '') + ' ' + 'crewhrm-'+c;
	});

	if ( dump ) {
		console.log('Unresolved Class:');
		console.error(dump);
	}
	
	return cls.join(' ') + ' '; // Join back to single string and include raw. Then return.
}
