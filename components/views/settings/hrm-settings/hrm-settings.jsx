import React, { createContext, useContext, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';

import { WpDashboardFullPage } from 'crewhrm-materials/backend-dashboard-container/full-page-container.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { ContextHistoryFields, HistoryFields, UndoRedo } from 'crewhrm-materials/undo-redo.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';

import { ContextBackendDashboard } from '../../hrm/dashboard/home.jsx';
import { Options } from './options/options.jsx';
import { Segments } from './segments/segments.jsx';
import { settings_fields } from './field-structure.jsx';

export const ContextSettings = createContext();

function Wrapper({ children }) {
    const { can_go_next, values = {}, onChange } = useContext(ContextHistoryFields);
    const { ajaxToast } = useContext(ContextToast);
	const [savingState, setSavingState] = useState(false);

    const saveSettings = () => {
		setSavingState(true);
        request('saveSettings', { settings: values }, (resp) => {
            ajaxToast(resp);
			setSavingState(false);
        });
    };

	const dispatcher=(k, v)=>{
		onChange(k, v)
	}

    const { segment, sub_segment } = useParams();
    const sub_title = settings_fields[segment]?.segments[sub_segment]?.label;
    const title = __('Settings') + (sub_title ? ' > ' + sub_title : '');

    return <ContextSettings.Provider value={{ values, onChange: dispatcher }}>
		<StickyBar canBack={sub_title ? true : false} title={title}>
			<div className={'d-flex align-items-center column-gap-30'.classNames()}>
				{/* <UndoRedo /> */}
				<button
					className={'button button-primary'.classNames()}
					onClick={saveSettings}
					disabled={!can_go_next}
				>
					{__('Save Changes')} <LoadingIcon show={savingState}/>
				</button>
			</div>
		</StickyBar>
		<div className={'padding-horizontal-15 overflow-auto'.classNames()}>
			{children}
		</div>
	</ContextSettings.Provider>
}

export function HRMSettings({ resources, settings }) {

	const [state, setState] = useState({
		resources: resources
	});

	const updateResources=(res={})=>{
		setState({
			...state,
			resources: {
				...state.resources,
				...res
			}
		});
	}

    return <ContextBackendDashboard.Provider value={{ resources: state.resources, updateResources }}>
		<WpDashboardFullPage>
			<HistoryFields defaultValues={settings || {}}>
				<HashRouter>
					<Routes>
						<Route
							path="/settings/"
							element={
								<Wrapper>
									<Segments />
								</Wrapper>
							}
						/>

						<Route
							path="/settings/:segment/:sub_segment/"
							element={
								<Wrapper>
									<Options />
								</Wrapper>
							}
						/>

						<Route path={'*'} element={<Navigate to="/settings/" replace />} />
					</Routes>
				</HashRouter>
			</HistoryFields>
		</WpDashboardFullPage>
	</ContextBackendDashboard.Provider>
}
