import React from "react";

import style from './text-field.module.scss';

export function TextField(props) {
	const {
		icon, 
		image, 
		icon_position='left', 
		type='text', 
		onChange, 
		placeholder, 
		className='', 
		inputClassName='', 
		pattern } = props;
	
	return <div className={`text-field icon-${icon_position}`.classNames(style) + className}>
		{icon && <>
			<i className={icon.classNames()}></i>
			<span className={'d-inline-block width-6'.classNames()}></span>
		</> || null}
		
		{image && <>
			<img src={image} className={'image'.classNames(style)}/>
			<span className={'d-inline-block width-6'.classNames()}></span>
		</> || null}

		<input 
			type={type} 
			onChange={e=>onChange(e.currentTarget.value)}
			placeholder={placeholder}
			className={inputClassName}
			pattern={pattern}/>
	</div>
}