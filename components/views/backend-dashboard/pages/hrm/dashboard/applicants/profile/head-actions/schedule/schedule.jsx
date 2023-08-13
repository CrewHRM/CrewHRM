import React, { useState } from "react";
import { __ } from "../../../../../../../../../utilities/helpers.jsx";
import { DropDown } from "../../../../../../../../../materials/dropdown/dropdown.jsx";
import style from './schedule.module.scss';
import { TextField } from "../../../../../../../../../materials/text-field/text-field.jsx";

import meet from '../../../../../../../../../images/meet.svg';
import avatar from '../../../../../../../../../images/avatar.svg';
import { CoverImage } from "../../../../../../../../../materials/image/image.jsx";
import { DateTimePeriodField } from "../../../../../../../../../materials/date-time/date-time.jsx";

const event_types = {
	call: {
		label: __( 'Call' ),
	},
	video_call: {
		label: __( 'Video Call' ),
	}
}

const guests = [
	{
		guest_user_id : 1,
		name          : 'Bessie Cooper',
		designation   : 'Candidate',
		avatar_url    : avatar,
	},
	{
		guest_user_id : 1,
		name          : 'Esther Howard',
		designation   : 'Organizer',
		avatar_url    : avatar,
	}
]

export function Schedule() {
	const [state, setState] = useState({
		values: {
			event_type: 'call',
			event_title: 'Call with Bessie copper - Account Manager',
		}
	});

	const setVal=(name, value)=>{
		setState({
			...state,
			values: {
				...state.values,
				[name]: value
			}
		});
	}
	
	return <div className={'schedule'.classNames(style)}>
		<div className={'margin-top-15 margin-bottom-15'.classNames()}>
			<span className={'d-block font-size-15 font-weight-500 margin-bottom-10'.classNames()}>
				{__( 'Event Type' )}
			</span>
			<DropDown 
				value={state.values.event_type} 
				options={Object.keys(event_types).map(e=>{return {value: e, label: event_types[e].label}})}
				onChange={event_type=>setVal('event_type', event_type)}/>
		</div>

		<div className={'margin-bottom-15'.classNames()}>
			<span className={'d-block margin-bottom-10 font-size-15 font-weight-500'.classNames() + 'label'.classNames(style)}>
				{__( 'Event Title' )}
			</span>
			<input 
				name="event_title"
				type="text"
				value={state.values.event_title} 
				onChange={e=>setVal('event_title', e.currentTarget.value)}
				className={'font-size-15 font-weight-500 line-height-24 text-color-primary'.classNames() + 'text-input'.classNames(style)}/>
		</div>

		<div className={'margin-bottom-15'.classNames()}>
			<DateTimePeriodField
				className={'text-input'.classNames(style) + 'border-radius-10'.classNames()}
				labelClassName={'d-block margin-bottom-10 font-size-15 font-weight-500'.classNames() + 'label'.classNames(style)}
				inputClassName={'font-size-15 font-weight-500 line-height-24 text-color-primary'.classNames()}/>
		</div>

		<div className={'margin-bottom-15'.classNames()}>
			<span className={'d-block margin-bottom-10 font-size-15 font-weight-500'.classNames() + 'label'.classNames(style)}>
				{__( 'Add Guest' )}
			</span>
			<div className={'guests'.classNames(style)}>
				{guests.map(guest=>{
					let {name, avatar_url, guest_user_id, designation} = guest;
					return <div key={guest_user_id} className={'d-flex align-items-center'.classNames()}>
						<CoverImage src={avatar_url} circle={true} width={40}/>
						<div className={'flex-1 margin-left-12'.classNames()}>
							<span className={'d-block font-size-15 font-weight-600 line-height-24 letter-spacing--15 text-color-primary margin-bototm-10'.classNames()}>
								{name}
							</span>
							<span className={'d-block font-size-14 font-weight-400 line-height-24 letter-spacing--14 text-color-secondary'.classNames()}>
								{designation}
							</span>
						</div>
					</div>
				})}
				<div>
					<span className={'cursor-pointer'.classNames()}>
						<i className={'ch-icon ch-icon-add-circle font-size-22 text-color-secondary d-inline-block vertical-align-middle margin-right-12'.classNames()}></i>
						<span className={'font-size-15 font-weight-500 line-height-24 letter-spacing--15 text-color-secondary'.classNames()}>
							{__( 'Add Attendee' )}
						</span> 
					</span>
				</div>
			</div>
		</div>

		<div className={'margin-bottom-15'.classNames()}>
			<span className={'d-block margin-bottom-10 font-size-15 font-weight-500'.classNames() + 'label'.classNames(style)}>
				{__( 'Location' )}
			</span>
			<TextField 
				image={meet}
				icon_position='right' 
				onChange={v=>setVal('event_location', v)}
				className={'text-input'.classNames(style) + 'border-radius-10'.classNames()}
				inputClassName={'font-size-15 font-weight-500 line-height-24 text-color-primary'.classNames()}/>
		</div>

		<div className={'margin-bottom-15'.classNames()}>
			<span className={'d-block margin-bottom-10 font-size-15 font-weight-500'.classNames() + 'label'.classNames(style)}>
				{__( 'Note' )}
			</span>
			<div className={'flex-1'.classNames()}>
				<textarea 
					className={'font-size-15 font-weight-500 line-height-24 text-color-primary'.classNames() + 'text-input'.classNames(style)}
					onChange={e=>setVal('note', e.currentTarget.value)}
					placeholder={__( 'Write your comments' )}></textarea>
			</div>
		</div>

		<div className={'d-flex align-items-center margin-bottom-15'.classNames()}>
			<div className={'flex-1'.classNames()}>
			</div>
			<div>
				<button className={'button button-primary'.classNames()}>
					{__( 'Send Invitation' )}
				</button>
			</div>
		</div>
	</div>
}