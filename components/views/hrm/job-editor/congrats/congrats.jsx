import React from "react";
import { Link } from 'react-router-dom';

import {Modal} from 'crewhrm-materials/modal.jsx';
import {__} from 'crewhrm-materials/helpers.jsx';
import img from 'crewhrm-materials/static/images/congrats.png';

export function Congrats({job_permalink, onClose}) {
	return <Modal closeOnDocumentClick={true} onClose={onClose}>
		<div className={'text-align-center padding-vertical-20 padding-horizontal-50 position-relative'.classNames()}>
			<i className={'ch-icon ch-icon-times cursor-pointer position-absolute right-0 top-0 font-size-18 color-text-light'.classNames()} onClick={onClose}></i>

			<img 
				src={img} 
				className={'height-auto margin-bottom-10'.classNames()} 
				style={{width: '217px'}}/>

			<div className={'font-size-28 font-weight-600 color-text margin-bottom-15 line-height-38'.classNames()}>
				{__('Congratulations!')}<br/>
				{__('The job post is published')}
			</div>

			<div className={'font-size-15 font-weight-400 color-text-light margin-bottom-20'.classNames()}>
				{__('You can now share the job post anywhere you like.')}
			</div>

			<div className={'margin-bottom-17'.classNames()}>
				<a href={job_permalink} target="_blank" className={'button button-primary'.classNames()}>
					{__('View Job')}
				</a>
			</div>

			<div>
				<Link to="/dashboard/" className={'font-size-15 font-weight-500 color-text-light letter-spacing--3'.classNames()}>
					{__('Go to Dashboard')}
				</Link>
			</div>
		</div>
	</Modal>
}