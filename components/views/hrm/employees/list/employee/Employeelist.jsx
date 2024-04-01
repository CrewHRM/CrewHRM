import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { Options } from 'crewhrm-materials/dropdown/dropdown';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { Pagination } from 'crewhrm-materials/pagination/pagination.jsx';
import { ToggleSwitch } from 'crewhrm-materials/toggle-switch/ToggleSwitch.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import { countries_object, employment_statuses, employment_types } from 'crewhrm-materials/data.jsx';

import empty_img from './empty.png';

import EmployeelistCss from './employeelist.module.scss';

const options = [
	{
		name: 'edit',
		label: __('Edit'),
		icon: 'ch-icon ch-icon-edit-2',
	},
	{
		name: 'details',
		label: __('Details'),
		icon: 'ch-icon ch-icon-circle-info',
	},
];


const columns = {
	email: {
		label: __('Email'),
		description: __('The unique email')
	},
	role: {
		label: __('Role'),
		description: __('The designation assigned to the employee')
	},
	department: {
		label: __('Department'),
		description: __('The department hired to. Such as development, marketing and so on.')
	},
	type: {
		label: __('Type'),
		description: __('Employment type such as Full Time, Contract and so on.')
	},
	location: {
		label: __('Location'),
		description: __('Location\/address of the employee')
	},
	hire_date: {
		label: __('Hire Date'),
		description: __('The hire date')
	},
	employment_status: {
		label: __('Employment Status'),
		description: __('Employment status')
	}
};

export function Employeelist() {
	const {ajaxToast} = useContext(ContextToast);
	const navigate = useNavigate();

	// Get the column configurations from local storage
	let col_configs = window.localStorage.getItem('crewhrm_employees_column_configs');
	col_configs = col_configs ? JSON.parse(col_configs) : {};
	
	const [state, setState] = useState({
		fetching: true,
		isActivePopup: false,
		column_configs: col_configs,
		column_configs_input: col_configs,
		employees: [],
		segmentation: {},
		filters: {
			search: '',
			page: 1
		}
	});

	const updateColumnConfigs=(name, status)=>{
		const {column_configs_input={}} = state;
		const configs = {
			...column_configs_input,
			[name]: status
		};

		setState({
			...state,
			column_configs_input: configs
		});
	}

	const setIsActivePopup=isActivePopup=>{
		setState({
			...state, 
			isActivePopup
		});
	}

	const setFilter=(name, value)=>{
		
		const {filters={}} = state;
		
		fetchEmployees({
			...filters,
			[name]: value,
			page: name=='page' ? value : 1
		});
	}

	const employeeAction = (action, employee)=>{

		switch(action) {

			case 'edit' :
				navigate(`/employees/profile/${employee.user_id}/edit/`);
				break;

			case 'details' :
				navigate(`/employees/profile/${employee.user_id}/`);
				break;
		}
	}

	const saveColumnConfigs=()=>{
		setState({
			...state,
			column_configs: state.column_configs_input,
			isActivePopup: false
		});
		window.localStorage.setItem('crewhrm_employees_column_configs', JSON.stringify(state.column_configs_input));
	}

	const fetchEmployees=(filters={})=>{

		setState({
			...state,
			fetching: true,
			filters
		});

		request('getEmployeeList', {filters, is_admin: true}, resp=>{
			
			const {
				success= false,
				data: {
					employees=[],
					segmentation={}
				}
			} = resp;

			setState({
				...state,
				fetching: false,
				filters,
				employees,
				segmentation
			});

			if( ! success ) {
				ajaxToast(resp);
			}
		} );
	}

	useEffect(()=>{
		fetchEmployees();
	}, []);

	const column_keys = Object.keys(columns).filter(c_id=>state.column_configs[c_id] ?? true);

	return (
		<>
			<div className={'employeelist-wrapper'.classNames(EmployeelistCss)}>
				<div className={'data-table-wrapper'.classNames(EmployeelistCss)}>
					<div className={'margin-top-40'.classNames() + ' data-table-filter'.classNames(EmployeelistCss)}>
						<div className={'searchbox'.classNames(EmployeelistCss)}>
							<TextField
								placeholder={__('ex. John doe')}
								value={state.filters.search || ''}
								onChange={(v) => setFilter('search', v)}
								type='search'
							/>
						</div>
						{/* <div className={'filter-dropdown'.classNames(EmployeelistCss)}>
							<DropDown
								theme="filter"
								themeFilterText="Showing:"
								themeFilterIconText="Active"
								themeFilterCount="85"
								themeFilterGap="5"
								value={''}
								placeholder="Sorting"
								onChange={(v) => {
									setSorting(v);
								}}
								options={}
							/>
						</div>
						<div className={'list-style'.classNames(EmployeelistCss)}>
							<DropDown
								theme="filter"
								themeFilterText="Style"
								themeFilterIcon="ch-icon-row-vertical"
								themeFilterIconText="List"
								themeFilterCount="85"
								value={''}
								placeholder="Sorting"
								onChange={(v) => {
									setSorting(v);
								}}
								options={[]}
							/>
						</div> */}
						<div
							onClick={() => setIsActivePopup(true)}
							className={
								'settings'.classNames(EmployeelistCss) + 'flex-center cursor-pointer'.classNames()
							}
						>
							<i
								className={'ch-icon ch-icon-settings-gear d-inline-block vertical-align-middle font-size-18 color-text'.classNames()}
							/>
						</div>
					</div>
					{
						(!state.fetching && !state.employees.length) ? 
						<div className={'text-align-center'.classNames()} style={{padding: '130px 0'}}>
							<img 
								src={empty_img} 
								style={{width: '180px', height: 'auto'}}
								className={'margin-bottom-20'.classNames()}/>

							<span className={'d-block font-size-17 font-weight-500 color-text-light margin-bottom-20'.classNames()}>
								{__('No employee added yet')}
							</span>

							<div className={'d-inline-block'.classNames()}>
								<Link 
									to='/employees/invite/' 
									className={'button button-primary'.classNames()}
								>
									{__('Add New Employee')}
								</Link>
							</div>
						</div> 
						:
						<div className={'margin-top-20 overflow-auto'.classNames()}>
							<table className={'table-flat'.classNames()}>
								<thead>
									<tr>
										<th>
											<div className={'first-column'.classNames()}>
												<span>{__('ID')}</span>
												<span>{__('Name')}</span>
											</div>
										</th>
										{
											column_keys.map(c_id=>{
												return <th key={c_id}>
													{columns[c_id].label}
												</th>
											})
										}
										<th></th>
									</tr>
								</thead>
								<tbody>
									{
										state.employees.map((employee) => {

											const {
												user_id, 
												avatar_url, 
												display_name,
												email,
												designation,
												department_name,
												employment_type,
												employment_status,
												address={},
												employee_id,
												hire_date,
											} = employee;

											return <tr key={user_id}>
												<th>
													<div className={'table-shadow'.classNames()}></div>
													<div
														className={'table-stikcy-glasseffect'.classNames()}
													></div>
													<div className={'first-column'.classNames()}>
														<div className={'color-text-light'.classNames()}>
															{employee_id}
														</div>
														<div
															className={'d-flex align-items-center column-gap-10'.classNames()}
														>
															<img 
																src={avatar_url} 
																style={{width: '32px', height: '32px', borderRadius: '50%'}}
															/>
															<Link to={`/employees/profile/${user_id}/`} className={'color-text'.classNames()}>
																<span>{display_name}</span>
															</Link>
															{/* <span
																className={
																	'color-text-light margin-left-5'.classNames() +
																	'table-badge'.classNames()
																}
															>
																Invited
															</span> */}
														</div>
													</div>
												</th>
												{
													column_keys.map(c_id=>{
														return <td key={c_id}>
															{c_id !== 'email' ? null : email}
															{c_id !== 'role' ? null : designation}
															{c_id !== 'department' ? null : department_name}
															{c_id !== 'type' ? null : (employment_types[employment_type] || null)}
															{c_id !== 'location' ? null : countries_object[address?.country_code]}
															{c_id !== 'hire_date' ? null : hire_date}
															{c_id !== 'employment_status' ? null : employment_statuses[employment_status]}
														</td>
													})
												}
												<td>
													<Options
														onClick={action=>employeeAction(action, employee)}
														options={options.map((o) => {
															return {
																id: o.name,
																label: (
																	<span className={'d-inline-flex align-items-center column-gap-10'.classNames()}>
																		<i className={o.icon.classNames() + 'font-size-24 color-text'.classNames()}></i>

																		<span className={'font-size-15 font-weight-500 line-height-25 color-text'.classNames()}>
																			{o.label}
																		</span>
																	</span>
																),
															};
														})}
													>
														<i
															className={'ch-icon ch-icon-more color-text-light font-size-20 cursor-pointer d-inline-block margin-left-15'.classNames()}
														></i>
													</Options>
												</td>
											</tr>
										})
									}
								</tbody>
							</table>
							<LoadingIcon show={state.fetching} center={true}/>
						</div>
					}
					
					{
						(state.segmentation?.page_count || 0 ) < 2 ? null :
						<div
							className={
								'd-flex align-items-center justify-content-center margin-top-40'.classNames() +
								'data-table-pagination'.classNames(EmployeelistCss)
							}
						>
							<Pagination
								theme="data-table-pagination"
								previousLabel={__('Previous')}
								nextLabel={__('Next')}
								onChange={page => setFilter('page', page)}
								pageNumber={state.segmentation.page}
								pageCount={state.segmentation.page_count}
							/>
						</div>
					}
					
				</div>
			</div>

			<div
				className={
					'padding-15'.classNames() +
					`settings-modal-wrapper ${state.isActivePopup ? 'active' : ''}`.classNames(EmployeelistCss)
				}
			>
				<div onClick={() => setIsActivePopup(!state.isActivePopup)} className={'cursor-pointer'.classNames()}></div>
				<div
					className={
						'padding-40 d-flex flex-direction-column justify-content-space-between row-gap-20'.classNames() +
						`settings-modal ${state.isActivePopup ? 'active' : ''}`.classNames(EmployeelistCss)
					}
				>
					<div className={'d-flex flex-direction-column row-gap-20'.classNames()}>
						<div
							className={
								'd-flex align-items-center justify-content-space-between'.classNames() +
								''.classNames(EmployeelistCss)
							}
						>
							<span className={'font-size-20 font-weight-500 line-height-32 color-text '.classNames()}>
								{__('Edit Columns')}
							</span>
							<i
								onClick={() => setIsActivePopup(false)}
								className={'ch-icon ch-icon-times cursor-pointer font-size-24 color-text '.classNames()}
								style={{ color: 'rgb(0 0 0 / 40%)', fontSize: '28px', fontWeight: '600' }}
							></i>
						</div>

						{
							Object.keys(columns).map(c_id=>{

								const enabled = state.column_configs_input[c_id] ?? true;

								return <div
									key={c_id}
									className={
										'crew-hrm-border d-flex align-items-center justify-content-space-between padding-15'.classNames()
									}
								>
									<div className={'d-flex align-items-center column-gap-10'.classNames()}>
										{/* <i className={'ch-icon ch-icon-drag font-size-24 color-text'.classNames()}></i> */}
										<span className={'font-size-17 font-weight-500 line-height-25 color-text'.classNames()}>
											{columns[c_id].label}
										</span>
									</div>
									<div className={'d-flex column-gap-10'.classNames()}>
										{/* <i
											className={'ch-icon ch-icon-circle-info font-size-24 color-text-light'.classNames()}
										></i> */}
										<ToggleSwitch 
											checked={enabled} 
											onChange={(_enabled) => updateColumnConfigs(c_id, _enabled)} />
									</div>
								</div>
							})
						}
					</div>
					<div className={'d-flex column-gap-20'.classNames() + ''.classNames(EmployeelistCss)}>
						<button
							className={'flex-1 button button-primary button-large button-outlined button-outlined-light'.classNames()}
							style={{ maxWidth: '138px' }}
							onClick={()=>setIsActivePopup(false)}
						>
							{__('Cancel')}
						</button>
						<button 
							className={'flex-1 button button-primary button-large '.classNames()}
							onClick={saveColumnConfigs}
						>
							{__('Update')}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
