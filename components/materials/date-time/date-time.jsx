import React from "react";
import { TextField } from "../text-field/text-field.jsx";
import { __ } from "../../utilities/helpers.jsx";

export function DateField(props) {
	let {onChange, className, inputClassName} = props;

	return <TextField
		icon="ch-icon ch-icon-calendar"
		type="date"
		pattern="\d{4}-\d{2}-\d{2}"
		icon_position="right"
		{...{onChange, className, inputClassName}}/>
}

export function TimeField(props) {
	let {onChange, className, inputClassName} = props;

	return <TextField
		icon="ch-icon ch-icon-clock-1"
		type="time"
		icon_position="right"
		{...{onChange, className, inputClassName}}/>
}

export function DateTimeField(props) {
	
}

export function DateTimePeriodField(props) {
	let {onChange, className, inputClassName, labelClassName} = props;

	const setVal=()=>{

	}

	return <div className={'d-flex'.classNames()}>
		<div className={'flex-5 margin-right-20'.classNames()}>
			<span className={labelClassName}>
				{__('Date')}
			</span>
			<DateField 
				onChange={v=>setVal('date', v)}
				{...{className, inputClassName}}/>
		</div>
		<div className={'flex-6'.classNames()}>
			<span className={labelClassName}>
				{__('Time')}
			</span>
			<div className={"d-flex align-items-center".classNames()}>
				<div className={'flex-1'.classNames()}>
					<TimeField 
						onChange={v=>setVal('time_from', v)}
						{...{className, inputClassName}}/>
				</div>
				<div className={'margin-left-10 margin-right-10'.classNames()}>
					-
				</div>
				<div className={'flex-1'.classNames()}>
					<TimeField 
						onChange={v=>setVal('time_to', v)}
						{...{className, inputClassName}}/>
				</div>
			</div>
		</div>
	</div>
}