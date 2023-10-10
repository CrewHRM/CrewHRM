import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';
import { __, formatDate, sprintf } from 'crewhrm-materials/helpers.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { Line } from 'crewhrm-materials/line/line.jsx';
import { CoverImage } from 'crewhrm-materials/image/image.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { ContextApplicationSession } from '../applicants.jsx';

import style from './sidebar.module.scss';

export function Sidebar({ stage_id, hasApplications }) {
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
        applications: [],
        qualified_count: 0,
        disqualified_count: 0
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
        request('getApplicationsList', payload, (resp) => {
            const {
                success,
                data: { applications = [], qualified_count = 0, disqualified_count = 0 }
            } = resp;

            setState({
                ...state,
                fetching: false,
                applications,
                qualified_count,
                disqualified_count
            });

            // Set the first profile to open automatacillay
            if (applications.length && !application_id) {
                navigate(
                    `/dashboard/jobs/${job_id}/applications/${applications[0].application_id}/`,
                    { replace: true }
                );
            }

            hasApplications(applications.length ? true : false);
        });
    };

    const onSearch = (v) => {
        setState({
            ...state,
            filter: {
                ...state.filter,
                search: v
            }
        });
    };

    useEffect(() => {
        getApplications();
    }, [job_id, stage_id, state.filter.page, state.filter.search, state.active_tab, session]);

    const steps = [
        {
            id: 'qualified',
            label: (
                <span className={'font-size-13 font-weight-500 line-height-24'.classNames()}>
                    {sprintf(__('Qualified (%s)'), state.qualified_count)}
                </span>
            )
        },
        {
            id: 'disqualified',
            label: (
                <span className={'font-size-13 font-weight-500 line-height-24'.classNames()}>
                    {sprintf(__('Disqualified (%s)'), state.disqualified_count)}
                </span>
            )
        }
    ];

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
                    iconClass={'ch-icon ch-icon-search-normal-1 font-size-16 color-text-light'.classNames()}
					style={{height: '40px'}}
                    placeholder={__('Search by name')}
                    onChange={onSearch}
                    inputDelay={500}
                />
            </div>

            <Line />

            <div data-crewhrm-selector="list" className={'list'.classNames(style)}>
                {state.applications.map((application, i) => {
                    let {
                        first_name,
                        last_name,
                        application_date,
                        application_id: app_id
                    } = application;

                    return (
                        <div
                            key={app_id}
                            className={`cursor-pointer bg-color-hover-quaternary bg-color-active-quaternary ${
                                application_id === app_id ? 'active' : ''
                            }`.classNames()}
                            onClick={(e) =>
                                navigate(`/dashboard/jobs/${job_id}/applications/${app_id}/`)
                            }
                        >
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
                                        {formatDate(application_date)}
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
