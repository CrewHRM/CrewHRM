import React from "react";
import ReactDOM from "react-dom/client";
import { MountPoint } from "../../utilities/templates.jsx";
import { HRM } from "./pages/hrm/hrm.jsx";
import { getElementDataSet } from "../../utilities/helpers.jsx";

const hrm = document.getElementById('crewhrm_backend_main_page');
console.log(hrm);
if ( hrm ) {
	ReactDOM.createRoot(hrm).render(
		<MountPoint element={hrm}>
			<HRM {...getElementDataSet(hrm)} />
		</MountPoint>
	);
}