import React from "react";

import style from './image.module.scss';

// To Do: Add a mode to to determine height based on ratio automatically.
export function CoverImage(props) {
	const {src, children, backgroundColor, height, width, circle, className=''} = props;
	
	const _height = height || width;
	const css     = {
		backgroundColor,
		backgroundImage: src ? 'url('+src+')' : null, 
		width: width ? ( width + ( ! isNaN( width ) ? 'px' : '' ) ) : 'auto', 
		height: _height ? ( _height + ( ! isNaN( _height ) ? 'px' : '' ) ) : 'auto',
	}

	return <div className={`cover-image ${circle ? 'circle' : ''}`.classNames(style) + 'd-flex align-items-center justify-content-center'.classNames() + className} style={css}>
		{children}
	</div>
}