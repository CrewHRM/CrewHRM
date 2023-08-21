import React, { useState } from "react";
import { Tabs } from "../../../../../../../materials/tabs/tabs.jsx";
import { __ } from "../../../../../../../utilities/helpers.jsx";
import { TextField } from "../../../../../../../materials/text-field/text-field.jsx";

import dummy_avatar from '../../../../../../../images/avatar.svg';

import style from './sidebar.module.scss';
import { Line } from "../../../../../../../materials/line/line.jsx";
import { CoverImage } from "../../../../../../../materials/image/image.jsx";

const applicant = {
	application_id: 1,
	name: 'Esther Howard',
	action_time: '19 min ago',
	src: dummy_avatar
}

const applicants = Array(5).fill(applicant).map((a, i)=>{
	return {...a, application_id: a.application_id+i}
});

const steps = [
	{
		id: 'q',
		label: <span className={'font-size-13 font-weight-500 line-height-24'.classNames()}>
				{__( 'Qualified' )}
			</span>
	},
	{
		id: 'dq',
		label: <span className={'font-size-13 font-weight-500 line-height-24'.classNames()}>
				{__( 'Disqualified' )}
			</span>
	}
];

export function Sidebar() {
	const [state, setState] = useState({active_tab: 'q'});

	return <div className={'sidebar'.classNames(style)}>
		<Tabs 
			active={state.active_tab} 
			tabs={steps} 
			onNavigate={active_tab=>setState({...state, active_tab})} 
			theme="transparent"/>

		<div className={'padding-15'.classNames()}>
			<TextField 
				className={'border-1 border-color-tertiary border-radius-5 padding-vertical-10 padding-horizontal-11 height-40'.classNames()}
				iconClass={"ch-icon ch-icon-search-normal-1 font-size-16 text-color-light".classNames()} 
				placeholder={__( 'Search by name' )}/>
		</div>

		<Line/>

		<div className={'list'.classNames(style)}>
			{applicants.map((applicant, i)=>{
				let {src, name, action_time, application_id} = applicant;

				return <div key={application_id}>
					<div className={'d-flex align-items-center'.classNames()}>
						<CoverImage src={src} width={48} circle={true}/>
						<div className={'flex-1 margin-left-10'.classNames()}>
							<span className={'d-block font-size-17 font-weight-600 letter-spacing--17 text-color-primary margin-bottom-2'.classNames()}>
								{name}
							</span>
							<span className={'font-size-13 font-weight-400 line-height-24 text-color-light'.classNames()}>
								{action_time}
							</span>
						</div>
					</div>
				</div>
			})}
		</div>
	</div>
}