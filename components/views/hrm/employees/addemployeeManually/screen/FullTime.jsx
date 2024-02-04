import React, { useState, useContext } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { DateField } from 'crewhrm-materials/date-time.jsx';
import { RadioCheckbox } from 'crewhrm-materials/radio-checkbox.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field';

import {ContextAddEmlpoyeeManually} from '../index.jsx';
import EmployeeIndexCss from '../../index.module.scss';
import { WeeklyScheduleEditor } from '../../../weekly-schedule-editor/weekly-schedule-editor.jsx';

export default function FullTime() {

	const { onChange, values={} } = useContext(ContextAddEmlpoyeeManually);
	const enable_custom_weekly_hours = values.enable_custom_weekly_hours ? true : false;
	const is_provisional = values.is_provisional ? true : false;
	
	return (
		<>
			<div className={'d-flex margin-top-30'.classNames()}>
				<div className={'flex-1'.classNames()}>
					<div
						className={'color-text font-size-15 line-height-18 font-weight-500 margin-bottom-14'.classNames()}
					>
						{__('Working hours per week')}
						<span className={'color-error'.classNames()}>*</span>
					</div>
					<TextField 
						placeholder={__('ex. 30')} 
						value={values.weekly_working_hour || ''} 
						onChange={(v) => onChange('weekly_working_hour', (v || '').replace(/\D/g, ''))} />
				</div>
			</div>
			<div className={'d-flex align-items-center margin-top-30'.classNames()}>
				<label className={'d-block'.classNames()}>
					<input 
						type="checkbox" 
						checked={enable_custom_weekly_hours} 
						onChange={() => onChange('enable_custom_weekly_hours', !enable_custom_weekly_hours)} />
					<span className={'color-text font-size-15 font-weight-500 line-height-24 margin-left-10'.classNames()}>
						{__('Add Custom Working Hour')}
					</span>
				</label>
			</div>

			{
				!enable_custom_weekly_hours ? null : 
				<WeeklyScheduleEditor 
					value={values.weekly_schedules || {}} 
					onChange={value=>onChange('weekly_schedules', value)}/>
			}
			
			<div className={'d-flex align-items-center margin-top-30'.classNames()}>
				<label>
					<input 
						type="checkbox" 
						checked={is_provisional} 
						onChange={() => onChange('is_provisional', !is_provisional)}
					/>
					<span className={'color-text font-size-15 font-weight-500 line-height-24 margin-left-10'.classNames()}>
						{__('The employee is in a provisional period')}
					</span>
				</label>
			</div>

			{
				!is_provisional ? null :
				<div className={'d-flex margin-top-30'.classNames()}>
					<div className={'probation-date'.classNames(EmployeeIndexCss)}>
						<div
							className={'color-text font-size-15 font-weight-500 line-height-18 margin-bottom-14'.classNames()}
						>
							{__('Probation end date')}
							<span className={'margin-left-5 color-text-light'.classNames()}>{__('(optional)')}</span>
						</div>
						<DateField 
							value={values.probation_end_date} 
							onChange={date=>onChange('probation_end_date', date)}/>
					</div>
				</div>
			}
		</>
	);
}
