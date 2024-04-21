import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';
import { __, formatDate, sprintf } from 'crewhrm-materials/helpers.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { Line } from 'crewhrm-materials/line/line.jsx';
import { CoverImage } from 'crewhrm-materials/image/image.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';

import { ContextApplicationSession } from '../applicants.jsx';
import { getColorKey } from '../profile/profile-wrapper.jsx';

import style from './sidebar.module.scss';

export function Sidebar({ hasApplications }) {
    const navigate = useNavigate();
    const { application_id, job_id, stage_id=0 } = useParams();
    const { session, sessionRefresh } = useContext(ContextApplicationSession);
	const {ajaxToast} = useContext(ContextToast);

    const [state, setState] = useState({
        mounted: false,
        fetching: false,
        active_tab: 'qualified',
        applications: [],
        qualified_count: 0,
        disqualified_count: 0,
        filter: {
            page: 1,
        },
    });

	const [keyWord, setKeyword] = useState('');

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
                page: 1,
				search: keyWord
            }
        };

        // Send request
        request('getApplicationsList', payload, (resp) => {
            const {
                success,
                data: {
					applications = [], 
					qualified_count = 0, 
					disqualified_count = 0
				}
            } = resp;

			if ( ! success ) {
				ajaxToast( resp );
				return;
			}

            setState({
                ...state,
                fetching: false,
                applications,
                qualified_count,
                disqualified_count
            });

            // Set the first profile to open automatacillay
            if (applications.length && (!application_id || !applications.filter(app=>app.application_id==application_id).length)) {
                navigate(
                    `/dashboard/jobs/${job_id}/${stage_id}/${applications[0].application_id}/`,
                    { replace: true }
                );
            }

            hasApplications(applications.length ? true : false);
        });
    };

    useEffect(() => {
        getApplications();
    }, [job_id, stage_id, state.filter.page, keyWord, state.active_tab, session]);

    const steps = [
        {
            id: 'qualified',
            label: (
                <span className={'font-size-13 font-weight-500 line-height-24'.classNames()}>
                    {sprintf(__('Qualified (%s)'), __(state.qualified_count))}
                </span>
            )
        },
        {
            id: 'disqualified',
            label: (
                <span className={'font-size-13 font-weight-500 line-height-24'.classNames()}>
                    {sprintf(__('Disqualified (%s)'), __(state.disqualified_count))}
                </span>
            )
        }
    ];

    return (
        <div
            data-cylector="application-sidebar"
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
                    iconClass={'ch-icon ch-icon-search-normal-1 font-size-16 color-text-light'.classNames()}
					style={{height: '40px'}}
                    placeholder={__('Search by name')}
                    onChange={setKeyword}
                />
            </div>

            <Line />

            <div data-cylector="list" className={'list'.classNames(style)}>
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
                                application_id == app_id ? 'active' : ''
                            }`.classNames()}
                            onClick={(e) =>
                                navigate(`/dashboard/jobs/${job_id}/${stage_id}/${app_id}/`)
                            }
                        >
                            <div className={'d-flex align-items-center'.classNames()}>
                                <CoverImage
                                    src={null}
                                    width={48}
                                    circle={true}
                                    name={first_name + ' ' + last_name}
									color_key={getColorKey(application)}
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
