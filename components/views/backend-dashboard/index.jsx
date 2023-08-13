import React from "react";
import ReactDOM from "react-dom/client";

import '../../utilities/prototypes.jsx';
import { HRM } from "./pages/hrm/hrm.jsx";
import { getElementDataSet } from "../../utilities/helpers.jsx";
import { MountPoint } from "../../materials/mount-points/templates.jsx";

const hrm = document.getElementById('crewhrm_backend_main_page');
if ( hrm ) {
	ReactDOM.createRoot(hrm).render(
		<MountPoint element={hrm}>
			<HRM {...getElementDataSet(hrm)} />
		</MountPoint>
	);
}