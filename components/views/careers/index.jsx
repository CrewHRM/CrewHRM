import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Navigate, Route, Routes, useParams } from "react-router-dom";

import '../../utilities/prototypes.jsx';
import { getElementDataSet } from "../../utilities/helpers.jsx";
import { MountPoint } from "../../materials/mount-points/templates.jsx";
import { Listing } from "./listing/listing.jsx";
import { Apply } from "./apply/apply.jsx";
import { Single } from "./single/single.jsx";
import { CareersHeader } from "./careers-header/careers-header.jsx";

function Dispatcher() {
	const {listing_id, listing_action} = useParams();

	if ( listing_id && listing_action==='apply' ) {
		return <Apply/>
	}

	if ( listing_id ) {
		return <Single/>
	}

	return <Listing/>
}

function Wrapper() {
	return <>
		<CareersHeader/>
		<Dispatcher/>
	</>
}

function Router() {
	return <HashRouter>
		<Routes>
			<Route path="/:listing_id?/:listing_action?/" element={<Wrapper/>}/>
			<Route path={"*"} element={<Navigate to="/" replace />} />
		</Routes>
	</HashRouter>
}

// Render company profile 
const careers = document.getElementById('crewhrm_careers');
if ( careers ) {
	ReactDOM.createRoot(careers).render(
		<MountPoint element={careers}>
			<Router {...getElementDataSet(careers)} />
		</MountPoint>
	);
}
