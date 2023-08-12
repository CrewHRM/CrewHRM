import React from "react";

import style from './tabs.module.scss';

export function Tabs(props) {
	const {active, tabs=[], onNavigate, theme, className=''} = props;

	return <div className={`tabs ${theme}`.classNames(style) + className}>
		{
			tabs.map(tab=>{
				let {id, label} = tab;
				return <div key={id} className={`${id===active ? 'active' : ''}`.classNames(style)} onClick={()=>onNavigate(id)}>
					{label}
				</div>
			})
		}
	</div>
}