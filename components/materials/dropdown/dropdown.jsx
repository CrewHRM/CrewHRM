import React, { useRef, useState } from "react";

import {Popup} from "../popup/index.jsx";
import style from './dropdown.module.scss';
import { __ } from "../../utilities/helpers.jsx";

const content_style = {
	padding: '0px',
	border: 'none',
}

const list_class = 'padding-vertical-8 padding-horizontal-20 cursor-pointer'.classNames();

export function DropDown(props) {
	const {
		value: selected_value, 
		options, 
		onChange, 
		transparent, 
		className='',
		tabindex,
		textClassName='font-size-15 font-weight-400 text-color-primary'.classNames(),
		iconClassName='ch-icon ch-icon-arrow-down margin-left-10 font-size-18 text-color-secondary'.classNames(),
		position="center top",
		initialLabel=__( 'Select' ),
		addText,
		onAddClick,
		style: cssStyle={}
	} = props;

	const ref = useRef();
	const triggerPoint= <div tabIndex={tabindex} className={`dropdown ${transparent ? 'transparent' : ''}`.classNames(style) + 'cursor-pointer d-flex align-items-center border-radius-5'.classNames() + className}>
		<span className={'flex-1'.classNames() + textClassName}>
			{selected_value!==undefined ? (options.find(o=>o.value===selected_value)?.label || initialLabel) : initialLabel}
		</span>
		<i className={iconClassName}></i>
	</div>


	return <div ref={ref}> 
		<Popup
			position={position}
			on="click"
			closeOnDocumentClick
			mouseLeaveDelay={300}
			mouseEnterDelay={0}
			contentStyle={{...content_style, ...cssStyle}}
			arrow={false}
			trigger={triggerPoint}>
				{close=>{
					return <div className={"dropdown-popup".classNames(style) + 'box-shadow-thick border-radius-10 border-1-5 border-color-tertiary background-color-white'.classNames()} style={ref.current ? {width: ref.current.clientWidth+'px'} : {}}>
						<div className={'trigger-point'.classNames(style)}>
							{triggerPoint}
						</div>
						<div className={'list-wrapper'.classNames(style)}>
							{options.map(option=>{
								let {value, label} = option;
								let classes = `list-item ${value == selected_value ? 'active' : ''}`;
								return <div key={value} className={classes.classNames(style) + list_class} onClick={()=>{onChange(value); close();}}>
									{label}
								</div>
							})}
						</div>
						
						{addText && <div className={'add-item'.classNames(style) + list_class} style={{paddingTop: '10px', paddingBottom: '10px'}} onClick={()=>{onAddClick(); close();}}>
							<i className={'ch-icon ch-icon-add-square vertical-align-middle d-inline-block margin-right-10'.classNames()}></i>
							<span className={'vertical-align-middle'.classNames()}>{addText}</span>
						</div>}
					</div>
				}}
		</Popup>
	</div>
}

export function DropDownUnmanaged(props) {
	const {
		className='',
		position="bottom right",
		children,
		rendered,
		style: cssStyle={}
	} = props;

	return <Popup
		position={position}
		closeOnDocumentClick={false}
		on={[]}
		arrow={false}
		open={rendered ? true : false}
		darken={false}
		contentStyle={{...content_style, ...cssStyle}}
		trigger={<div className={className}>
				{children}
			</div>
		}>
		{rendered}
    </Popup>	
}
