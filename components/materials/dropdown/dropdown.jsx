import React, { useState } from "react";

import style from './dropdown.module.scss';
import {Popup} from "../popup/index.jsx";

export function DropDown(props) {
	const {
		value: selected_value, 
		options, 
		onChange, 
		transparent, 
		className='',
		textClassName='font-size-15 font-weight-400 text-color-primary'.classNames(),
		iconClassName='ch-icon ch-icon-arrow-down margin-left-10 font-size-18 text-color-secondary'.classNames(),
		position="bottom right"
	} = props;

	return <Popup
		position={position}
		on="click"
		closeOnDocumentClick
		mouseLeaveDelay={300}
		mouseEnterDelay={0}
		contentStyle={{ padding: '0px', border: 'none' }}
		arrow={false}
		trigger={<div className={`dropdown ${transparent ? 'transparent' : ''}`.classNames(style) + 'cursor-pointer d-inline-flex align-items-center border-radius-5'.classNames() + className}>
				<span className={textClassName}>
					{options.find(o=>o.value==selected_value).label}
				</span>
				<i className={iconClassName}></i>
			</div>
		}>
		<div className={"dropdown-popup".classNames(style) + 'border-radius-6'.classNames()}>
			{options.map(option=>{
				let {value, label} = option;
				let active_class = value == selected_value ? 'active' : '';
				return <div key={value} className={active_class.classNames(style)} onClick={()=>onChange(value)}>
					{label}
				</div>
			})}
		</div>
    </Popup>	
}