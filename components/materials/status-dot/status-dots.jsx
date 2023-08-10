import React from "react";

import style from './status.module.scss';

export function StatusDot(props) {
	const {size=9, color} = props;
	const css = {
		width: size+'px', 
		height: size+'px', 
		backgroundColor: color
	}

	return <div className={'d-inline-block'.classNames() + 'square'.classNames(style)} style={css}></div>
}