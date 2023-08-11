import React from "react";

import style from './text-field.module.scss';

const icons = {
	search: 'ch-icon ch-icon-search-normal-1'
}

export function TextField(props) {
	const {icon, icon_position='left', type='text', onChange, placeholder} = props;

	return <div className={`text-field icon-${icon_position}`.classNames(style)} tabIndex={-1}>
		{icon && <>
			<i className={icons[icon].classNames()}></i>
			<span className={'d-inline-block width-6'.classNames()}></span>
		</>}
		
		<input 
			type={type} 
			onChange={e=>onChange(e.currentTarget.value)}
			placeholder={placeholder}/>
	</div>
}