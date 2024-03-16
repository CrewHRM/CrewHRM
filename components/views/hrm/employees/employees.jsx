import React from 'react';
import { HashRouter, Navigate, Routes, Route } from 'react-router-dom';

import ScrollToTop from 'crewhrm-materials/scrollToTop/ScrollToTop.jsx';
import {data_pointer} from 'crewhrm-materials/helpers.jsx';

import EmployeeInvite from './addemployee/EmployeeInvite.jsx';
import {AddEmployeeManually} from './addemployeeManually/index.jsx';
import AddEmployee from './addemployee/addemployee.jsx';
import AddEmployeeHirelist from './addemployee/AddEmployeeHirelist.jsx';
import { EmployeeDashboard } from './employee-list/EmployeeDashboard.jsx';
import { EmployeeProfileSingle } from './profile/Profile.jsx';

const {has_pro} = window[data_pointer];

export function Employees(props) {
	return <HashRouter>
			<ScrollToTop />
			<Routes>

				{/* Main emlpoyee list screen */}
				<Route
					path="/employees/"
					element={
						<EmployeeDashboard/>
					}
				/>

				{/* Single employee profiel/details view */}
				<Route
					path="/employees/profile/:user_id/"
					element={
						<>
							<EmployeeProfileSingle {...props}/>
						</>
					}
				/>

				{/* Employee edit screen */}
				<Route
					path="/employees/profile/:user_id/edit/:active_tab?/"
					element={
						<>
							<AddEmployeeManually {...props}/>
						</>
					}
				/>

				{/* Employee invite screen with multiple options like manual, email, from hirelist. Manual invite will show the editor in fact. */}
				<Route
					path="/employees/invite/"
					element={
						<>
							<AddEmployee />
						</>
					}
				/>

				{
					!has_pro ? null :
					<>
						<Route
							path="/employee/invite/"
							element={
								<>
									<EmployeeInvite />
								</>
							}
						/>
						<Route
							path="/employee/invite/hirelist"
							element={
								<>
									<AddEmployeeHirelist />
								</>
							}
						/>
					</>
				}
				
				<Route path={'*'} element={<Navigate to="/employees/" replace />} />
			</Routes>
		</HashRouter>
}
