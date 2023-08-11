import React, { useState } from "react";
import { Tabs } from "../../../../../../../materials/tabs/tabs.jsx";
import { __ } from "../../../../../../../utilities/helpers.jsx";
import { TextField } from "../../../../../../../materials/text-field/text-field.jsx";

import style from './sidebar.module.scss';

export function Sidebar() {
	const [state, setState] = useState({active_tab: 'q'});

	const steps = [
		{
			id: 'q',
			label: <span className={'font-size-13 font-weight-500'.classNames()}>{__( 'Qualified' )}</span>
		},
		{
			id: 'dq',
			label: <span className={'font-size-13 font-weight-500'.classNames()}>{__( 'Disqualified' )}</span>
		}
	];

	return <div className={'sidebar'.classNames(style)}>
		<Tabs 
			active={state.active_tab} 
			tabs={steps} 
			onNavigate={active_tab=>setState({...state, active_tab})} 
			theme="transparent"/>

		<div className={'padding-15'.classNames()}>
			<TextField icon="search" placeholder={__( 'Search by name' )}/>
		</div>

		<div className={'filter'.classNames(style) + 'd-flex align-items-center'.classNames()}>
			<div className={'flex-1'.classNames(style)}>
				
			</div>
			<div>
				<i className={'ch-icon ch-icon-filter font-size-20 text-color-secondary'.classNames()}></i>
			</div>
		</div>
	</div>
}