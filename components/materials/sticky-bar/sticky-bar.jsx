import React from "react";

import style from './style.module.scss';

export function StickyBar(props) {
	const {children} = props;

	return <div data-crewhrm-selector="sticky-bar" className={'sticky-bar'.classNames(style)}>
		{children}
	</div>
}