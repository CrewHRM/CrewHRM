import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { __, getRandomString } from '../../../../utilities/helpers.jsx';
import { Header } from './header/header.jsx';
import { Sidebar } from './sidebar/sidebar.jsx';
import { Profile } from './profile/profile-wrapper.jsx';
import { LoadingIcon } from '../../../../materials/loading-icon/loading-icon.jsx';
import { request } from '../../../../utilities/request.jsx';

import style from './applicants.module.scss';

export const ContextApplicationSession = createContext();

export function Applications() {
    const { job_id: raw_job_id } = useParams();
    const job_id = parseInt(raw_job_id);

    const [state, setState] = useState({
        session: getRandomString(),
        fetching: true,
        active_stage_id: 0,
        error_message: null,
        stages: [],
        job_list: [],
        job: {},
        candidates: 0,
		has_applications: true,
		mounted: false
    });

    const getJob = () => {
        setState({
            ...state,
            fetching: true
        });

        request('get_job_view_dashboard', { job_id }, (resp) => {
            const {
                success,
                data: {
                    message = __('Something went wrong'),
                    job = {},
                    stages = [],
                    job_list,
                    candidates
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
				mounted: true
            });
        });
    };

    useEffect(() => {
        getJob();
    }, [job_id, state.session]);

	// Don't unmount if already mounted, so the auto content loading will work on status changes.
    if (!state.mounted && state.fetching) {
        return <LoadingIcon center={true} />;
    }

    if (!state.fetching && (!state.job || state.error_message)) {
        return (
            <div className={'color-error'.classNames()}>
                {state.error_message || __('Something went wrong')}
            </div>
        );
    }

    return (
        <ContextApplicationSession.Provider
            value={{
                stages: state.stages,
                session: state.session,
                sessionRefresh: () => setState({ ...state, session: getRandomString() })
            }}
        >
            <div
                data-crewhrm-selector="application-wrapper"
                className={'applications'.classNames(style)}
            >
                <Header
                    job_list={state.job_list}
                    job_id={job_id}
					job={state.job}
                    stages={state.stages}
                    active_stage_id={state.active_stage_id}
                    candidates={state.candidates}
                    navigateStage={(active_stage_id) => setState({ ...state, active_stage_id })}
                />

                <div className={'content-area'.classNames(style)}>
                    <div className={'sidebar-wrapper'.classNames(style)}>
                        <Sidebar 
							job_id={job_id} 
							stage_id={state.active_stage_id} 
							hasApplications={has_applications=>setState({...state, has_applications})}/>
                    </div>
                    <div className={'profile-wrapper'.classNames(style)}>
                        <Profile 
							job_id={job_id} 
							has_applications={state.has_applications}/>
                    </div>
                </div>
            </div>
        </ContextApplicationSession.Provider>
    );
}
