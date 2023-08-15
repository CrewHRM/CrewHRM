import React, { useState } from "react";

import {Popup} from "../popup/index.jsx";
import style from './dropdown.module.scss';

const content_style = {
	padding: '0px',
	border: 'none',
}

export function DropDown(props) {
	const {
		value: selected_value, 
		options, 
		onChange, 
		transparent, 
		className='',
		textClassName='font-size-15 font-weight-400 text-color-primary'.classNames(),
		iconClassName='ch-icon ch-icon-arrow-down margin-left-10 font-size-18 text-color-secondary'.classNames(),
		position="bottom right",
		style: cssStyle={}
	} = props;

	return <Popup
		position={position}
		on="click"
		closeOnDocumentClick
		mouseLeaveDelay={300}
		mouseEnterDelay={0}
		contentStyle={{...content_style, ...cssStyle}}
		arrow={false}
		trigger={<div className={`dropdown ${transparent ? 'transparent' : ''}`.classNames(style) + 'cursor-pointer d-flex align-items-center border-radius-5'.classNames() + className}>
				<span className={'flex-1'.classNames() + textClassName}>
					{options.find(o=>o.value==selected_value).label}
				</span>
				<i className={iconClassName}></i>
			</div>
		}>
			{close=>{
				return <div className={"dropdown-popup".classNames(style) + 'box-shadow-thick border-radius-10 border-1-5 border-color-tertiary background-color-white'.classNames()}>
					{options.map(option=>{
						let {value, label} = option;
						let active_class = value == selected_value ? 'active' : '';
						return <div key={value} className={active_class.classNames(style) + 'padding-vertical-8 padding-horizontal-10 cursor-pointer'.classNames()} onClick={()=>{onChange(value); close();}}>
							{label}
						</div>
					})}
				</div>
			}}
    </Popup>	
}
export function DropDownUnanaged(props) {
	const {
		className='',
		position="bottom right",
		children,
		content,
		style: cssStyle={}
	} = props;

	return <Popup
		position={position}
		closeOnDocumentClick={false}
		on={[]}
		arrow={false}
		open={content ? true : false}
		darken={false}
		contentStyle={{...content_style, ...cssStyle}}
		trigger={<div className={className}>
				{children}
			</div>
		}>
		{content}
    </Popup>	
}