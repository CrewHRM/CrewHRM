import React from "react";

import style from './tabs.module.scss';

export function Tabs(props) {
	const {active, tabs=[], onNavigate, theme, className='', style: cssStyle={}} = props;
	const active_index = tabs.findIndex(tab=>tab.id==active);

	return <div className={`tabs theme-${theme}`.classNames(style) + className} style={cssStyle}>
		{
			tabs.map((tab, index)=>{
				let {id, label} = tab;

				let fill_class = ''; 
				fill_class    += index <= active_index ? 'fill-left ' : '';
				fill_class    += index < active_index ? 'fill-right' : '';
				fill_class    += index == active_index ? 'fill-right-gradient' : '';

				return <div key={id} className={`single-step ${id===active ? 'active' : ''}`.classNames(style)} onClick={()=>onNavigate(id)}>
					{label}
					{theme=='sequence' && <div className={`sequence-line-wrapper ${fill_class}`.classNames(style)}>
						<div>{index>0 && <div className={'hr hr-1'.classNames(style)}></div> || null}</div>
						<div className={'circle'.classNames(style)}></div>
						<div>{index<tabs.length-1 && <div className={'hr hr-2'.classNames(style)}></div> || null}</div>
					</div> || null}
				</div>
			})
		}
	</div>
}
