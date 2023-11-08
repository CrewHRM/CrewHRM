import React from "react";

import {__} from 'crewhrm-materials/helpers.jsx';

import thumbnail from './thumbnail.png';
import style from './promote.module.scss';

import event_editor from './screenshots/event-editor.png';
import comment from './screenshots/comment.png';
import attachment_settings from './screenshots/attachment-settings.png';
import calendar from './screenshots/calendar.png';
import calendar_widget from './screenshots/calendar-widget.png';
import zoom_settings from './screenshots/zoom-settings.png';
import meet_settings from './screenshots/meet-settings.png';

const screenshots = {
	event_editor,
	comment,
	attachment_settings,
	calendar_widget,
	calendar,
	zoom_settings,
	meet_settings
}

export function Promote({content, className='', style: cssStyle={}, children}) {
	return ! screenshots[content] ? <i>Promote Screen not found</i> : <div 
		className={'promote'.classNames(style) + className}
		style={cssStyle} 
	>
		{children ? children : <img src={screenshots[content]} className={'width-p-100 height-auto'.classNames()}/>}
		
		<div
			className={'position-absolute left-0 right-0 top-0 bottom-0 d-flex align-items-center justify-content-center'.classNames() + 'overlay'.classNames(style)}
		>
			<div 
				className={'bg-color-white border-radius-10 box-shadow-thin'.classNames()} 
				style={{width: '80%', maxWidth: '439px'}}
			>
				<div className={'padding-50 text-align-center'.classNames()}>
					<img src={thumbnail} className={'d-block height-auto margin-auto'.classNames()} style={{maxWidth: '131px'}}/>

					<div className={'margin-bottom-20 margin-top-20 font-size-28 font-weight-600 color-text line-height-26'.classNames()}>
						{__('Need to upgrade')}
					</div>

					<div className={'font-size-16 font-weight-400 color-text-light margin-bottom-20'.classNames()}>
						{__('This feature is not bundled with free version of Crew HRM. If you want to use it, you need to upgrade to Pro.')}
					</div>
					
					<div className={'margin-bottom-15'.classNames()}>
						<a className={'button button-primary'.classNames()} href="https://getcrewhrm.com/pricing/">
							{__('Upgrade to Pro')}
						</a>
					</div>
					
					<a href="https://getcrewhrm.com/my-account/downloads/" target="_blank" className={'font-size-15 font-weight-500 letter-spacing--3 color-text-light hover-underline'.classNames()}>
						{__('Already Purchased?')}
					</a>
				</div>
				<div className={'text-align-center padding-8 font-size-14 font-weight-500 letter-spacing--3 color-white'.classNames() + 'footer'.classNames(style)}>
					{__('Get 50% off regular price, Automatically applied at checkout')}
				</div>
			</div>
		</div>
	</div>
}
