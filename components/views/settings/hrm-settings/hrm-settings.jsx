import React, { createContext, useState } from "react";
import { HashRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { ContextBackendDashboard } from "../../hrm/hrm.jsx";
import { WpDashboardFullPage } from "../../../materials/backend-dashboard-container/full-page-container.jsx";
import { Options } from "./options/options.jsx";
import { Segments } from "./segments/segments.jsx";
import { StickyBar } from "../../../materials/sticky-bar/sticky-bar.jsx";
import { __ } from "../../../utilities/helpers.jsx";
import { settings_fields } from "./field-structure.jsx";

export const ContextSettings = createContext();

function Wrapper({children}) {
	const [state, setState] = useState({
		values: {},
		history_index: null,
		history: []
	});

	const setValue=(name, value)=>{
		setState({
			...state,
			values: {
				...state.values,
				[name]: value
			}
		})
	}

	const shiftAction=()=>{
		
	}

	const {segment, sub_segment} = useParams();
	const sub_title = settings_fields[segment]?.segments[sub_segment]?.label;
	const title = __( 'Settings' ) + (sub_title ? ' > ' + sub_title : '');

	return <ContextSettings.Provider value={{
			values: state.values, // state.history[state.history_index] || {}, 
			setValue, 
			undoAction: ()=>shiftAction(-1),
			redoAction: ()=>shiftAction(1)}}>

		<StickyBar backTo={sub_title ? true : false} title={title}>
			<div className={'d-flex align-items-center column-gap-30'.classNames()}>
				<i className={'ch-icon ch-icon-redo font-size-26 color-text-hint'.classNames()}></i>
				<i className={'ch-icon ch-icon-undo font-size-26 color-text-hint'.classNames()}></i>
				<button className={'button button-primary'.classNames()}>
					{__( 'Save Changes' )}
				</button>
			</div>
		</StickyBar>

		{children}
	</ContextSettings.Provider>
}

export function HRMSettings(props) {
	return <ContextBackendDashboard.Provider value={{}}>
		<WpDashboardFullPage>
			<HashRouter>
				<Routes>
					<Route path="/settings/" element={<Wrapper>
						<Segments/>
					</Wrapper>}/>

					<Route path="/settings/:segment/:sub_segment/" element={<Wrapper>
						<Options/>
					</Wrapper>}/>

					<Route path={"*"} element={<Navigate to="/settings/" replace />} />
				</Routes>
			</HashRouter>
		</WpDashboardFullPage>
	</ContextBackendDashboard.Provider>
}
