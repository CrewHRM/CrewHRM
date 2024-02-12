import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { __, data_pointer } from 'crewhrm-materials/helpers.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';

import Employeelist from './employeelist/Employeelist.jsx';

const steps = [
	{
		id: 'employee_list',
		label: __('Employee List'),
	},
	{
		id: 'attendance',
		label: __('Attendance'),
	},
	{
		id: 'leave',
		label: __('Leave'),
	},
	{
		id: 'payroll',
		label: __('Payroll'),
	},
	{
		id: 'documents',
		label: __('Documents'),
	},
	{
		id: 'training',
		label: __('Training'),
	},
];

export function EmployeeDashboard() {
	// eslint-disable-next-line no-unused-vars
	const [activeTab, setActiveTab] = useState('employee_list');
	return (
		<>
			<StickyBar title={__('People')}>
				<div className={'d-flex align-items-center column-gap-30'.classNames()}>
					<div className={'d-inline-block'.classNames()}>
						<Link
							to={`/employees/invite/`}
							className={'button button-primary'.classNames()}
						>
							{__('Add New Employee')}
						</Link>
					</div>
				</div>
			</StickyBar>
			
			<div className={'container'.classNames()} style={{ paddingTop: '40px' }}>
				{/* <Tabs
					active={activeTab}
					onNavigate={(active_tab) => {
						setActiveTab(active_tab);
					}}
					tabs={steps}
					theme="transparent"
					scrollIntoViewOnChange={true}
				/> */}
				
				{activeTab == 'employee_list' ? <Employeelist /> : null}
			</div>
		</>
	);
}
