import React from 'react';
import ReactDOM from 'react-dom/client';

import 'crewhrm-materials/prototypes.jsx';
import { getElementDataSet } from 'crewhrm-materials/helpers.jsx';
import { MountPoint } from 'crewhrm-materials/mountpoint.jsx';
import { HRMSettings } from './hrm-settings/hrm-settings.jsx';

// Render hrm settings
const settings = document.getElementById('crewhrm_settings');
if (settings) {
    ReactDOM.createRoot(settings).render(
        <MountPoint>
            <HRMSettings {...getElementDataSet(settings)} />
        </MountPoint>
    );
}
