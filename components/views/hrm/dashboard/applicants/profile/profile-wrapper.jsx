import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { __, getFlag } from '../../../../../utilities/helpers.jsx';
import { HeadActions } from './head-actions/head-actions.jsx';
import { Tabs } from '../../../../../materials/tabs/tabs.jsx';
import { OverView } from './overview/overview.jsx';
import { Documents } from './documents/documents.jsx';
import { Activity } from './activity/activity.jsx';
import { CoverImage } from '../../../../../materials/image/image.jsx';
import { Line } from '../../../../../materials/line/line.jsx';
import { request } from '../../../../../utilities/request.jsx';
import { ContextNonce } from '../../../../../materials/mountpoint.jsx';
import { InitState } from '../../../../../materials/init-state.jsx';
import { Address } from '../../../../../materials/address.jsx';

import style from './profile.module.scss';

const tab_class =
	'd-flex align-items-center justify-content-center font-size-15 font-weight-500 line-height-24'.classNames();
	
const tabs = [
	{
		id: 'overview',
		label: <span className={tab_class}>{__('Overview')}</span>
	},
	{
		id: 'documents',
		label: <span className={tab_class}>{__('Documents')}</span>
	},
	{
		id: 'activity',
		label: (
			<span className={tab_class}>
				<span className={'d-inline-block vertical-align-middle'.classNames()}>
					{__('Activity')}
				</span>
				<span
					className={'d-inline-block vertical-align-middle bg-color-secondary border-radius-30 color-white font-size-13 font-weight-500 line-height-24 letter-spacing--13 padding-horizontal-7 margin-left-10'.classNames()}
				>
					12
				</span>
			</span>
		)
	}
];

export function Profile({job_id, stages=[]}) {
	const {applicant_id} = useParams();
	const {nonce, nonceAction} = useContext(ContextNonce);

    const [state, setState] = useState({ 
		fetching: false,
		applicant: {},
		active_tab: 'overview',
		error_message: null
	});

	const getApplicant=()=>{
		setState({
			...state,
			fetching: true
		});

		request('get_applicant_single', {nonce, nonceAction, job_id, applicant_id}, resp=>{
			const {success, data: {applicant={}, message=__('Something went wrong!')}} = resp;

			setState({
				...state,
				fetching: false,
				applicant,
				error_message: success ? null : message
			});
		});
	}

	useEffect(()=>{
		getApplicant();
	}, [applicant_id]);

	if (state.fetching || state.error_message) {
		return <InitState 
				fetching={state.fetching} 
				error_message={state.error_message}/>
	}

	const {applicant={}} = state;

    return !applicant_id ? null : <>
	
		<HeadActions applicant={applicant}/>

		<div className={'applicant-data'.classNames(style) + 'border-radius-5'.classNames()}>
			{/* Basic Personal Info Heading */}
			<div className={'d-flex align-items-center padding-20'.classNames()}>
				<CoverImage
					src={applicant.avatar_url}
					width={109}
					height={124}
					name={applicant.first_name + ' ' + applicant.last_name}
					className={'border-radius-3'.classNames()}
				/>
				<div className={'flex-1 margin-left-13'.classNames()}>
					<span
						className={'d-block font-size-24 font-weight-600 line-height-24 color-text margin-bottom-2'.classNames()}
					>
						{applicant.first_name} {applicant.last_name}
						<span
							className={'d-inline-block margin-left-4 font-size-15 vertical-align-middle'.classNames()}
						>
							{getFlag(applicant.address?.country_code)}
						</span>
					</span>

					{applicant.address ? <span
						className={'d-block font-size-15 font-weight-400 line-height-24 color-text-light margin-bottom-2'.classNames()}
					>
						<Address {...applicant.address}/>
					</span> : null}
					
					<span
						className={'d-block font-size-15 font-weight-400 line-height-24 color-text-light margin-bottom-2'.classNames()}
					>
						{applicant.email}
					</span>
					<span
						className={'d-block font-size-15 font-weight-400 line-height-24 color-text-light margin-bottom-2'.classNames()}
					>
						{applicant.phone}
					</span>
				</div>
			</div>

			<Line />

			{/* Profile Contents Tab */}
			<Tabs
				active={state.active_tab}
				tabs={tabs}
				onNavigate={(active_tab) => setState({ ...state, active_tab })}
				theme={'transparent'}
				className={'margin-bottom-20'.classNames()}
			/>

			{/* Profile contents per selected tab */}
			{state.active_tab == 'overview' ? <OverView applicant={applicant}/> : null}
			{state.active_tab == 'documents' ? <Documents applicant={applicant}/> : null}
			{state.active_tab == 'activity' ? <Activity applicant={applicant}/> : null}
		</div>
	</>
}
