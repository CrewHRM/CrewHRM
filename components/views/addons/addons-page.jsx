import React, { useContext, useState } from "react";
import {createRoot} from 'react-dom/client';

import { MountPoint } from "crewhrm-materials/mountpoint.jsx";
import { __, getElementDataSet, data_pointer } from "crewhrm-materials/helpers.jsx";
import { ResponsiveLayout } from "crewhrm-materials/responsive-layout.jsx";
import { request } from "crewhrm-materials/request.jsx";
import { WpDashboardFullPage } from "crewhrm-materials/backend-dashboard-container/full-page-container.jsx";
import { ContextToast } from "crewhrm-materials/toast/toast.jsx";
import { Conditional } from "crewhrm-materials/conditional.jsx";
import { LoadingIcon } from "crewhrm-materials/loading-icon/loading-icon.jsx";
import { StickyBar } from "crewhrm-materials/sticky-bar.jsx";
import { applyFilters } from "crewhrm-materials/hooks.jsx";

function UpgraderBar() {
	return <div className={'d-flex align-items-center column-gap-6 border-radius-5 border-1 b-color-primary padding-8'.classNames()}>
		<div className={'flex-1 font-size-14 font-weight-400 letter-spacing-2 color-text'.classNames()}>
			<i className={'ch-icon ch-icon-flash d-inline-block vertical-align-middle font-size-24 color-secondary margin-right-6 '.classNames()}/>
			Get a 50% discount on the PRO license and <span className={'font-weight-600'.classNames()}>enjoy full access to all add-ons!</span>
		</div>
		<div>
			<a href="https://getcrewhrm.com/pricing/" target="_blank" className={'button button-secondary'.classNames()} style={{padding: '5.5px 15px'}}>
				{__('Upgrade now')}
			</a>
		</div>
	</div>
}

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

	return <>
		<StickyBar title={__('Addons')}>
			<div className={'d-flex align-items-center column-gap-30'.classNames()}>
				<div className={'d-inline-block'.classNames()}>
					<a
						href={`${window[data_pointer].admin_url}=${window[data_pointer].app_name}#/dashboard/jobs/editor/new/`}
						className={'button button-primary'.classNames()}
					>
						{__('Create A New Job')}
					</a>
				</div>
			</div>
		</StickyBar>

		<div className={'padding-15'.classNames()}>
			<div className={'margin-auto'.classNames()} style={{maxWidth: '989px'}}>

				{
					applyFilters(
						'crewhrm_addon_page_pro_upgrade_bar', 
						<div className={'padding-vertical-30 margin-top-30'.classNames()}>
							<UpgraderBar/>
						</div>
					)
				}
				
				<ResponsiveLayout columnWidth={236}>
					{Object.keys(state.addons).map(id=>{
						let {plugin_name: addon_name='', description, crewhrm_id, locked, thumbnail_url} = state.addons[id];
						let enabled = state.addonStates[crewhrm_id] ? true : false;

						return <div key={id} className={'d-flex flex-direction-column justify-content-space-between position-relative height-p-100 b-color-tertiary border-radius-5 padding-vertical-30 padding-horizontal-20 bg-color-white'.classNames()}>
							<Conditional show={locked}>
								<i className={'ch-icon ch-icon-lock position-absolute right-15 top-15 color-text-light font-size-18'.classNames()}></i>
							</Conditional>

							<div className={''.classNames()}>
								<img src={thumbnail_url} className={'width-p-100 height-auto d-block margin-auto margin-bottom-15'.classNames()} style={{maxWidth: '160px'}}/>
								
								<strong className={'d-block margin-bottom-15 font-size-20 font-weight-600 color-text'.classNames()}>
									{addon_name.replace('Crew HRM - ', '')}
								</strong>
								<div className={'margin-bottom-15 font-size-14 font-weight-400 color-text-light'.classNames()}>
									{description}
								</div>
							</div>
							
							<div>
								<Conditional show={locked}>
									<a href="https://getcrewhrm.com/pricing/" target="_blank" className={'d-block text-align-center button button-primary button-outlined width-p-100 d-block'.classNames()}>
										{__('Unlock Now')}
									</a>
								</Conditional>

								<Conditional show={!locked}>
									<button 
										disabled={loadingState[id]}
										className={`button button-primary button-outlined ${enabled ? '' : 'button-outlined-light'} width-p-100 d-block`.classNames()} onClick={()=>toggleState(id, !enabled)}
									>
										{enabled ? __('Deactivate') : __('Activate')} <LoadingIcon show={loadingState[id] ? true : false}/>
									</button>
								</Conditional>
							</div>
						</div>
					})}
				</ResponsiveLayout>
			</div>
		</div>
	</>
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