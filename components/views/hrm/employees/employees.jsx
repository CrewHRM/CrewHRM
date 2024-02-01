import React from 'react';
import { HashRouter, Navigate, Routes, Route } from 'react-router-dom';

import EmployeeInvite from './addemployee/EmployeeInvite.jsx';
import AddEmployeeManually from './addemployeeManually/AddEmployeeManually.jsx';
import AddEmployee from './addemployee/addemployee.jsx';
import AddEmployeeHirelist from './addemployee/AddEmployeeHirelist.jsx';
import ScrollToTop from 'crewhrm-materials/scrollToTop/ScrollToTop.jsx';
import CongratsAddEmployee from './addemployeeManually/CongratsAddEmployee.jsx';

export function Employees() {
	return <HashRouter>
			<ScrollToTop />
			<Routes>
				<Route
					path="/employee/invite"
					element={
						<>
							<AddEmployee />
						</>
					}
				/>
				<Route
					path="/employee/invite/viaemail"
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
				<Route
					path="/employees/profile/:employee_id/edit/:active_tab?/"
					element={
						<>
							<AddEmployeeManually />
						</>
					}
				/>
				<Route path={'*'} element={<Navigate to="/employee/invite/" replace />} />
			</Routes>
		</HashRouter>
}
