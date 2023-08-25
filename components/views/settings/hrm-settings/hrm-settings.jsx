import React, { createContext, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { ContextBackendDashboard } from "../../hrm/hrm.jsx";
import { WpDashboardFullPage } from "../../../materials/backend-dashboard-container/full-page-container.jsx";
import { Options } from "./options/options.jsx";
import { Segments } from "./segments/segments.jsx";

export const ContextSettings = createContext();

function Wrapper({children}) {
	const [state, setState] = useState({
		values: {}
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

	return <ContextSettings.Provider value={{values: state.values, setValue}}>
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
