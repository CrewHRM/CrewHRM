import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { MountPoint } from 'crewhrm-materials/mountpoint.jsx';
import { __, getElementDataSet } from 'crewhrm-materials/helpers.jsx';
import { Listing } from './listing/listing.jsx';
import { Single } from './single/single.jsx';

export function CareersRouter({ base_permalink, open_in_new, hash_router = false, settings = {} }) {

	base_permalink = base_permalink.replace(new RegExp(`^[\/]+|[\/]+$`, 'g'), '');
	
    return <BrowserRouter>
		<Routes>
			<Route
				path={`/${base_permalink}/`}
				element={<Listing 
					open_in_new={open_in_new} 
					settings={settings}
				/>}
			/>
			<Route
				path={`/${base_permalink}/:job_id/:job_action?/`}
				element={<Single base_permalink={base_permalink} settings={settings}/>}
			/>
			<Route path={'*'} element={<Navigate to={`/${base_permalink}/`} replace />} />
		</Routes>
	</BrowserRouter>
}

// Render company profile
const careers = document.getElementById('crewhrm_careers');
if (careers) {
    ReactDOM.createRoot(careers).render(
        <MountPoint>
            <CareersRouter {...getElementDataSet(careers)} />
        </MountPoint>
    );
}
