import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {MountPoint} from 'crewhrm-materials/mountpoint.jsx';
import {__, data_pointer, getElementDataSet} from 'crewhrm-materials/helpers.jsx';
import {request} from 'crewhrm-materials/request.jsx';
import {LoadingIcon} from 'crewhrm-materials/loading-icon/loading-icon.jsx';

import { CareersRouter } from "../../views/careers";

function Wrapper({attributes={}}) {

	const [settings, setSettings] = useState(null);

	useEffect(()=>{
		request('getCareersSettings', {}, resp=>{
			setSettings(resp?.data?.settings)
		});
	}, []);

	const base_permalink = window.location.pathname.replace(new RegExp(`^[\/]+|[\/]+$`, 'g'), '');

	return <>
		{
			! settings ? 
				<LoadingIcon center={true}/> 
				: 
				<CareersRouter 
					open_in_new={true}
					base_permalink={base_permalink} 
					hash_router={true} 
					settings={{...settings, ...attributes}}/>
		}
	</> 
}

if ( window[data_pointer]?.is_frontend ) {
	const careers = document.getElementsByClassName('crewhrm-careers-block');
	for ( let i=0; i<careers.length; i++ ) {
		const element = careers[i];
		const {attributes={}} = getElementDataSet(element);

		createRoot(element).render(
			<MountPoint>
				<Wrapper attributes={attributes}/>
			</MountPoint>
		);
	}
}
