import React, { useState } from "react";
import { __ } from "../../../../../../../utilities/helpers.jsx";

import style from './calendar.module.scss';
import { Popup } from "../../../../../../../materials/popup/index.jsx";
import { ScheduleCard } from "../../../../../../../materials/schedule-card/schedule-card.jsx";

const schadule = {
	schedule_id: 1,
	schedule_title: 'Job Interview with Kristin',
	time_frame: '01:00 - 02:00',
	excerpt: 'Account Manager',
	note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ',
	date: 'Monday, November 27',
	agenda: 'Interview for Account Manager',
	guests: [
		{
			name: 'Risat Rajin',
			email: 'risat@example.com'
		},
		{
			name: 'Badsha',
			email: 'badsha@example.com'
		},
		{
			name: 'JK',
			email: 'jk@example.com'
		}
	],
	type: 'meet',
	link: 'http://google.com',
};

const schedules = Array(5).fill(schadule).map((s, i)=>{
	return {...s, schedule_id: s.schedule_id+i};
});

export function Calendar(props) {
	const [state, setState] = useState({
		date: new Date(),
		opened_schedule: null,
	});

	const getDateSlots=()=>{
		const dates = [];
		for ( let i = -3; i <= 3; i++ ) {
			let date =  new Date(state.date.getTime());
			date.setDate( date.getDate() + i );
			dates.push( date );
		}

		return dates;
	}

	return <div className={'calendar'.classNames(style)}>
		<div className={'d-flex align-items-center'.classNames() + 'header'.classNames(style)}>
			<div className={'text-color-primary'.classNames()}>
				{__( 'Calendar' )}
			</div>
			<div className={'flex-1 text-align-right text-color-primary'.classNames()}>
				{state.date.getFullYear()}
			</div>
		</div>

		<div className={'dates'.classNames(style) }>
			{getDateSlots().map(d=>{
				const active_class = state.date.getTime() === d.getTime() ? 'active ' : '';
				const day          = d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
				const dt           = d.toLocaleDateString('en-US', { day: '2-digit' });

				return <div key={d.getTime()} className={active_class.classNames(style) }>
					<strong className={'text-color-secondary'.classNames()}>{dt}</strong>
					<span className={'text-color-tertiary'.classNames()}>{day}</span>
				</div>
			})}
		</div>
		<br/>
		
		<div className={'schedules'.classNames(style)}>
			{schedules.map((schedule, index)=>{
				let {schedule_title, time_frame, excerpt, schedule_id} = schedule;
				let active_class = schedule_id && schedule_id == state.opened_schedule && 'active' || '';

				return <Popup
					key={schedule_id}
					position="right center"
					on="click"
					closeOnDocumentClick={true}
					mouseLeaveDelay={300}
					mouseEnterDelay={0}
					contentStyle={{ padding: '0px', border: 'none', width: '333px' }}
					arrow={true}
					trigger={<div className={'d-flex align-items-center'.classNames() + active_class.classNames(style)} onClick={()=>setState({...state, opened_schedule: schedule_id})}>
							<div>
								<i className={'ch-icon ch-icon-note-favorite'.classNames() + 'calendar-icon'.classNames(style)}></i>
							</div>
							<div className={'flex-1'.classNames() + 'content'.classNames(style)}>
								<strong>{schedule_title}</strong>
								<span>{time_frame}</span>
								<small>{excerpt}</small>
							</div>
							<div>
								<i className={'ch-icon ch-icon-arrow-right-1'.classNames() + 'arrow-icon'.classNames(style)}></i>
							</div>
						</div>
					}>
					<ScheduleCard {...schedule} channel=""/>
				</Popup> 
			})}
		</div>
	</div>
}
