import React from 'react';
import { HashRouter, Navigate, Routes, Route } from 'react-router-dom';

import ScrollToTop from 'crewhrm-materials/scrollToTop/ScrollToTop.jsx';
import {data_pointer} from 'crewhrm-materials/helpers.jsx';

import EmployeeInvite from './add/invite/EmployeeInvite.jsx';
import {AddEmployeeManually} from './add/manually/index.jsx';
import AddEmployee from './add/addemployee.jsx';
import AddEmployeeHirelist from './add/hire/AddEmployeeHirelist.jsx';
import { EmployeeDashboard } from './list/list.jsx';
import { EmployeeProfileSingle } from './profile/Profile.jsx';

const {has_pro} = window[data_pointer];

export function Employees(props) {
	return <HashRouter>
			<ScrollToTop />
			<Routes>

				{/* Main emlpoyee list screen */}
				<Route
					path="/employees/list/:tab_name?/"
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
					path="/employees/new/"
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
							path="/employees/new/invite/"
							element={
								<>
									<EmployeeInvite />
								</>
							}
						/>
						<Route
							path="/employees/new/import/"
							element={
								<>
									<AddEmployeeHirelist />
								</>
							}
						/>
					</>
				}
				
				<Route path={'*'} element={<Navigate to="/employees/list/" replace />} />
			</Routes>
		</HashRouter>
}
