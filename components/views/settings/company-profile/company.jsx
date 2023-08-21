import React from "react";
import { HashRouter, Route, Routes, useParams, Navigate } from "react-router-dom";

import { WpDashboardFullPage } from "../../../materials/backend-dashboard-container/full-page-container.jsx";
import { ContextBackendDashboard, DashboardBar } from "../../hrm/hrm.jsx";
import { CompanyProfileSidebar } from "./sidebar/sidebar.jsx";
import { CompantDepartments } from "./departments/departments.jsx";
import { CompanyProfile } from "./profile/profile.jsx";

import style from './company.module.scss';

function CompanyWrapper() {
	const {sub_page} = useParams();
	return <>
		<DashboardBar/>
		<div className={'company'.classNames(style)}>
			<div className={'sidebar'.classNames(style)}>
				<CompanyProfileSidebar/>
			</div>
			<div className={'content-area'.classNames(style)}>
				{sub_page === 'profile' && <CompanyProfile/> || null}
				{sub_page === 'departments' && <CompantDepartments/> || null}
			</div>
		</div>
	</>
}

export function Company(props) {
	return <ContextBackendDashboard.Provider value={{}}>
		<WpDashboardFullPage>
			<HashRouter>
				<Routes>
					<Route path="/company/:sub_page/" element={<CompanyWrapper/>}/>
					<Route path={"*"} element={<Navigate to="/company/profile/" replace />} />
				</Routes>
			</HashRouter>
		</WpDashboardFullPage>
	</ContextBackendDashboard.Provider> 
}