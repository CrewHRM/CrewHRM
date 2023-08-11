import React from "react";

import style from './line.module.scss';

export function Line(props) {
	const {orientation='horizontal'} = props;

	return <div className={`line ${orientation}`.classNames(style)}>

	</div>
}