import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { __, countries_object } from '../../../utilities/helpers.jsx';
import style from './single.module.scss';
import { DangerouslySet } from '../../../materials/DangerouslySet.jsx';
import { Apply } from './apply/apply.jsx';
import { request } from '../../../utilities/request.jsx';
import { ContextNonce } from '../../../materials/mountpoint.jsx';
import { LoadingIcon } from '../../../materials/loading-icon/loading-icon.jsx';
import { employments_types } from '../../hrm/job-editor/job-details/sections/employment-details.jsx';

function RenderMeta({ icon, hint, content }) {
    return content ? <div>
		<i className={`${icon} font-size-16 color-text-light`.classNames()}></i>
		<span
			className={'d-block font-size-13 font-weight-500 line-height-25 color-text-light margin-top-8 margin-bottom-2'.classNames()}
		>
			{hint}
		</span>
		<span className={'font-size-17 font-weight-500 line-height-25 color-text'.classNames()}>
			{content}
		</span>
	</div> : null
}

export function Single({ base_permalink }) {
	const {job_action, job_id} = useParams();
	const {nonce, nonceAction} = useContext(ContextNonce);

	const [state, setState] = useState({
		job: null,
		about_company: null,
		fetching: false,
		error_message: null
	});
	
	const getJob=()=>{
		setState({
			...state,
			fetching: true
		});

		request('get_single_job_view', {job_id, nonce, nonceAction}, resp=>{
			const {success, data:{job=null, about_company, message=__( 'Something Went Wrong!' )}} = resp;

			setState({
				...state,
				job,
				about_company,
				fetching: false,
				error_message: (!success || !job) ? message : null
			});
		});
	}

	useEffect(()=>{
		getJob();
	}, [job_id] );

    const { 
		department_name, 
		job_title, 
		meta,
		job_description, 
		street_address, 
		country_code,
		salary_a, 
		salary_b
	} = state.job || {};

	const {employment_type} = meta || {};

	if ( state.fetching ) {
		return <div className={'text-align-center'.classNames()}>
			<LoadingIcon size={34}/>
		</div>
	}

	if ( state.error_message ) {
		return <div className={'text-align-center color-danger'.classNames()}>
			{state.error_message}
		</div>
	}

    return job_action === 'apply' ? <Apply job={state.job}/> : <div className={'single'.classNames(style)}>
		<div className={'header'.classNames(style) + 'bg-color-tertiary'.classNames()}>
			<div className={'container'.classNames(style)}>
				<span
					className={'d-block font-size-15 font-weight-700 line-height-25 letter-spacing_3 color-text margin-bottom-10'.classNames()}
				>
					{department_name}
				</span>
				<span
					className={'d-block font-size-38 font-weight-600 line-height-24 letter-spacing--38 color-text'.classNames()}
				>
					{job_title}
				</span>
			</div>
		</div>
		<div className={'details'.classNames(style)}>
			<div className={'container'.classNames(style)}>
				<div
					className={'d-flex align-items-center justify-content-space-between flex-break-sm break-align-items-start break-gap-20 padding-vertical-20 padding-horizontal-30 bg-color-white border-radius-10 box-shadow-thick'.classNames()}
					style={{ marginTop: '-51px', marginBottom: '79px' }}
				>
					<RenderMeta
						icon={'ch-icon ch-icon-location'}
						hint={__('Location')}
						/* content={(street_address || '') + (country_code ? ', '+countries_object[country_code] : '')} */
						content={(street_address || '')}
					/>
					<RenderMeta
						icon={'ch-icon ch-icon-briefcase'}
						hint={__('Job Type')}
						content={Array.isArray(employment_type) ? employment_type.map(e=>employments_types[e]).filter(e=>e).join(', ') : employments_types[employment_type]}
					/>
					<RenderMeta
						icon={'ch-icon ch-icon-empty-wallet'}
						hint={__('Salary')}
						content={(salary_a || '') + (salary_b ? '-'+salary_b : '')}
					/>
					<div className={'align-self-center'.classNames()}>
						<Link to={`/${base_permalink}/${job_id}/apply/`} className={'button button-primary'.classNames()}>
							{__('Apply Now')}
						</Link>
					</div>
				</div>

				{state.about_company ? <div className={'margin-bottom-32'.classNames()}>
					<span
						className={'d-block font-size-17 font-weight-600 line-height-24 color-black margin-bottom-12'.classNames()}
					>
						{__('About Company')}
					</span>
					<DangerouslySet className={'font-weight-400 color-black'.classNames()}>
						{state.about_company}
					</DangerouslySet>
				</div> : null}
				
				{job_description ? <div className={'margin-bottom-32'.classNames()}>
					<span
						className={'d-block font-size-17 font-weight-600 line-height-24 color-black margin-bottom-12'.classNames()}
					>
						{__('Job Description')}
					</span>
					<DangerouslySet className={'font-weight-400 color-black'.classNames()}>
						{job_description}
					</DangerouslySet>
				</div> : null}
				
				<div>
					<Link
						to={`/${base_permalink}/${job_id}/apply/`}
						className={'button button-primary button-full-width'.classNames()}
					>
						{__('Apply Now')}
					</Link>
				</div>
			</div>
		</div>
	</div>
}
