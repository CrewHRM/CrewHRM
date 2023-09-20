import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from '../../../../../materials/tabs/tabs.jsx';
import { __ } from '../../../../../utilities/helpers.jsx';
import { TextField } from '../../../../../materials/text-field/text-field.jsx';
import { Line } from '../../../../../materials/line/line.jsx';
import { CoverImage } from '../../../../../materials/image/image.jsx';
import { request } from '../../../../../utilities/request.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { ContextApplicationSession } from '../applicants.jsx';

import style from './sidebar.module.scss';

const steps = [
    {
        id: 'qualified',
        label: (
            <span className={'font-size-13 font-weight-500 line-height-24'.classNames()}>
                {__('Qualified')}
            </span>
        )
    },
    {
        id: 'disqualified',
        label: (
            <span className={'font-size-13 font-weight-500 line-height-24'.classNames()}>
                {__('Disqualified')}
            </span>
        )
    }
];

export function Sidebar({ stage_id, onEmpty }) {
    const navigate = useNavigate();
    const { application_id, job_id } = useParams();
    const { session, sessionRefresh } = useContext(ContextApplicationSession);

    const [state, setState] = useState({
        mounted: false,
        fetching: false,
        active_tab: 'qualified',
        filter: {
            page: 1,
            search: null
        },
        applications: []
    });

    const [searchState, setSearchState] = useState('');

    const getApplications = () => {
        setState({
            ...state,
            fetching: true
        });

        // Prepare the request data
        const payload = {
            filter: {
                ...state.filter,
                job_id,
                stage_id,
                qualification: state.active_tab,
                page: 1
            }
        };

        // Send request
        request('get_applications_list', payload, (resp) => {
            const {
                success,
                data: { applications = [] }
            } = resp;

            setState({
                ...state,
                fetching: false,
                applications
            });

            // Set the first profile to open automatacillay
            if (applications.length && !application_id) {
                navigate(
                    `/dashboard/jobs/${job_id}/applications/${applications[0].application_id}/`,
					{ replace: true }
                );
            } else {
				onEmpty();
			}
        });
    };

    useEffect(() => {
        getApplications();
    }, [job_id, stage_id, state.filter.page, state.filter.search, state.active_tab, session]);

    // Debounce for search input
    // To Do: Use this same technique in settings undo/redo and job auto save.
	// To Do: Fix rich editor glithch with undo/redo. Need to update contents as stage changes.
    useEffect(() => {
        // Prevent duplicate ajax call
        if (!state.mounted) {
            setState({
                ...state,
                mounted: true
            });
            return;
        }

        const timeOutId = setTimeout(() => {
            setState({
                ...state,
                filter: {
                    ...state.filter,
                    search: searchState
                }
            });
        }, 500);

        return () => {
            clearTimeout(timeOutId);
        };
    }, [searchState]);

    return (
        <div
            data-crewhrm-selector="application-sidebar"
            className={'sidebar'.classNames(style) + 'position-sticky'.classNames()}
            style={{ top: '120px' }}
        >
            <Tabs
                active={state.active_tab}
                tabs={steps}
                onNavigate={(active_tab) => setState({ ...state, active_tab })}
                theme="transparent"
            />

            <div className={'padding-15'.classNames()}>
                <TextField
                    value={searchState}
                    className={'border-1 b-color-tertiary border-radius-5 padding-vertical-10 padding-horizontal-11 height-40'.classNames()}
                    iconClass={'ch-icon ch-icon-search-normal-1 font-size-16 color-text-light'.classNames()}
                    placeholder={__('Search by name')}
                    onChange={(v) => setSearchState(v)}
                />
            </div>

            <Line />

            <div data-crewhrm-selector="list" className={'list'.classNames(style)}>
                {state.applications.map((application, i) => {
                    let { first_name, last_name, application_date, application_id: app_id } = application;

                    return (
                        <div key={app_id} className={`cursor-pointer bg-color-hover-quaternary bg-color-active-quaternary ${application_id===app_id ? 'active' : ''}`.classNames()} onClick={e=>navigate(`/dashboard/jobs/${job_id}/applications/${app_id}/`)}>
                            <div className={'d-flex align-items-center'.classNames()}>
                                <CoverImage
                                    src={null}
                                    width={48}
                                    circle={true}
                                    name={first_name + ' ' + last_name}
                                />
                                <div className={'flex-1 margin-left-10'.classNames()}>
                                    <span
                                        className={'d-block font-size-17 font-weight-600 letter-spacing--17 color-text margin-bottom-2'.classNames()}
                                    >
                                        {first_name} {last_name}
                                    </span>
                                    <span
                                        className={'font-size-13 font-weight-400 line-height-24 color-text-light'.classNames()}
                                    >
                                        {application_date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
