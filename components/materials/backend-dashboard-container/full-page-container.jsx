import React from "react";

import style from './style.module.scss';

export function WpDashboardFullPage(props) {
	const {children} = props;

	return <div data-crewhrm-selector="wp-dashboard" className={'wrapper'.classNames(style)}>
		{children}
	</div>
}