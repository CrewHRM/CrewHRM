import React, { useContext, useState } from "react";
import {createRoot} from 'react-dom/client';

import { MountPoint } from "crewhrm-materials/mountpoint.jsx";
import { __, getElementDataSet, sprintf } from "crewhrm-materials/helpers.jsx";
import { ResponsiveLayout } from "crewhrm-materials/responsive-layout.jsx";
import { ToggleSwitch } from "crewhrm-materials/toggle-switch/ToggleSwitch.jsx";
import { request } from "crewhrm-materials/request.jsx";
import { WpDashboardFullPage } from "crewhrm-materials/backend-dashboard-container/full-page-container.jsx";
import { ContextToast } from "crewhrm-materials/toast/toast.jsx";

function AddonsPage({addons={}, addonStates={}}) {

	const {ajaxToast} = useContext(ContextToast);

	const [loadingState, setLoadingState] = useState({});

	const [state, setState] = useState({
		addons,
		addonStates
	});

	const toggleState=(id, enabled)=>{
		setLoadingState({
			...loadingState,
			[id]: true
		});

		request('toggleAddonState', {addon_id: id, new_state: enabled}, resp=>{
			if ( !resp.success ) {
				// Show error message if toggle failed
				ajaxToast(resp);

			} else {

				// Set the new enable state as the response succedded
				setState({
					...state,
					addonStates: {
						...state.addonStates,
						[id]: enabled
					}
				});
			}

			// Remove loading state and renable the switch
			setLoadingState({
				...loadingState,
				[id]: false
			});
		});
	}

	return <div className={'padding-15 bg-color-white h-full w-full'.classNames()}>
		<h3>{__('Addons')}</h3>

		<ResponsiveLayout columnWidth={300}>
			{Object.keys(state.addons).map(id=>{
				let {plugin_name: addon_name='', version, description, crewhrm_id, locked} = state.addons[id];
				let enabled = state.addonStates[crewhrm_id] ? true : false;

				return <div key={id} className={'d-flex flex-direction-column justify-content-space-between h-full border-1 b-color-tertiary border-radius-8'.classNames()}>
					<div>
						<div className={'padding-15 d-flex align-items-end column-gap-10'.classNames()}>
							<strong>{addon_name.replace('CrewHRM - ', '')}</strong>
						</div>
						<div className={'padding-horizontal-15 padding-bottom-15'.classNames()}>
							{description}
						</div>
					</div>
					
					<div className={'padding-15 border-top-1 b-color-tertiary d-flex'.classNames()}>
						<div className={'flex-1 d-flex align-items-end column-gap-8'.classNames()}>
							{
								locked ? <>
									<i className={'ch-icon ch-icon-lock font-size-21'.classNames()}></i>
									<a href="http://getcrewhrm.com/pricing/" className={'d-inline-block'.classNames()}>
										{__('Get Pro')}
									</a>
								</> : 
								sprintf(__('Version: %s'), version)}
						</div>
						<div>
							<ToggleSwitch
								disabled={locked || loadingState[id]}
								onChange={state=>!locked ? toggleState(id, state) : null}
								checked={!locked && enabled}/>
						</div>
					</div>
				</div>
			})}
		</ResponsiveLayout>
	</div>
}

const el = document.getElementById('crewhrm_addons_page');
if ( el ) {
	createRoot(el).render(
		<MountPoint>
			<WpDashboardFullPage>
				<AddonsPage {...getElementDataSet(el)}/>
			</WpDashboardFullPage>
		</MountPoint>
	);
}