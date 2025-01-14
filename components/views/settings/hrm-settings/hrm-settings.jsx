import React, { createContext, useContext, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';

import { WpDashboardFullPage } from 'crewhrm-materials/backend-dashboard-container/full-page-container.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';

import { Options } from './options/options.jsx';
import { Segments } from './segments/segments.jsx';
import { settings_fields } from './field-structure.jsx';

import validator from 'validator';

export const ContextSettingsPage = createContext();

export function HRMSettings({ resources, settings = {} }) {

	const { ajaxToast } = useContext(ContextToast);

	const [state, setState] = useState({
		can_go_next: false,
		saving: false,
		resources: resources,
		settings
	});

	const updateResources = (res = {}) => {
		setState({
			...state,
			resources: {
				...state.resources,
				...res
			}
		});
	}

	const validateFields = (v, field) => {
		let isValid = true;

		if (v && field) {
			if (field.type == 'email') {
				isValid = validator.isEmail(v)
			} else if (field.type == 'teltext') {
				isValid = validator.isMobilePhone(v)
			} else if (field.type == 'url') {
				isValid = validator.isURL(v)
			}
		}

		return isValid;
	}

	const onChange = (name, v, field) => {
		const isValid = validateFields(v, field);
		setState({
			...state,
			can_go_next: isValid,
			settings: {
				...state.settings,
				[name]: v
			}
		});
	}

	const saveSettings = () => {

		setState({
			...state,
			saving: true
		});

		request('saveSettings', { settings: state.settings }, (resp) => {
			ajaxToast(resp);
			setState({
				...state,
				can_go_next: false,
				saving: false
			});
		});
	};

	const [pageNavigation, setPageNavigation] = useState({}); // State to hold data from Options

	const updatePageNavigation = (data) => {
		setPageNavigation(data);  // This function will update the state
	};

	const { segment, sub_segment } = pageNavigation;
	const sub_title = settings_fields[segment]?.segments[sub_segment]?.label;
	const title = __('Settings') + (sub_title ? ' > ' + sub_title : '');

	return <WpDashboardFullPage>
		<StickyBar canBack={sub_title ? true : false} title={title}>
			<div className={'d-flex align-items-center column-gap-30'.classNames()}>
				<button
					id='crewhrm-settings-save-button'
					className={'button button-primary'.classNames()}
					onClick={saveSettings}
					disabled={!state.can_go_next}
				>
					{__('Save Changes')} <LoadingIcon show={state.saving} />
				</button>
			</div>
		</StickyBar>

		<div className={'padding-horizontal-15 overflow-auto'.classNames()}>
			<ContextSettingsPage.Provider value={{ resources: state.resources, updateResources, values: state.settings, onChange, validateFields, updatePageNavigation }}>
				<HashRouter>
					<Routes>
						<Route
							path="/settings/"
							element={<Segments />}
						/>

						<Route
							path="/settings/:segment/:sub_segment/"
							element={<Options />}
						/>

						<Route path={'*'} element={<Navigate to="/settings/" replace />} />
					</Routes>
				</HashRouter>
			</ContextSettingsPage.Provider>
		</div>
	</WpDashboardFullPage>
}
