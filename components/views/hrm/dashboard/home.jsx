import React, { createContext } from 'react';
import { HashRouter, Route, Navigate, Routes, Link } from 'react-router-dom';

import { JobEditor } from '../job-editor/index.jsx';
import { DahboardMain } from './main/main.jsx';
import { JobOpeningsFullView } from './job-openings/jobs.jsx';
import { Applications } from './applicants/applicants.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';

export function DashboardBar({title=__('Dashboard'), canBack}) {
    return (
        <>
            <StickyBar title={title} canBack={canBack}>
                <div className={'d-flex align-items-center column-gap-30'.classNames()}>
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
        </>
    );
}

export function HRM({ applicationStats, is_all_job_page }) {

    return <HashRouter>
		<Routes>
			<Route
				path="/dashboard/"
				element={
					<>
						<DashboardBar />
						<DahboardMain applicationStats={applicationStats}/>
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
}
