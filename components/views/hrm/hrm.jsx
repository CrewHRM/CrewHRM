import React, { createContext, useState } from 'react';
import { HashRouter, Route, Navigate, Routes, Link } from 'react-router-dom';
import { WpDashboardFullPage } from '../../materials/backend-dashboard-container/full-page-container.jsx';

import { JobEditor } from './job-editor/index.jsx';
import { DahboardMain } from './dashboard/main/main.jsx';
import { JobOpeningsFullView } from './dashboard/job-openings/jobs.jsx';
import { Applications } from './dashboard/applicants/applicants.jsx';
import { StickyBar } from '../../materials/sticky-bar/sticky-bar.jsx';
import { __, getRandomString } from '../../utilities/helpers.jsx';
// import { NotificationsEmail, NotificationsOnSite } from "./notifications/notifications.jsx";
import { NoticeBar } from './notifications/notice/notice-bar.jsx';
import { AddDepartmentModal } from '../settings/company-profile/departments/add-department.jsx';

export const ContextBackendDashboard = createContext();

export function DashboardBar(props) {
    return (
        <>
            <StickyBar title="Dashboard">
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

export function HRM({ departments = [], applicationStats }) {
    const [state, setState] = useState({
        departments,
        notices: [
            /* {
                id: getRandomString(),
                type: 'success',
                content: (
                    <div className={'d-flex align-items-center column-gap-30'.classNames()}>
                        <span
                            className={'font-size-15 font-weight-500 line-height-18 color-white'.classNames()}
                        >
                            Your file is over the 5MB limit of the free plan
                        </span>
                        <button
                            className={'button button-primary button-medium-2 button-outlined button-foreground'.classNames()}
                        >
                            Create A New Job
                        </button>
                    </div>
                )
            },
            {
                id: getRandomString(),
                type: 'warning',
                content: (
                    <div className={'d-flex align-items-center column-gap-30'.classNames()}>
                        <span
                            className={'font-size-15 font-weight-500 line-height-18 color-white'.classNames()}
                        >
                            Your file is over the 5MB limit of the free plan
                        </span>
                        <button
                            className={'button button-primary button-medium-2 button-outlined button-foreground'.classNames()}
                        >
                            Create A New Job
                        </button>
                    </div>
                )
            },
            {
                id: getRandomString(),
                type: 'error',
                content: (
                    <div className={'d-flex align-items-center column-gap-30'.classNames()}>
                        <span
                            className={'font-size-15 font-weight-500 line-height-18 color-white'.classNames()}
                        >
                            Your file is over the 5MB limit of the free plan
                        </span>
                        <button
                            className={'button button-primary button-medium-2 button-outlined button-foreground'.classNames()}
                        >
                            Create A New Job
                        </button>
                    </div>
                )
            } */
        ]
    });

    // To Do: Fill this function
    const showNotice = () => {};

    const addDepartment = (add_department_callback = () => {}) => {
        setState({
            ...state,
            add_department_callback
        });
    };

    const onAddDepartment = ({ id, departments }) => {
        // Send the new id to the parent caller
        state.add_department_callback(id);

        // Update state with the new list, and close modal
        setState({
            ...state,
            add_department_callback: null,
            departments
        });
    };

    const closeDepartmentModal = () => {
        setState({
            ...state,
            add_department_callback: null
        });
    };

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
				applicationStats,
                addDepartment
            }}
        >
            <WpDashboardFullPage>
                {state.add_department_callback ? (
                    <AddDepartmentModal onAdd={onAddDepartment} closeModal={closeDepartmentModal} />
                ) : null}

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
                                    <DashboardBar />
                                    <JobOpeningsFullView />
                                </>
                            }
                        />

                        <Route
                            path="/dashboard/jobs/:job_id/applications/:application_id?/"
                            element={
                                <>
                                    <DashboardBar />
                                    <Applications />
                                </>
                            }
                        />

                        <Route path="/dashboard/jobs/editor/:job_id?/" element={<JobEditor />} />

                        <Route path={'*'} element={<Navigate to="/dashboard/" replace />} />
                    </Routes>
                </HashRouter>
            </WpDashboardFullPage>
        </ContextBackendDashboard.Provider>
    );
}
