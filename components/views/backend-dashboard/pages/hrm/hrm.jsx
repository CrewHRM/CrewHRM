import React, { createContext, useState } from "react";
import {HashRouter, Route, Navigate, Routes, Link} from 'react-router-dom';
import { WpDashboardFullPage } from "../../../../materials/backend-dashboard-container/full-page-container.jsx";

import { JobEditor } from "./job-editor/index.jsx";
import { DahboardMain } from './dashboard/main/main.jsx';
import { JobOpeningsFullView } from "./dashboard/job-openings/jobs.jsx";
import { Applicants } from "./dashboard/applicants/applicants.jsx";
import { StickyBar } from '../../../../materials/sticky-bar/sticky-bar.jsx';
import { __, getRandomString } from "../../../../utilities/helpers.jsx";
import { NotificationsEmail, NotificationsOnSite } from "./notifications/notifications.jsx";
import { NoticeBar } from "./notifications/notice/notice-bar.jsx";

export const ContextBackendDashboard = createContext();

export function DashboardBar(props) {
	return <>
		<StickyBar>
			<div className={'d-flex align-items-center'.classNames()}>
				<div className={'flex-1'.classNames()}>
					{__( 'Dashboard' )}
				</div>
				<div className={'d-flex align-items-center column-gap-30'.classNames()}>
					<NotificationsOnSite/>
					<NotificationsEmail/>
					<div className={'d-inline-block'.classNames()}>
						<Link to="/dashboard/jobs/editor/new/" className={'button button-primary'.classNames()}>
							{__( 'Create A New Job' )}
						</Link>
					</div>
				</div>
			</div>
		</StickyBar>
		<NoticeBar/>
	</>
}

export function HRM(props) {
	const [state, setState] = useState({
		notices: [
			{
				id: getRandomString(),
				type: 'success',
				content: <div className={'d-flex align-items-center column-gap-30'.classNames()}>
					<span className={'font-size-15 font-weight-500 line-height-18 text-color-white'.classNames()}>
						Your file is over the 5MB limit of the free plan
					</span>
					<button className={'button button-primary button-medium-2 button-outlined button-foreground'.classNames()}>
						Create A New Job
					</button>
				</div>
			},
			{
				id: getRandomString(),
				type: 'warning',
				content: <div className={'d-flex align-items-center column-gap-30'.classNames()}>
					<span className={'font-size-15 font-weight-500 line-height-18 text-color-white'.classNames()}>
						Your file is over the 5MB limit of the free plan
					</span>
					<button className={'button button-primary button-medium-2 button-outlined button-foreground'.classNames()}>
						Create A New Job
					</button>
				</div>
			},
			{
				id: getRandomString(),
				type: 'error',
				content: <div className={'d-flex align-items-center column-gap-30'.classNames()}>
					<span className={'font-size-15 font-weight-500 line-height-18 text-color-white'.classNames()}>
						Your file is over the 5MB limit of the free plan
					</span>
					<button className={'button button-primary button-medium-2 button-outlined button-foreground'.classNames()}>
						Create A New Job
					</button>
				</div>
			}
		]
	});

	const showNotice=()=>{

	}

	const deleteNotice=id=>{
		const {notices} = state;
		const index = notices.findIndex(n=>n.id===id);
		notices.splice(index, 1);
		setState({
			...state,
			notices
		});
	}

	return <ContextBackendDashboard.Provider value={{notices: state.notices, showNotice, deleteNotice}}>
		<WpDashboardFullPage>
			<HashRouter>
				<Routes>
					<Route path="/dashboard/" element={<>
						<DashboardBar/>
						<DahboardMain/>
					</>}/>

					<Route path="/dashboard/jobs/" element={<>
						<DashboardBar/>
						<JobOpeningsFullView/>
					</>}/>

					<Route path="/dashboard/jobs/:job_id/applicants/:applicant_id?/" element={<>
						<DashboardBar/>
						<Applicants/>
					</>}/>
					
					<Route path="/dashboard/jobs/editor/:job_id?/" element={<JobEditor/>}/>
					
					<Route path={"*"} element={<Navigate to="/dashboard/" replace />} />
				</Routes>
			</HashRouter>
		</WpDashboardFullPage>
	</ContextBackendDashboard.Provider>
}