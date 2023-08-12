import React from "react";

import style from './image.module.scss';

export function CoverImage(props) {
	const {src, height, width, circle, className=''} = props;
	
	const _height = height || width;
	const css     = {
		backgroundImage: 'url('+src+')', 
		width: width ? ( width + ( ! isNaN( width ) ? 'px' : '' ) ) : 'auto', 
		height: _height ? ( _height + ( ! isNaN( _height ) ? 'px' : '' ) ) : 'auto',
	}

	return <div className={`cover-image ${circle ? 'circle' : ''}`.classNames(style) + className} style={css}></div>
}