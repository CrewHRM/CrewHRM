import React from "react";
import {HashRouter, Route, Navigate, Routes} from 'react-router-dom';
import { WpDashboardFullPage } from "../../templates/full-page-container/full-page-container.jsx";

import { JobEditor } from "./job-editor/index.jsx";
import { Dashboard } from "./dashboard/index.jsx";

export function HRM(props) {
	return <WpDashboardFullPage>
		<HashRouter>
			<Routes>
				<Route path="/dashboard/:page/:sub_page?/" element={<Dashboard/>}/>
				<Route path="/dashboard/job-editor/:job_id?/" element={<JobEditor/>}/>
				<Route path={"*"} element={<Navigate to="/dashboard/main/" replace />} />
			</Routes>
		</HashRouter>
	</WpDashboardFullPage>
}