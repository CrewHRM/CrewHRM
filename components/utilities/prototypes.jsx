import style_library from '../styles/index.module.scss';
import icons from '../icons/crewhrm/style.module.scss';
import { is_production } from './helpers.jsx';

String.prototype.classNames = function (style) {
	let dump = '';
	let cls = this.split(' '); // Split multiples by space
	cls = cls.map((c) => c.trim()); // Trim leading and trailing slashes
	cls = cls.filter((c) => c); // Remove empty strings

	// Apply dynamic classes
	cls = cls.map((c) => {
		let source = style || (c.indexOf('ch-icon') > -1 ? icons : style_library);

		// Log if the class not found
		if (!source[c]) {
			dump += ' ' + c;
		}

		return (source[c] || '') + (!is_production ? ' ' + 'crewhrm-' + c : '');
	});

	if (dump) {
		console.warn('Unresolved Class: ' + dump);
	}

	return cls.join(' ') + ' '; // Join back to single string and include raw. Then return.
};
