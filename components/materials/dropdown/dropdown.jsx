import React, { useRef } from "react";

import {Popup} from "../popup/index.jsx";
import style from './dropdown.module.scss';
import { __ } from "../../utilities/helpers.jsx";

const content_style = {
	padding: '0px',
	border: 'none',
}

const list_class = 'padding-vertical-8 padding-horizontal-20 cursor-pointer'.classNames();

function getPopupStyle(classNames) {
	classNames = classNames.split(' ').map(c=>c.trim()).filter(c=>c.indexOf('crewhrm-')===0).map(c=>c.replace('crewhrm-', ''));
	const styles = {};

	for( let i=0; i<classNames.length; i++ ) {
		// Get border radius
		if (classNames[i].indexOf('border-radius-')===0) {
			styles.borderRadius = classNames[i].replace(/\D/g, '') + 'px';
			break;
		}
	}

	return styles;
}

export function DropDown(props) {
	const {
		value: selected_value, 
		nested=false,
		options=[], 
		onChange, 
		transparent, 
		className='',
		tabindex,
		textClassName='font-size-15 font-weight-400 text-color-primary'.classNames(),
		iconClassName='ch-icon ch-icon-arrow-down margin-left-10 font-size-18 text-color-light'.classNames(),
		position="center top",
		labelFallback=__( 'Select' ),
		addText,
		onAddClick,
		style: cssStyle={}
	} = props;

	const ref = useRef();

	const triggerPoint= <div tabIndex={tabindex} className={`select-dropdown ${transparent ? 'transparent' : ''}`.classNames(style) + 'cursor-pointer d-flex align-items-center border-radius-5'.classNames() + className}>
		<span className={'flex-1 white-space-nowrap'.classNames() + textClassName}>
			{selected_value!==undefined ? (options.find(o=>o.id===selected_value)?.label || labelFallback) : labelFallback}
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
			nested={nested}
			trigger={triggerPoint}>
				{close=>{
					// Determine border width, color and radius from the class name to sync the popup accordingly
					let popup_styles = ref.current ? {width: ref.current.clientWidth+'px'} : {};
					popup_styles = {...popup_styles, ...getPopupStyle(className)};

					return <div className={"select-dropdown-popup".classNames(style) + 'box-shadow-thick border-radius-10 border-1-5 border-color-tertiary background-color-white'.classNames()} style={popup_styles}>
						<div className={'trigger-point'.classNames(style)}>
							{triggerPoint}
						</div>
						<div className={'list-wrapper'.classNames(style)}>
							{options.map(option=>{
								let {id, label} = option;
								let classes = `list-item ${id == selected_value ? 'active' : ''}`;
								return <div key={id} className={classes.classNames(style) + list_class} onClick={()=>{onChange(id); close();}}>
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

export function Options(props) {
	const {
		options, 
		onClick, 
		className='',
		position="bottom right",
		style: cssStyle={},
		children
	} = props;

	return <Popup
		position={position}
		on="click"
		closeOnDocumentClick
		mouseLeaveDelay={300}
		mouseEnterDelay={0}
		contentStyle={{...content_style, ...cssStyle}}
		arrow={false}
		trigger={
			<div className={'d-inline-block cursor-pointer'.classNames() + className}>
				{children}
			</div>
		}>
			{close=>{
				return <div className={"options-popup".classNames(style) + 'box-shadow-thick border-radius-10 border-1-5 border-color-tertiary background-color-white'.classNames()}>
					<div className={'list-wrapper'.classNames(style)}>
						{options.map(option=>{
							let {id, label, icon} = option;
							return <div key={id} className={'list-item'.classNames(style) + list_class} onClick={()=>{onClick(id); close();}}>
								{icon && <i className={icon + 'margin-right-10'.classNames()}></i> || null}
								{label}
							</div>
						})}
					</div>
				</div>
			}}
	</Popup>
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
