import React from "react";

import style from './image.module.scss';

export function CoverImage(props) {
	const {src, height, width, circle, className=''} = props;

	return <div className={`cover-image ${circle ? 'circle' : ''}`.classNames(style) + className} style={{backgroundImage: 'url('+src+')', width: width+'px', height: (height || width)+'px'}}>
		 
	</div>
}