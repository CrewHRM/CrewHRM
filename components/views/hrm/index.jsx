import React from 'react';
import ReactDOM from 'react-dom/client';

import '../../utilities/prototypes.jsx';
import { HRM } from './hrm.jsx';
import { getElementDataSet } from '../../utilities/helpers.jsx';
import { MountPoint } from '../../materials/mountpoint.jsx';

const hrm = document.getElementById('crewhrm_dashboard');
if (hrm) {
    const data = getElementDataSet(hrm);

    ReactDOM.createRoot(hrm).render(
        <MountPoint element={hrm} nonce={data.crewhrmNonce} nonceAction={hrm.id}>
            <HRM {...data} />
        </MountPoint>
    );
}
