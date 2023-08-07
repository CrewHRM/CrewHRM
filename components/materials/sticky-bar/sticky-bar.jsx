import React from "react";

import style from './style.module.scss';

export function StickyBar(props) {
	const {children} = props;

	return <div className={'sticky-bar'.classNames(style)}>
		{children}
	</div>
}