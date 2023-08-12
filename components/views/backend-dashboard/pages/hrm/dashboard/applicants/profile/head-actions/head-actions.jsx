import React, { useContext, useState } from "react";

import style from './head.module.scss';
import { Comment } from "./comment/comment.jsx";
import { Schedule } from "./schedule/schedule.jsx";
import { Email } from "./email/email.jsx";
import { __ } from "../../../../../../../../utilities/helpers.jsx";
import { DropDown } from "../../../../../../../../materials/dropdown/dropdown.jsx";
import { ContextApplicants } from "../../applicants.jsx";

const segments = [
	{
		icon     : 'ch-icon ch-icon-sms',
		renderer : Email
	},
	{
		icon     : 'ch-icon ch-icon-note-favorite',
		renderer : Schedule
	},
	{
		icon     : 'ch-icon ch-icon-message',
		renderer : Comment
	}
];

export function HeadActions() {
	const {job} = useContext(ContextApplicants);
	const {application_stages=[], current_stage} = job;

	const [state, setState] = useState({
		active_segment: null,
		current_application_stage: current_stage
	});

	const toggleSegment=(index)=>{
		setState({
			...state,
			active_segment: state.active_segment===index ? null : index
		});
	}

	const {renderer: ActiveComp} = segments[state.active_segment] || {};
	
	return <div className={'head'.classNames(style) + 'margin-bottom-13'.classNames()}>
		<div className={'nav'.classNames(style) + 'd-flex align-items-center'.classNames()}>
			<div className={'flex-1'.classNames()}>
				{segments.map((segment, i)=>{
					let {icon, renderer: Comp} = segment;

					let classes = 'font-size-20 cursor-pointer margin-right-24 ';
					classes += state.active_segment===i ? 'text-color-primary' : 'text-color-tertiary';

					return <i key={i} className={icon.classNames() + classes.classNames()} onClick={()=>toggleSegment(i)}></i>
				})}
			</div>
			<div className={'d-flex align-items-center'.classNames()}>
				<span className={'font-size-15 font-weight-400 text-color-primary'.classNames()}>
					{__( 'Move to' )}
				</span>

				<DropDown 
					className={'margin-left-10 margin-right-10'.classNames()}
					value={state.current_application_stage}
					options={application_stages.map(s=>{return {value: s.id, label: s.label}})}
					onChange={s=>setState({...state, current_application_stage: s})}/>

				<i className={'ch-icon ch-icon-more-1 font-size-20 text-color-secondary cursor-pointer'.classNames()}></i>
			</div>
		</div>
		
		{ActiveComp && <>
			<div className={'content-area'.classNames(style)}>
				<ActiveComp onClose={()=>setState({...state, active_segment: null})}/>
			</div>
		</> || null}
	</div>
}