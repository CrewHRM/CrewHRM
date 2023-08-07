import React from "react";
import { WpDashboardFullPage } from "../../templates/full-page-container/full-page-container.jsx";
import { StickyBar } from "../../../materials/sticky-bar/sticky-bar.jsx";

import style from './style.module.scss';

function Header() {
	return <StickyBar>
		<div className={'d-flex align-items-center'.classNames()}>
			<div>
				Menu
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
		<div>This is HRM backend</div>
	</WpDashboardFullPage> 
}