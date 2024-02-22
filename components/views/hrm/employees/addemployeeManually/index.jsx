import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { __, isEmpty } from 'crewhrm-materials/helpers.jsx';
import { FormActionButtons } from 'crewhrm-materials/form-action.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import {ContextToast} from 'crewhrm-materials/toast/toast.jsx';
import {InitState} from 'crewhrm-materials/init-state.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import { patterns } from 'crewhrm-materials/data.jsx';
import { isAddressValid } from 'crewhrm-materials/address-fields.jsx';

import AddEmployeeCss from './AddManually.module.scss';
import EmployeeStatusForm from './EmployeeStatusForm.jsx';
import EmployeeInfoForm from './EmployeeInfoForm.jsx';
import EmployeeContractDetailsForm from './EmployeeContractDetailsForm.jsx';
import AdditionalOptionForm from './AdditionalOptionForm.jsx';
import EmployeeBenefitForm from './EmployeeBenefitForm.jsx';

import EmployeeIndexCss from '../index.module.scss';
import CongratsAddEmployee from './CongratsAddEmployee.jsx';

export const ContextAddEmlpoyeeManually = createContext();

const steps = [
	{
		id: 'employee-info',
		label: __('Employee Info'),
		regex: {
			first_name: patterns.first_name,
			last_name: patterns.last_name,
			user_email: patterns.email,
		}
	},
	{
		id: 'employment-status',
		label: __('Employment Status'),
		regex: {
			employee_id: /\S+/,
			designation: /\S+/,
			department_id: /\d/
		}
	},
	{
		id: 'contract-details',
		label: __('Contract Details'),
		regex: {
			employment_type: /\S+/,
			weekly_working_hour: /^[1-9]+$/
		}
	},
	{
		id: 'benefits',
		label: __('Benefits'),
	},
	{
		id: 'additional-option',
		label: __('Additional Option'),
	},
];

export function AddEmployeeManually({departments={}}) {

	const navigate = useNavigate();
	const {ajaxToast} = useContext(ContextToast);

	const {
		active_tab = 'employee-info', 
		user_id: _user_id
	} = useParams();

	const user_id = ( isNaN(_user_id) || !_user_id ) ? 0 : _user_id;
	const form_ref = useRef();

	const [state, setState] = useState({
		saving: false,
		fetching: false,
		last_step_passed: false,
		error_message: null,
		showErrorsAlways: false,
		expand_additional_section: false,
		values: {}
	});

	const onChange=(name, value)=>{
		
		const {values={}} = state;

		setState({
			...state,
			values: typeof name === 'object' ? {...values, ...name} : {...values, [name]: value}
		});
	}

	const fetchEmployee=()=>{
		if ( ! user_id ) {
			return;
		}

		setState({
			...state,
			fetching: true
		});

		request('fetchEmployee', {user_id}, resp=>{
			const {
				success,
				data: {
					employee={},
					message = __('Something went wrong!')
				}
			} = resp;

			setState({
				...state,
				values: {
					...state.values,
					...employee
				},
				fetching: false,
				error_message: success ? null : message
			})
		});
	}

	const validateInputs=()=>{
		const {regex={}} = steps.find(s=>s.id===active_tab);

		let show_errors = false;
		let expand_additional_section = false;

		for ( let name in regex ) {
			const value = state.values[name];

			// weekly_working_hour is mandatory when the employement type is either full time or part time.
			if ( name==='weekly_working_hour' && ['full_time', 'part_time'].indexOf(state.values.employment_type)===-1 ) {
				continue;
			}

			if ( regex[name] instanceof RegExp && (value===null || value==undefined || !regex[name].test(value) ) ) {
				show_errors = true;
				break;
			}
		}

		// Check for address exceptionally
		if ( ! isAddressValid( state.values ) ) {
			show_errors = true;
		}

		// Validate social links exceptionally
		for ( let k in state.values ) {
			if ( k.indexOf('social_link_')!==0 || isEmpty( state.values[k] ) || patterns.url.test(state.values[k]) ) {
				continue;
			}

			expand_additional_section = true;
			show_errors = true;
			break;
		}

		setState({
			...state,
			showErrorsAlways: show_errors,
			expand_additional_section
		});

		return !show_errors;
	}

	const updateEmployee=(go_next=true)=>{

		if ( ! validateInputs() ) {
			form_ref.current.scrollIntoView({
				block: "start", 
				inline: "nearest",
				behavior: 'smooth'
			});
			return;
		}

		setState({
			...state,
			saving: true,
		});
		
		const {values={}} = state;
		const {avatar_image} = values;
		delete values.avatar_image;

		request('updateEmployee', {employee: {...values, user_id}, avatar_image}, resp=>{
			const {
				success,
				data: {
					user_id : saved_user_id = null,
					employee = {}
				}
			} = resp;

			setState({
				...state,
				saving: false,
				values: {
					...state.values,
					...employee
				}
			});

			if ( !success ) {
				ajaxToast(resp);
				return;
			}
			
			if ( ! user_id && saved_user_id ) {
				navigateTab('employee-info', saved_user_id, active_tab, true);
			}

			if (go_next) {
				navigateTab(1, saved_user_id);
			}
		});
	}

	const navigateTab = (tab, e_id, _tab, replace) => {
		const current_index = steps.findIndex((s) => s.id == active_tab);

		if ( tab === 1 && current_index == steps.length -1 ) {
			setState({
				...state,
				last_step_passed: true
			});

			window.setTimeout(()=>{
				navigate('/employees/');
			}, 2500);
			
			return;
		}

		if (tab === 1 || tab === -1) {
			tab = steps[current_index + tab]?.id;
		}

		if (_tab || tab) {
			navigate(`/employees/profile/${e_id || user_id}/edit/${_tab || tab}/`, {replace});
		}
	};

	useEffect(()=>{
		fetchEmployee();
	}, [user_id]);
	
	const active_index = steps.findIndex((s) => s.id === active_tab);

	return state.last_step_passed ? 
	<CongratsAddEmployee/> : 
	<ContextAddEmlpoyeeManually.Provider 
		value={{
			onChange, 
			values: state.values, 
			departments,
			regex: steps.find(s=>s.id===active_tab)?.regex || {},
			showErrorsAlways: state.showErrorsAlways,
			expand_additional_section: state.expand_additional_section
		}}
	>
		<StickyBar title={user_id ? __('Edit employee') : __('Add new employee')} canBack={true}>
			<div className={'d-flex align-items-center column-gap-30'.classNames()}>
				<div className={'d-inline-block'.classNames()}>
					<button
						onClick={()=>updateEmployee(false)}
						className={'button button-primary'.classNames()}
						disabled={state.saving}
					>
						{user_id ? __('Update Employee') : __('Add Employee')} <LoadingIcon show={state.saving}/>
					</button>
				</div>
			</div>
		</StickyBar>

		{
			(state.fetching || state.error_message) ? 
				<InitState 
					error_message={state.error_message} 
					fetching={state.fetching}
				/> 
				:
				<>
					<div
						className={
							'addemployee-manually-top'.classNames(AddEmployeeCss) +
							'container'.classNames(EmployeeIndexCss) +
							'd-flex justify-content-space-between'.classNames()
						}
					>
						<div className={'font-size-24 font-weight-600 color-text'.classNames()}>
							{steps.filter((step) => step.id === active_tab)[0].label}
						</div>
						<div
							className={
								'complete-progressbar'.classNames(AddEmployeeCss) +
								'd-flex align-items-center font-size-15 line-height-20 font-weight-500 color-text'.classNames()
							}
						>
							<span className={''.classNames(AddEmployeeCss)}>
								{__(active_index + 1)}
							</span>/
							<span className={''.classNames(AddEmployeeCss)}>
								{__(steps.length)}
							</span>
							<span className={'margin-left-4'.classNames()}>
								{__('completed')}
							</span>
							<span
								className={
									'complete-progressbar-bar'.classNames(AddEmployeeCss) + 'margin-left-10'.classNames()
								}
							>
								<span
									style={{ width: `${(60 / steps.length) * (active_index + 1)}px` }}
									className={'upgradeable-progressbar-bar'.classNames(AddEmployeeCss)}
								></span>
							</span>
						</div>
					</div>

					<div
						ref={form_ref}
						className={
							'd-flex flex-wrap-wrap'.classNames() +
							'container'.classNames(EmployeeIndexCss) +
							'addemployee-manually-wrapper'.classNames(AddEmployeeCss)
						}
					>
						<div className={'sequence-down-wrapper'.classNames(AddEmployeeCss)}>
							<Tabs
								theme="sequence-down"
								active={active_tab}
								tabs={steps.map((s) => {
									return {
										...s,
										label: (
											<span
												className={`font-size-17 font-weight-500 letter-spacing--3 margin-top-3 ${
													s.id == active_tab ? 'color-text' : 'color-text-light'
												}`.classNames()}
											>
												{s.label}
											</span>
										),
									};
								})}
							/>
						</div>

						<div className={'employeeinfo-form-wrapper'.classNames(AddEmployeeCss)}>
							{active_tab == 'employee-info' ? <EmployeeInfoForm /> : null}

							{active_tab == 'employment-status' ? <EmployeeStatusForm /> : null}

							{active_tab == 'contract-details' ? <EmployeeContractDetailsForm /> : null}

							{active_tab == 'benefits' ? <EmployeeBenefitForm /> : null}

							{active_tab == 'additional-option' ? <AdditionalOptionForm /> : null}
						
							<div className={'margin-top-40 margin-bottom-10'.classNames()}>
								<FormActionButtons
									nextText={'Save & Continue'}
									onBack={active_index>0 ? () => navigateTab(-1) : null}
									onNext={()=>updateEmployee()}
									disabledNext={state.saving}
									loading={state.saving}
								/>
							</div>
						</div>
					</div>
				</>
		}
	</ContextAddEmlpoyeeManually.Provider>
}
