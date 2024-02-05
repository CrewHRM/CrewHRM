import React from "react";

import { __, isEmpty, getRandomString } from "crewhrm-materials/helpers.jsx";
import {week_days} from 'crewhrm-materials/data.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field';
import { ToggleSwitch } from 'crewhrm-materials/toggle-switch/ToggleSwitch.jsx';
import PlusImg from 'crewhrm-materials/static/images/plus-ash.svg';
import TrashImg from 'crewhrm-materials/static/images/trash-01.svg';

import schedule_style from './schedule.module.scss';
import { useEffect } from "react";

const default_schedule = {
	monday: {
		enable: true,
		slots: {
			[getRandomString()]: {
				start: '10:00',
				end: '18:00',
			}
		}
	},
	tuesday: {
		enable: true,
		slots: {
			[getRandomString()]: {
				start: '10:00',
				end: '18:00',
			}
		}
	},
	wednesday: {
		enable: true,
		slots: {
			[getRandomString()]: {
				start: '10:00',
				end: '18:00',
			}
		}
	},
	thursday: {
		enable: true,
		slots: {
			[getRandomString()]: {
				start: '10:00',
				end: '18:00',
			}
		}
	},
	friday: {
		enable: true,
		slots: {
			[getRandomString()]: {
				start: '10:00',
				end: '18:00',
			}
		}
	},
	saturday: {
		enable: false,
		slots: {
			[getRandomString()]: {
				start: '10:00',
				end: '18:00',
			}
		}
	},
	sunday: {
		enable: false,
		slots: {
			[getRandomString()]: {
				start: '10:00',
				end: '18:00',
			}
		}
	}
}

export function WeeklyScheduleEditor( props ) {
	
	const {
		onChange,
		value: schedules={}
	} = props;

	const addSlot=(day)=>{
		const {value: schedules={}} = props;
		schedules[day].slots[getRandomString()] = {
			start: '10:00',
			end: '18:00'
		}
		onChange(schedules);
	}
	
	const updateSlot=(day, id, name, value)=>{
		
		const {value: schedules={}} = props;

		if ( id ) {
			schedules[day].slots[id][name] = value; // Update specific slot
		} else {
			schedules[day][name] = value; // Update specific day
		}

		onChange(schedules);
	}

	const deleteSlot=(day, id )=>{
		
		const {value: schedules={}} = props;

		delete schedules[day].slots[id];

		onChange(schedules);
	}

	useEffect(()=>{
		// Create the initial placeholder if the schedule is empty
		if ( isEmpty( schedules ) ) {
			onChange( default_schedule );
		}
	}, []);

	return <div
		className={
			'margin-top-10'.classNames() +
			'custom-work-schedule-wrapper crew-hrm-border'.classNames(schedule_style)
		}
	>
		{
			Object.keys(schedules).map(day=>{
				
				const {enable, slots={}} = schedules[day];

				return <div
					key={day}
					className={
						'd-flex justify-content-space-between'.classNames() +
						'custom-work-schedule'.classNames(schedule_style)
					}
				>
					<div className={'d-flex'.classNames() + 'custom-work-schedule-day'.classNames(schedule_style)}>
						<ToggleSwitch 
							checked={enable} 
							onChange={() => updateSlot(day, null, 'enable', !enable)}/>
						<span
							className={'color-text font-size-15 font-weight-500 line-height-24 margin-left-10'.classNames()}
						>
							{week_days[day]}
						</span>
					</div>
					<div
						className={
							`d-flex flex-direction-column align-items-center row-gap-15`.classNames() +
							'custom-work-schedule-time-wrapper'.classNames(schedule_style)
						}
						style={!enable ? {flex: 1} : {}}
					>
						{
							!enable ? 
							<span className={'color-text-light font-size-17 font-weight-400 line-height-24'.classNames()}>
								{__('Off Day')}
							</span> :
							Object.keys(slots).map(schedule_id=>{
								
								const {start, end} = slots[schedule_id];

								return <div
									key={schedule_id}
									className={
										'd-flex align-items-center column-gap-15'.classNames() +
										'custom-work-schedule-time'.classNames(schedule_style)
									}
								>
									<TextField
										value={start || ''}
										type="time"
										onChange={(v) => updateSlot(day, schedule_id, 'start', v)}
									/>
									<span className={'line'.classNames(schedule_style)}></span>
									<TextField
										value={end || ''}
										type="time"
										onChange={(v) => updateSlot(day, schedule_id, 'end', v)}
									/>
									<img 
										className={'cursor-pointer'.classNames()} 
										src={TrashImg}
										onClick={()=>deleteSlot(day, schedule_id)}
									/>
								</div>
							})
						}
					</div>
					{
						!enable ? null :
						<div 
							className={'addshedule'.classNames(schedule_style) + 'cursor-pointer'.classNames()}
							onClick={()=>addSlot(day)}
						>
							<img src={PlusImg} alt="addicon" />
						</div>
					}
				</div>
			})
		}
	</div>
}
