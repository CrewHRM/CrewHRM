import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { StickyBar } from "../../../../../materials/sticky-bar/sticky-bar.jsx";
import { __ } from "../../../../../utilities/helpers.jsx";
import { Tabs } from "../../../../../materials/tabs/tabs.jsx";

import logo_extended from '../../../../../images/logo-extended.svg';
import style from './editor.module.scss';

const steps = [
	{
		id    : 'job_details',
		label : __( 'Job Details' )
	},
	{
		id    : 'hiring_flow',
		label : __( 'Hiring Flow' )
	},
	{
		id    : 'application_form',
		label : __( 'Application Form' )
	},
	{
		id    : 'assesments',
		label : __( 'Assessments' )
	},
	{
		id    : 'team_members',
		label : __( 'Team Members' )
	},
];

export function JobEditor() {
	let {job_id: id} = useParams();
	const job_id = id==='new' ? 0 : id;

	const [state, setState] = useState({
		is_auto_saving: true,
		active_tab: 'job_details'
	});

	const navigateTab=(tab)=>{
		setState({
			...state,
			active_tab: tab
		})
	}

	return <>
		<StickyBar>
			<div className={'d-flex align-items-center'.classNames()}>
				<div className={'flex-1'.classNames()}>
					<span className={'cursor-pointer'.classNames()} onClick={()=>window.history.back()}>
						<i className={'ch-icon ch-icon-arrow-left font-size-15 text-color-primary margin-right-5 vertical-align-middle'.classNames()}>

						</i> <span className={'font-size-15 font-weight-500 letter-spacing--3 text-color-secondary vertical-align-middle'.classNames()}>
							{__( 'Back' )}
						</span>
					</span>
				</div>
				<div className={'flex-1 text-align-center'.classNames()}>
					<img src={logo_extended} style={{width: 'auto', height: '16px'}} className={'d-inline-block'.classNames()}/> 
				</div>
				<div className={'flex-1 text-align-right'.classNames()}>
					{
						state.is_auto_saving && <span className={'font-size-15 font-weight-400 letter-spacing--3 text-color-secondary margin-right-20'.classNames()}>
							{__( 'Auto saving ...' )}
						</span> || null
					}
					<button className={'button button-primary'.classNames()} disabled={state.is_auto_saving}>
						{__( 'Save and Continue' )}
					</button>
				</div>
			</div>
		</StickyBar>
		<div className={'tabs-wrapper'.classNames(style)}>
			<div>
				<Tabs 
					theme="sequence"
					onNavigate={navigateTab}
					active={state.active_tab} 
					tabs={steps.map(s=>{return {
						...s,
						label: <span className={`font-size-15 font-weight-400 letter-spacing--3 text-color-${s.id==state.active_tab ? 'primary' : 'secondary'}`.classNames()}>
							{s.label}
						</span>
					}})}/>
			</div>
		</div>
		<div>This is job editor {job_id}</div>
	</>
}