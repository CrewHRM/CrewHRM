import { useEffect, useState } from "react";

import style_library from '../styles/index.module.scss';

export function MountPoint(props){
	const [ready, setReady] = useState(false);

	useEffect(()=>{
		String.prototype.classNames = function(style, append_raw='') {
			if ( append_raw ) {
				append_raw = ' ' + append_raw;
			}

			let dump = '';
			let cls  = this.split(' '); 		// Split multiples by space
			cls      = cls.map(c=>c.trim()); // Trim leading and trailing slashes
			cls      = cls.filter(c=>c); 	// Remove empty strings

			// Apply dynamic classes
			cls = cls.map(c=>{
				let class_name = (style || style_library)[c];
				if ( ! class_name ) {
					dump += ' ' + c;
				}

				return class_name || c;
			});

			if ( dump ) {
				console.error(dump);
			}
			
			return cls.join(' ') + append_raw; // Join back to single string and include raw. Then return.
		}

		String.prototype.idNames = function(style, append_raw='') {
			return this.classNames(style, append_raw); // Because both uses same style object. Added two to avoid confusion.
		}

		// Replace the mount point styles
		if ( props.element ) {
			props.element.className = (props.element.className || '').classNames();
			props.element.id = (props.element.id || '').idNames();
		}
		
		setReady(true);
	}, []);

	return ready ? props.children : null;
}