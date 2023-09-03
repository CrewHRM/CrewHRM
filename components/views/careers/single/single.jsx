import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { __ } from '../../../utilities/helpers.jsx';
import style from './single.module.scss';
import { DangerouslySet } from '../../../materials/DangerouslySet.jsx';
import { Apply } from '../apply/apply.jsx';
import { request } from '../../../utilities/request.jsx';
import { ContextNonce } from '../../../materials/mountpoint.jsx';

function RenderMeta({ icon, hint, content }) {
    return (
        <div>
            <i className={`${icon} font-size-16 color-text-light`.classNames()}></i>
            <span
                className={'d-block font-size-13 font-weight-500 line-height-25 color-text-light margin-top-8 margin-bottom-2'.classNames()}
            >
                {hint}
            </span>
            <span className={'font-size-17 font-weight-500 line-height-25 color-text'.classNames()}>
                {content}
            </span>
        </div>
    );
}

export function Single({ base_permalink }) {
	const {job_action, job_id} = useParams();
	const {nonce, nonceAction} = useContext(ContextNonce);

	const [state, setState] = useState({
		job: null,
		fetching: false
	});
	
	/* const getJob=()=>{
		setState({
			...state,
			fetching: true
		});

		request('get_job_to_apply', {job_id, nonce, nonceAction}, resp=>{
			const {success, data:{job}} = resp;
			setState({
				...state,
				job,
				fetching: false
			});
		});
	}

	useEffect(()=>{

	}, [job_id] ); */

    const { department, job_title, job_type, job_description, location, salary } = state.job || {};

    return job_action === 'apply' ? <Apply job={state.job}/> : <div className={'single'.classNames(style)}>
		<div className={'header'.classNames(style) + 'bg-color-tertiary'.classNames()}>
			<div className={'container'.classNames(style)}>
				<span
					className={'d-block font-size-15 font-weight-700 line-height-25 letter-spacing_3 color-text margin-bottom-10'.classNames()}
				>
					{department}
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
						content={location}
					/>
					<RenderMeta
						icon={'ch-icon ch-icon-briefcase'}
						hint={__('Job Type')}
						content={job_type}
					/>
					<RenderMeta
						icon={'ch-icon ch-icon-empty-wallet'}
						hint={__('Salary')}
						content={salary}
					/>
					<div className={'align-self-center'.classNames()}>
						<Link to={`/${base_permalink}/${job_id}/apply/`} className={'button button-primary'.classNames()}>
							{__('Apply Now')}
						</Link>
					</div>
				</div>

				<div className={'margin-bottom-32'.classNames()}>
					<span
						className={'d-block font-size-17 font-weight-600 line-height-24 color-black margin-bottom-12'.classNames()}
					>
						{__('About Company')}
					</span>
					<DangerouslySet className={'font-weight-400 color-black'.classNames()}>
						Here about company
					</DangerouslySet>
				</div>

				<div className={'margin-bottom-32'.classNames()}>
					<span
						className={'d-block font-size-17 font-weight-600 line-height-24 color-black margin-bottom-12'.classNames()}
					>
						{__('Job Description')}
					</span>
					<DangerouslySet className={'font-weight-400 color-black'.classNames()}>
						{job_description}
					</DangerouslySet>
				</div>

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
