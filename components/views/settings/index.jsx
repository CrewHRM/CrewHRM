import React from "react";
import ReactDOM from "react-dom/client";

import '../../utilities/prototypes.jsx';
import { getElementDataSet } from "../../utilities/helpers.jsx";
import { MountPoint } from "../../materials/mount-points/templates.jsx";
import { Company } from "./company-profile/company.jsx";
import { HRMSettings } from "./hrm-settings/hrm-settings.jsx";

// Render company profile 
const profile = document.getElementById('crewhrm_company_profile');
if ( profile ) {
	ReactDOM.createRoot(profile).render(
		<MountPoint element={profile}>
			<Company {...getElementDataSet(profile)} />
		</MountPoint>
	);
}

// Render hrm settings
const settings = document.getElementById('crewhrm_settings');
if ( settings ) {
	ReactDOM.createRoot(settings).render(
		<MountPoint element={settings}>
			<HRMSettings {...getElementDataSet(settings)} />
		</MountPoint>
	);
}
