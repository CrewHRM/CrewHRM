import React from 'react';
import ReactDOM from 'react-dom/client';

import { MountPoint } from 'crewhrm-materials/mountpoint.jsx';
import { HRM } from './hrm.jsx';
import { getElementDataSet } from 'crewhrm-materials/helpers.jsx';

const hrm = document.getElementById('crewhrm_dashboard');
if (hrm) {
    ReactDOM.createRoot(hrm).render(
        <MountPoint element={hrm}>
            <HRM {...getElementDataSet(hrm)} />
        </MountPoint>
    );
}
