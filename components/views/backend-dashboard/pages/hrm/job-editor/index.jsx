import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { StickyBar } from "../../../../../materials/sticky-bar/sticky-bar.jsx";
import { __ } from "../../../../../utilities/helpers.jsx";
import { Tabs } from "../../../../../materials/tabs/tabs.jsx";

import logo_extended from '../../../../../images/logo-extended.svg';
import { JobDetails } from "./job-details/job-details.jsx";
import { HiringFlow } from "./hiring-flow/hiring-flow.jsx";
import { ApplicationForm } from "./application-form/application-form.jsx";

import style from './editor.module.scss';

const steps = [
	{
		id    : 'job-details',
		label : __( 'Job Details' )
	},
	{
		id    : 'hiring-flow',
		label : __( 'Hiring Flow' )
	},
	{
		id    : 'application-form',
		label : __( 'Application Form' )
	},
];

export function ActionButtons(props) {
	const {onBack, onNext, backText=__( 'Back' ), nextText=__( 'Next' )} = props;

	return <div className={'d-flex margin-bottom-30'.classNames() + 'action-buttons'.classNames(style)}>
		{onBack && <div className={'back-button-container'.classNames(style)}>
			<button className={'d-inline-block button button-primary button-outlined button-outlined-secondary button-full-width'.classNames()} onClick={onBack}>
				{backText}
			</button>
		</div> || null}

		{onNext && <div className={'flex-1'.classNames()}>
			<button className={'button button-primary button-full-width'.classNames()} onClick={onNext}>
				{nextText}
			</button>
		</div> || null}
	</div>
}

export function JobEditor() {
	let {job_id: id} = useParams();
	const job_id = id==='new' ? 0 : id;

	const [state, setState] = useState({
		is_auto_saving: true,
		active_tab: 'job-details'
	});

	const navigateTab=(tab)=>{
		const current_index = steps.findIndex(s=>s.id==state.active_tab);

		if ( tab === 1 || tab === -1 ) {
			tab = steps[current_index+tab].id;
		}

		setState({
			...state,
			active_tab: tab
		});
	}

	const {active_tab} = state;

	return <>
		<StickyBar>
			<div className={'d-flex align-items-center'.classNames()}>
				<div className={'flex-1'.classNames()}>
					<span className={'cursor-pointer'.classNames()} onClick={()=>window.history.back()}>
						<i className={'ch-icon ch-icon-arrow-left font-size-15 text-color-primary margin-right-5 vertical-align-middle'.classNames()}>

						</i> <span className={'font-size-15 font-weight-500 letter-spacing--3 text-color-light vertical-align-middle'.classNames()}>
							{__( 'Back' )}
						</span>
					</span>
				</div>
				<div className={'flex-1 text-align-center'.classNames()}>
					<img src={logo_extended} style={{width: 'auto', height: '16px'}} className={'d-inline-block'.classNames()}/> 
				</div>
				<div className={'flex-1 text-align-right'.classNames()}>
					{
						state.is_auto_saving && <span className={'font-size-15 font-weight-400 letter-spacing--3 text-color-light margin-right-20'.classNames()}>
							{__( 'Auto saving ...' )}
						</span> || null
					}
					<button className={'button button-primary'.classNames()} disabled={state.is_auto_saving}>
						{__( 'Save and Continue' )}
					</button>
				</div>
			</div>
		</StickyBar>

		<div className={'editor-wrapper'.classNames(style)}>
			<div className={'box-shadow-thin padding-20'.classNames()}>
				<div>
					<Tabs 
						theme="sequence"
						onNavigate={navigateTab}
						active={state.active_tab} 
						style={{marginLeft: '-60px', marginRight: '-55px'}}
						tabs={steps.map(s=>{return {
							...s,
							label: <span className={`font-size-15 font-weight-400 letter-spacing--3 text-color-${s.id==state.active_tab ? 'primary' : 'light'}`.classNames()}>
								{s.label}
							</span>
						}})}/>
				</div>
			</div>
			
			<div className={'form'.classNames(style) + 'margin-top-40'.classNames()}>
				<div>
					{active_tab=='job-details' && <JobDetails navigateTab={navigateTab}/> || null}

					{active_tab=='hiring-flow' && <HiringFlow navigateTab={navigateTab}/> || null}

					{active_tab=='application-form' && <ApplicationForm navigateTab={navigateTab}/> || null}
				</div>
			</div>
		</div>
	</>
}