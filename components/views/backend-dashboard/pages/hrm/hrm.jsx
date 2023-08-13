import React from "react";
import {HashRouter, Route, Navigate, Routes, Link} from 'react-router-dom';
import { WpDashboardFullPage } from "../../../../materials/backend-dashboard-container/full-page-container.jsx";

import { JobEditor } from "./job-editor/index.jsx";
import { DahboardMain } from './dashboard/main/main.jsx';
import { JobOpeningsFullView } from "./dashboard/job-openings/jobs.jsx";
import { Applicants } from "./dashboard/applicants/applicants.jsx";
import { StickyBar } from '../../../../materials/sticky-bar/sticky-bar.jsx';
import { __ } from "../../../../utilities/helpers.jsx";

export function DashboardBar(props) {
	return <StickyBar>
		<div className={'d-flex align-items-center'.classNames()}>
			<div>
				Menu
			</div>
			<div className={'flex-1 text-align-right'.classNames()}>
				<div className={'d-inline-block'.classNames()}>
					<Link to="/dashboard/jobs/editor/new/" className={'button button-primary'.classNames()}>
						{__( 'Create A New Job' )}
					</Link>
				</div>
			</div>
		</div>
	</StickyBar>
}

function Main() {
	return <>
		<DashboardBar/>
		<DahboardMain/>
	</>
}

export function HRM(props) {
	return <WpDashboardFullPage>
		<HashRouter>
			<Routes>
				<Route path="/dashboard/" element={<Main/>}/>
				<Route path="/dashboard/jobs/" element={<JobOpeningsFullView/>}/>
				<Route path="/dashboard/jobs/:job_id/applicants/:applicant_id?/" element={<Applicants/>}/>
				<Route path="/dashboard/jobs/editor/:job_id?/" element={<JobEditor/>}/>
				
				<Route path={"*"} element={<Navigate to="/dashboard/" replace />} />
			</Routes>
		</HashRouter>
	</WpDashboardFullPage>
}