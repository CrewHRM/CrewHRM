import React, { useContext, useState } from "react";

import style from './head.module.scss';
import { Comment } from "./comment/comment.jsx";
import { Email } from "./email/email.jsx";
import { __ } from "../../../../../../../../utilities/helpers.jsx";
import { DropDown } from "../../../../../../../../materials/dropdown/dropdown.jsx";
import { ContextApplicants } from "../../applicants.jsx";

export function HeadActions() {

	const segments = [
		{
			icon     : 'ch-icon ch-icon-sms text-color-lighter',
			title    : __( 'Send Email' ),
			renderer : Email,
			tagline  : <span className={'font-size-15 font-weight-500 text-color-primary'.classNames()}>
						{__( 'Email' )}
					</span>
		},
		{
			icon     : 'ch-icon ch-icon-message text-color-lighter',
			title    : __( 'Internal Comment' ),
			renderer : Comment,
			tagline  : <>
						<span className={'font-size-15 font-weight-500 text-color-primary'.classNames()}>
							{(__( 'Add a comment' ))}
						</span> <span className={'font-size-13 font-weight-400 text-color-light'}>
							{__( 'Candidates never see comments.' )}
						</span>
					</>
		},
		{
			icon     : 'ch-icon ch-icon-slash text-color-danger',
			title    : __( 'Disqualify' ),
			onClick  : disqualifyApplicant,
		}
	];

	const {job} = useContext(ContextApplicants);
	const {application_stages=[], current_stage} = job;

	const [state, setState] = useState({
		active_segment: null,
		current_application_stage: current_stage
	});

	// To Do: Retain form data even after segment switch
	const toggleSegment=(index=null)=>{
		setState({
			...state,
			active_segment: state.active_segment===index ? null : index
		});
	}

	const disqualifyApplicant=()=>{

	}

	const {
		renderer: ActiveComp, 
		icon: active_icon, 
		tagline
	} = segments[state.active_segment] || {};
	
	return <div className={'head'.classNames(style) + 'margin-bottom-13'.classNames()}>
		<div className={'d-flex align-items-center box-shadow-thin padding-vertical-15 padding-horizontal-30'.classNames()}>
			<div className={'flex-1'.classNames()}>
				{segments.map((segment, i)=>{
					let {icon, onClick, title} = segment;

					let classes = 'font-size-20 cursor-pointer margin-right-24 ';
					classes += state.active_segment===i ? 'text-color-primary' : '';

					return <i 
						key={i} 
						title={title}
						className={icon.classNames() + classes.classNames()} 
						onClick={()=>onClick ? onClick() : toggleSegment(i)}></i>
				})}
			</div>
			<div className={'d-flex align-items-center'.classNames()}>
				<span className={'font-size-15 font-weight-400 text-color-primary'.classNames()}>
					{__( 'Move to' )}
				</span>

				<DropDown 
					className={'padding-vertical-5 padding-horizontal-12 margin-left-10 margin-right-10 border-1 border-color-primary border-radius-5'.classNames()}
					value={state.current_application_stage}
					options={application_stages.map(s=>{return {value: s.id, label: s.label}})}
					onChange={s=>setState({...state, current_application_stage: s})}/>

				<i className={'ch-icon ch-icon-more font-size-20 text-color-light cursor-pointer'.classNames()}></i>
			</div>
		</div>
		
		{ActiveComp && <>
			<div className={'content-area'.classNames(style)}>
				<div className={'d-flex align-items-center margin-bottom-15'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<span className={`d-inline-block ch-icon ${active_icon} font-size-20 text-color-primary margin-right-10 vertical-align-middle`.classNames()}>

						</span> {tagline}
					</div>
					<div>
						<i className={'ch-icon ch-icon-times font-size-24 text-color-light margin-left-10 cursor-pointer'.classNames()} onClick={()=>toggleSegment()}></i>
					</div>
				</div>
				<ActiveComp onClose={toggleSegment}/>
			</div>
		</> || null}
	</div>
}