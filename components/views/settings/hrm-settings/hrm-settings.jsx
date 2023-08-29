import React, { createContext, useContext, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { ContextBackendDashboard } from '../../hrm/hrm.jsx';
import { WpDashboardFullPage } from '../../../materials/backend-dashboard-container/full-page-container.jsx';
import { Options } from './options/options.jsx';
import { Segments } from './segments/segments.jsx';
import { StickyBar } from '../../../materials/sticky-bar/sticky-bar.jsx';
import { __ } from '../../../utilities/helpers.jsx';
import { settings_fields } from './field-structure.jsx';
import { ContextNonce } from '../../../materials/mountpoint.jsx';
import { request } from '../../../utilities/request.jsx';
import { ContextHistoryFields, HistoryFields, UndoRedo } from '../../../materials/undo-redo.jsx';
import { ContextToast } from '../../../materials/toast/toast.jsx';

export const ContextSettings = createContext();

function Wrapper({ children }) {
    const { nonce, nonceAction } = useContext(ContextNonce);
	const {
		clearHistory, 
		can_go_next, 
		values, 
		onChange
	} = useContext(ContextHistoryFields);

	const {ajaxToast} = useContext(ContextToast);
    
    const saveSettings = () => {
		
		request('save_settings', {settings: values, nonceAction, nonce}, resp=>{
			
			ajaxToast(resp);
			
			if( resp?.success ){
				clearHistory();
			}
		});
    };

    const { segment, sub_segment } = useParams();
    const sub_title = settings_fields[segment]?.segments[sub_segment]?.label;
    const title = __('Settings') + (sub_title ? ' > ' + sub_title : '');

    return (
        <ContextSettings.Provider value={{ values, onChange }}>
            <StickyBar backTo={sub_title ? true : false} title={title}>
                <div className={'d-flex align-items-center column-gap-30'.classNames()}>
                    <UndoRedo/>
					<button className={'button button-primary'.classNames()} onClick={saveSettings} disabled={!can_go_next}>
                        {__('Save Changes')}
                    </button>
                </div>
            </StickyBar>
            <div className={'padding-horizontal-15'.classNames()}>
				{children}
			</div>
        </ContextSettings.Provider>
    );
}

export function HRMSettings(props) {
    return (
        <ContextBackendDashboard.Provider value={{}}>
            <WpDashboardFullPage>
				<HistoryFields defaultValues={props.settings || {}}>
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
    );
}
