import React from "react";
import ReactDOM from "react-dom/client";
import { HRM } from "./pages/hrm/hrm.jsx";
import { getElementDataSet } from "../../utilities/helpers.jsx";
import { MountPoint } from "../../materials/mount-points/templates.jsx";

const hrm = document.getElementById('crewhrm_backend_main_page');
console.log(hrm);
if ( hrm ) {
	ReactDOM.createRoot(hrm).render(
		<MountPoint element={hrm}>
			<HRM {...getElementDataSet(hrm)} />
		</MountPoint>
	);
}