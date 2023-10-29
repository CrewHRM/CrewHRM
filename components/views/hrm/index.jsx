import React from 'react';
import {createRoot} from 'react-dom/client';

import { MountPoint } from 'crewhrm-materials/mountpoint.jsx';
import { HRM } from './hrm.jsx';
import { getElementDataSet } from 'crewhrm-materials/helpers.jsx';
import { Promote } from '../../promote/promote.jsx';
import { WpDashboardFullPage } from 'crewhrm-materials/backend-dashboard-container/full-page-container.jsx';

const hrm = document.getElementById('crewhrm_dashboard');
if (hrm) {
    createRoot(hrm).render(
        <MountPoint element={hrm}>
            <HRM {...getElementDataSet(hrm)} />
        </MountPoint>
    );
}

// Register calendar page promotion
const calendar = document.getElementById('crewhrm_event_calendar_page_promotion');
if ( calendar ) {
	createRoot(calendar).render(
        <MountPoint>
			<WpDashboardFullPage>
				<div className={'position-relative'.classNames()} style={{minHeight: '600px'}}>
					<Promote content='calendar'/>
				</div>
			</WpDashboardFullPage>
        </MountPoint>
    );
}
