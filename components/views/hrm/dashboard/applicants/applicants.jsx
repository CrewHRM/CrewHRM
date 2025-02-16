import React, { createContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { __, getRandomString } from 'crewhrm-materials/helpers.jsx';
import { Header } from './header/header.jsx';
import { Sidebar } from './sidebar/sidebar.jsx';
import { Profile } from './profile/profile-wrapper.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { ErrorBoundary } from 'crewhrm-materials/error-boundary.jsx';

import style from './applicants.module.scss';

export const ContextApplicationSession = createContext();

export function Applications() {
    const { job_id } = useParams();

    const [state, setState] = useState({
        session: getRandomString(),
        fetching: true,
        error_message: null,
        stages: [],
        job_list: [],
        job: {},
        candidates: 0,
        has_applications: null,
        mounted: false
    });

    const getJob = () => {
        setState({
            ...state,
            fetching: true
        });

        request('getJobViewDashboard', { job_id }, (resp) => {
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
            setState(prevState => {
                return {
                    ...prevState,
                    fetching: false,
                    error_message: !success ? message : null,
                    job,
                    stages: [...stages],
                    job_list,
                    candidates,
                    mounted: true
                }
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
                data-cylector="application-wrapper"
                className={'applications'.classNames(style)}
            >
                <Header
                    job_list={state.job_list}
                    job={state.job}
                    stages={state.stages}
                    candidates={state.candidates}
                />

                <div className={'content-area'.classNames(style)}>
                    <div className={'sidebar-wrapper'.classNames(style)}>
                        <ErrorBoundary>
                            <Sidebar
                                hasApplications={(has_applications) =>
                                    setState({ ...state, has_applications })
                                }
                            />
                        </ErrorBoundary>
                    </div>
                    <div className={'profile-wrapper'.classNames(style)}>
                        <ErrorBoundary>
                            <Profile has_applications={state.has_applications} />
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </ContextApplicationSession.Provider>
    );
}
