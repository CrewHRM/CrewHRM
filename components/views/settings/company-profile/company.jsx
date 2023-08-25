import React from "react";
import { HashRouter, Route, Routes, useParams, Navigate } from "react-router-dom";

import { WpDashboardFullPage } from "../../../materials/backend-dashboard-container/full-page-container.jsx";
import { ContextBackendDashboard } from "../../hrm/hrm.jsx";
import { StickyBar } from "../../../materials/sticky-bar/sticky-bar.jsx";
import { CompanyProfileSidebar, pages } from "./sidebar/sidebar.jsx";
import { CompantDepartments } from "./departments/departments.jsx";
import { CompanyProfile } from "./profile/profile.jsx";
import { __ } from "../../../utilities/helpers.jsx";

import style from './company.module.scss';

function CompanyWrapper() {
	const {sub_page} = useParams();
	const page_id = sub_page || 'profile';

	return <>
		<StickyBar backTo={sub_page ? true : false} title={pages.find(p=>p.id===page_id)?.label || __( 'Company Profile' )}>
			<div className={'d-flex align-items-center column-gap-30'.classNames()}>
				<i className={'ch-icon ch-icon-redo font-size-26 color-text-hint'.classNames()}></i>
				<i className={'ch-icon ch-icon-undo font-size-26 color-text-hint'.classNames()}></i>
				<button className={'button button-primary'.classNames()}>
					{__( 'Save Changes' )}
				</button>
			</div>
		</StickyBar>
		<div className={'company'.classNames(style)}>
			<div className={'sidebar'.classNames(style)}>
				<CompanyProfileSidebar page_id={page_id}/>
			</div>
			<div className={'content-area'.classNames(style)}>
				{page_id === 'profile' && <CompanyProfile/> || null}
				{page_id === 'departments' && <CompantDepartments/> || null}
			</div>
		</div>
	</>
}

export function Company(props) {
	return <ContextBackendDashboard.Provider value={{}}>
		<WpDashboardFullPage>
			<HashRouter>
				<Routes>
					<Route path="/company/:sub_page?/" element={<CompanyWrapper/>}/>
					<Route path={"*"} element={<Navigate to="/company/" replace />} />
				</Routes>
			</HashRouter>
		</WpDashboardFullPage>
	</ContextBackendDashboard.Provider> 
}