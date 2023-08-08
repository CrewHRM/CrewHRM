import React from "react";
import { WpDashboardFullPage } from "../../templates/full-page-container/full-page-container.jsx";
import { StickyBar } from "../../../materials/sticky-bar/sticky-bar.jsx";

import style from './style.module.scss';
import { Slot } from "../../../utilities/templates.jsx";
import { __ } from "../../../utilities/helpers.jsx";

function Header() {
	return <StickyBar>
		<div className={'d-flex align-items-center'.classNames()}>
			<div>
				{__( 'Menu' )} <span className={'ch-icon ch-icon-envelope'.classNames()}></span>
			</div>
			<div className={'flex-1 text-right'.classNames()}>
				<div className={'d-inline-block'.classNames()}>
					<button className={'button button-primary'.classNames()}>
						Create A New Job
					</button>
				</div>
			</div>
		</div>
	</StickyBar>
}

export function HRM(props) {
	return <WpDashboardFullPage>
		<Header/>
		<Slot name="hrm_dashboard">
			<div>This is HRM backend</div>
		</Slot>
	</WpDashboardFullPage> 
}