import React, { useState } from "react";
import { __ } from "../../../../../../../utilities/helpers.jsx";

import style from './email.module.scss';

export function Email(props) {
	const {onClose} = props;
	const [state, setState] = useState({
		values:{
			from    : 'Risat Rajin (risatrajin@gmail.com)',
			to      : 'Bessie Cooper (debbie.baker@example.com)',
			subject : 'Call with Bessie copper - Account Manager',
			body    : null
		}
	});

	const setVal=(e)=>{
		let {name, value} = e.currentTarget;

		setState({
			...state,
			values: {
				...state.values,
				[name]: value
			}
		});
	}
	
	const fields = {
		from: {
			label: __( 'From' )
		},
		to: {
			label: __( 'To' )
		},
		subject: {
			label: __( 'Subject' )
		},
		body: {
			label: __( 'Message' ),
			placeholder: __( 'Write your message' ),
		}
	}

	return <div data-crewhrm-selector="email">
		{Object.keys(fields).map(field=>{
			let {label, placeholder} = fields[field];
			return <div key={field} className={'d-flex margin-bottom-15'.classNames() + 'email-fields'.classNames(style)}>
				<div className={'margin-right-10 font-size-15 font-weight-500'.classNames() + 'label'.classNames(style)}>
					{label}
				</div>
				<div className={'flex-1'.classNames()}>
					{
						field=='body' && 
						<textarea 
							name={field}
							className={'font-size-15 font-weight-500 line-height-24 color-primary'.classNames()}
							onChange={setVal}>{state.values[field]}</textarea> || 
						<input 
							name={field}
							type="text" 
							placeholder={placeholder} 
							value={state.values[field]} 
							onChange={setVal}
							className={'font-size-15 font-weight-500 line-height-24 color-primary'.classNames()}/>
					}
				</div>
			</div>
		})}

		<div className={'d-flex align-items-center'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<i className={'ch-icon ch-icon-paperclip-2 font-size-20 color-primary vertical-align-middle'.classNames()}>
				
				</i> <span className={'font-size-15 font-weight-400 color-primary'.classNames()}>
					{__( 'Attach a file' )}
				</span>
			</div>
			<div>
				<button className={'button button-primary'.classNames()}>
					{__( 'Send Email' )}
				</button>
			</div>
		</div>
	</div>
}