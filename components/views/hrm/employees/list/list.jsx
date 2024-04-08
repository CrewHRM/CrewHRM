import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';
import { applyFilters } from 'crewhrm-materials/hooks.jsx';
import { RenderExternal } from 'crewhrm-materials/render-external.jsx';

import {Employeelist} from './employee/Employeelist.jsx';
import { request } from 'crewhrm-materials/request.jsx';

export function EmployeeDashboard() {

	const {tab_name='employee'} = useParams();
	const navigate = useNavigate();
	const [state, setState] = useState({
		meta_data: {}
	});

	const steps = applyFilters(
		'employee_list_pages',
		{
			employee: {
				label: __('Employee List'),
				component: Employeelist
			},
			/* attendance: {
				label: __('Attendance'),
			},
			payroll: {
				label: __('Payroll'),
			},
			documents: {
				label: __('Documents'),
			},
			training: {
				label: __('Training'),
			}, */
		}
	);

	const getMetaData=()=>{
		request('getEmployeeListMetaData', {}, resp=>{
			
			setState({
				...state,
				meta_data: resp.data
			});
		});
	}

	useEffect(()=>{
		getMetaData();
	}, []);

	const Comp = steps[tab_name]?.component;

	return <>
		<StickyBar title={__('People')}>
			<div className={'d-flex align-items-center column-gap-30'.classNames()}>
				<div className={'d-inline-block'.classNames()}>
					<Link
						to={`/employees/new/`}
						className={'button button-primary'.classNames()}
					>
						{__('Add New Employee')}
					</Link>
				</div>
			</div>
		</StickyBar>
		
		<div className={'container'.classNames()} style={{ paddingTop: '40px' }}>
			<Tabs
				active={tab_name}
				theme="transparent"
				onNavigate={(active_tab) =>navigate(`/employees/list/${active_tab==='employee' ? '' : active_tab+'/'}`)}
				tabs={Object.keys(steps).map(s=>{
					return {
						id: s,
						label: `${steps[s].label}${state.meta_data[s] ? ` (${state.meta_data[s]})` : ``}`
					}
				})}
			/>
			
			{
				Comp ? 
				<RenderExternal component={Comp} payload={{tab_name}}/> : 
				<span className={'color-error'.classNames()}>
					{__('Component not found')}
				</span>
			}
		</div>
	</>
}
