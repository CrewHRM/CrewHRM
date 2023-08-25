import React, { useContext } from "react";

import style from './options.module.scss';
import { useParams } from "react-router-dom";
import { settings_fields } from "../field-structure.jsx";
import { ContextSettings } from "../hrm-settings.jsx";
import { ToggleSwitch } from "../../../../materials/toggle-switch/ToggleSwitch.jsx";
import { TextField } from "../../../../materials/text-field/text-field.jsx";

const label_class = 'd-block font-size-17 font-weight-500 line-height-24 letter-spacing--17 text-color-primary'.classNames();

export function Options(props) {
	const {segment, sub_segment} = useParams();
	const {fields, icon, label} = settings_fields[segment].segments[sub_segment];
	const field_keys = Object.keys(fields);
	const {values, setValue} = useContext(ContextSettings)

	const satisfyLogic=(when)=>{
		const pointer  = when[0];
		const operator = when.length>2 ? when[1] : '===';
		const operand  = when[ when.length>2 ? 2 : 1 ];
		const value    = values[pointer];

		let _return;

		switch ( operator ) {
			case '===' :
				_return = value === operand;
				break;

			case '==' :
				_return = value == operand;
				break;
		}

		return _return;
	}

	return <div className={'container'.classNames(style) + 'padding-top-50 padding-bottom-50'.classNames()}>
		<div className={'padding-30 background-color-white border-radius-5 box-shadow-thin'.classNames()}>
			<span className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 text-color-light'.classNames()}>
				{label}
			</span>

			{field_keys.map((key, index)=>{
				const {label, type, options=[], when} = fields[key];
				const is_last = index==field_keys.length-1;

				if ( when && !satisfyLogic( when ) ) {
					return null;
				}

				return <div key={key} className={`d-flex align-items-center padding-vertical-25 ${!is_last ? 'border-bottom-1 border-color-tertiary' : ''}`.classNames()}>
					{type=='switch' && <>
						<div className={'flex-1'.classNames()}>
							<span className={label_class}>{label}</span>
						</div>
						<div>
							<ToggleSwitch onChange={enabled=>setValue(key, enabled)}/>
						</div>
					</> || null}

					{type=='text' && <div className={'flex-1'.classNames()}>
						<span className={label_class}>{label}</span>
						<TextField/>
					</div> || null}
				</div>
			})}
		</div>
	</div>
}