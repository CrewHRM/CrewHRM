import React from "react";

import style from './text-field.module.scss';

export function TextField(props) {
	const {
		icon, 
		image, 
		icon_position='left', 
		type='text', 
		onChange, 
		onIconClick,
		placeholder, 
		className='', 
		inputClassName='', 
		pattern,
		value,
		maxLength=null} = props;

	const dispatchChange=(v)=>{
		if (maxLength!==null && v.length>maxLength) {
			return;
		}

		onChange(v);
	}
	
	const separator = <span className={'d-inline-block width-6'.classNames()}></span>

	return <div className={`text-field icon-${icon_position}`.classNames(style) + className}>
		{icon && <>
			<i className={icon.classNames()} onClick={()=>onIconClick()}></i>
			{separator}
		</> || null}
		
		{image && <>
			<img src={image} className={'image'.classNames(style)} onClick={()=>onIconClick()}/>
			{separator}
		</> || null}

		<input 
			type={type} 
			value={value}
			onChange={e=>dispatchChange(e.currentTarget.value)}
			placeholder={placeholder}
			className={'text-field-flat font-size-15 font-weight-500 letter-spacing--15 flex-1'.classNames() + inputClassName}
			pattern={pattern}/>
	</div>
}