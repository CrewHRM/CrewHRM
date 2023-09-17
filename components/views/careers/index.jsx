import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import '../../utilities/prototypes.jsx';
import { __, getElementDataSet } from '../../utilities/helpers.jsx';
import { MountPoint } from '../../materials/mountpoint.jsx';
import { Listing } from './listing/listing.jsx';
import { Single } from './single/single.jsx';

function CareersRouter({ base_permalink, settings={} }) {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={`/${base_permalink}/`}
                    element={<Listing base_permalink={base_permalink} settings={settings}/>}
                />
                <Route
                    path={`/${base_permalink}/:job_id/:job_action?/`}
                    element={<Single base_permalink={base_permalink} />}
                />
                <Route path={'*'} element={<Navigate to={`/${base_permalink}/`} replace />} />
            </Routes>
        </BrowserRouter>
    );
}

// Render company profile
const careers = document.getElementById('crewhrm_careers');
if (careers) {
    const data = getElementDataSet(careers);

    ReactDOM.createRoot(careers).render(
        <MountPoint element={careers} nonce={data.crewhrmNonce} nonceAction={careers.id}>
            <CareersRouter {...data} />
        </MountPoint>
    );
}
