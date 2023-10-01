import React from 'react';
import ReactDOM from 'react-dom/client';

import 'crewhrm-materials/prototypes.jsx';
import { getElementDataSet } from 'crewhrm-materials/helpers.jsx';
import { MountPoint } from 'crewhrm-materials/mountpoint.jsx';
import { Company } from './company-profile/company.jsx';
import { HRMSettings } from './hrm-settings/hrm-settings.jsx';

// Render company profile
const profile = document.getElementById('crewhrm_company_profile');
if (profile) {
    ReactDOM.createRoot(profile).render(
        <MountPoint>
            <Company {...getElementDataSet(profile)} />
        </MountPoint>
    );
}

// Render hrm settings
const settings = document.getElementById('crewhrm_settings');
if (settings) {
    ReactDOM.createRoot(settings).render(
        <MountPoint>
            <HRMSettings {...getElementDataSet(settings)} />
        </MountPoint>
    );
}
