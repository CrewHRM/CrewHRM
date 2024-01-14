import React, { createContext, useState } from 'react';
import { HashRouter, Route, Navigate, Routes, Link } from 'react-router-dom';
import { WpDashboardFullPage } from 'crewhrm-materials/backend-dashboard-container/full-page-container.jsx';

import { JobEditor } from './job-editor/index.jsx';
import { DahboardMain } from './dashboard/main/main.jsx';
import { JobOpeningsFullView } from './dashboard/job-openings/jobs.jsx';
import { Applications } from './dashboard/applicants/applicants.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';
// import { NotificationsEmail, NotificationsOnSite } from "./notifications/notifications.jsx";
import { NoticeBar } from './notifications/notice/notice-bar.jsx';

export const ContextBackendDashboard = createContext();

export function DashboardBar({title=__('Dashboard'), canBack}) {
    return (
        <>
            <StickyBar title={title} canBack={canBack}>
                <div className={'d-flex align-items-center column-gap-30'.classNames()}>
                    {/* <NotificationsOnSite/>
				<NotificationsEmail/> */}
                    <div className={'d-inline-block'.classNames()}>
                        <Link
                            to="/dashboard/jobs/editor/new/"
                            className={'button button-primary'.classNames()}
                        >
                            {__('Create A New Job')}
                        </Link>
                    </div>
                </div>
            </StickyBar>
            <NoticeBar />
        </>
    );
}

export function HRM({ departments = [], applicationStats, is_all_job_page }) {
    const [state, setState] = useState({
        departments,
        notices: []
    });

    const showNotice = () => {};

    const deleteNotice = (id) => {
        const { notices } = state;
        const index = notices.findIndex((n) => n.id === id);
        notices.splice(index, 1);

        setState({
            ...state,
            notices
        });
    };

    return (
        <ContextBackendDashboard.Provider
            value={{
                notices: state.notices,
                showNotice,
                deleteNotice,
                departments: state.departments,
                applicationStats
            }}
        >
            <WpDashboardFullPage>
                <HashRouter>
                    <Routes>
                        <Route
                            path="/dashboard/"
                            element={
                                <>
                                    <DashboardBar />
                                    <DahboardMain />
                                </>
                            }
                        />

                        <Route
                            path="/dashboard/jobs/"
                            element={
                                <>
                                    <DashboardBar title={__('Job List')} canBack={!is_all_job_page}/>
                                    <JobOpeningsFullView />
                                </>
                            }
                        />

                        <Route
                            path="/dashboard/jobs/:job_id/:stage_id?/:application_id?/"
                            element={
                                <>
                                    <DashboardBar title={__('Applications')} canBack={true}/>
                                    <Applications/>
                                </>
                            }
                        />

                        <Route path="/dashboard/jobs/editor/:job_id?/" element={<JobEditor />} />

                        <Route path={'*'} element={<Navigate to={!is_all_job_page ? "/dashboard/" : "/dashboard/jobs/"} replace />} />
                    </Routes>
                </HashRouter>
            </WpDashboardFullPage>
        </ContextBackendDashboard.Provider>
    );
}
