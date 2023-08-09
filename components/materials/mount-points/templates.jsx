import React, { useEffect, useRef, useState } from "react";

import { DoAction } from "../../utilities/hooks.jsx";

import style from './mount.module.scss';
import style_library from '../../styles/index.module.scss';
import icons from '../../icons/crewhrm/style.module.scss';
import font_family from '../../fonts/loader.module.scss';

export function MountPoint(props){
	const [ready, setReady] = useState(false);

	useEffect(()=>{
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
				console.error(dump);
			}
			
			return cls.join(' ') + ' '; // Join back to single string and include raw. Then return.
		}

		String.prototype.idNames = function(style) {
			return this.classNames(style); // Because both uses same style object. Added two to avoid confusion.
		}

		// Replace the mount point styles
		if ( props.element ) {
			props.element.className = (props.element.className || '').classNames() + 'font-family-figtree'.classNames(font_family);
			props.element.id = (props.element.id || '').idNames();
		}
		
		setReady(true);
	}, []);

	return ready && <div className={'crew'.classNames(style)}>
		{props.children}
	</div>
}


export function Slot(props) {
	const {children, name} = props;

	return <>
		<DoAction position="before" action={name}/>
		{children}
		<DoAction position="after" action={name}/>
	</>
}
