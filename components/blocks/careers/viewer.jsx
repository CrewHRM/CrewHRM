import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {MountPoint} from 'crewhrm-materials/mountpoint.jsx';
import {__, data_pointer, getElementDataSet} from 'crewhrm-materials/helpers.jsx';
import {request} from 'crewhrm-materials/request.jsx';
import {LoadingIcon} from 'crewhrm-materials/loading-icon/loading-icon.jsx';

import { CareersRouter } from "../../views/careers";

function Wrapper({attributes={}, filters={}}) {

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
					settings={{...settings, ...attributes}}
					filters={filters}/>
		}
	</> 
}

if ( window[data_pointer]?.is_frontend ) {
	const careers = document.getElementsByClassName('crewhrm-careers-block');
	if ( careers.length ) {
		const element = careers[0];
		const {attributes={}} = getElementDataSet(element);

		const filters = {};
		const filter_keys = [
			'department_id',
			'keyword',
			'country_code',
			'employment_type'
		];

		for ( let i=0; i<filter_keys.length; i++ ) {
			let key = filter_keys[i];
			if ( attributes[key] ) {
				filters[key=='keyword' ? 'search' : key] = attributes[key];
			}

			delete attributes[key];
		}
		
		createRoot(element).render(
			<MountPoint>
				<Wrapper 
					attributes={attributes} 
					filters={filters}/>
			</MountPoint>
		);
	}
}
