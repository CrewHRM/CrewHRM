import React from "react";

import style from './line.module.scss';

export function Line(props) {
	const {orientation='horizontal', show=true} = props;
	return show && <div className={`line ${orientation}`.classNames(style)}></div>
}