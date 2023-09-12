import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { __, getRandomString } from '../../../../utilities/helpers.jsx';
import { Header } from './header/header.jsx';
import { Sidebar } from './sidebar/sidebar.jsx';
import { Profile } from './profile/profile-wrapper.jsx';

import style from './applicants.module.scss';
import { LoadingIcon } from '../../../../materials/loading-icon/loading-icon.jsx';
import { request } from '../../../../utilities/request.jsx';
import { ContextNonce } from '../../../../materials/mountpoint.jsx';

export const ContextApplicantSession = createContext();

export function Applicants() {
    const { job_id: raw_job_id } = useParams();
    const job_id = parseInt(raw_job_id);
	const {nonce, nonceAction} = useContext(ContextNonce);

    const [state, setState] = useState({
		session: getRandomString(),
		fetching: true,
		active_stage_id: 0,
		error_message: null,
		stages:[],
		job_list: [],
        job: {},
		candidates: 0,
    });

    const getJob = () => {
		setState({
			...state,
			fetching: true
		});

		request('get_job_view_dashboard', {job_id, nonce, nonceAction}, resp=>{
			const {
				success, 
				data:{
					message=__('Something went wrong'), 
					job={}, 
					stages=[],
					job_list,
					candidates,
				}
			} = resp;

			setState({
				...state,
				fetching: false,
				error_message: !success ? message : null,
				job,
				stages,
				job_list,
				candidates,
			});
		});
	};

    useEffect(() => {
		getJob();
	}, [job_id]);

	if ( state.fetching ) {
		return <LoadingIcon center={true}/>
	}

	if ( !state.fetching && (!state.job || state.error_message) ) {
		return <div className={'color-danger'.classNames()}>
			{state.error_message || __('Something went wrong')}
		</div>
	}

    return <ContextApplicantSession.Provider value={{stages: state.stages, session: state.session, sessionRefresh:()=>setState({...state, session: getRandomString()})}}>
		<div
			data-crewhrm-selector="applicant-wrapper"
			className={'applicants'.classNames(style)}
		>
			<Header 
				job_list={state.job_list} 
				job_id={job_id} 
				stages={state.stages}
				active_stage_id={state.active_stage_id}
				candidates={state.candidates}
				navigateStage={active_stage_id=>setState({...state, active_stage_id})}/>

			<div className={'content-area'.classNames(style)}>
				<div className={'sidebar-wrapper'.classNames(style)}>
					<Sidebar 
						job_id={job_id} 
						stage_id={state.active_stage_id}/>
				</div>
				<div className={'profile-wrapper'.classNames(style)}>
					<Profile 
						job_id={job_id} 
						defaultApplication={state.defaultApplication}/>
				</div>
			</div>
		</div>
	</ContextApplicantSession.Provider>
}
