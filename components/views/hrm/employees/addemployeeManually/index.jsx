import React, { createContext, useContext, useEffect, useState } from 'react';

import { __, data_pointer } from 'crewhrm-materials/helpers.jsx';
import { FormActionButtons } from 'crewhrm-materials/form-action.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import {ContextToast} from 'crewhrm-materials/toast/toast.jsx';
import {InitState} from 'crewhrm-materials/init-state.jsx';

import AddEmployeeCss from './AddManually.module.scss';
import EmployeeStatusForm from './EmployeeStatusForm.jsx';
import EmployeeInfoForm from './EmployeeInfoForm.jsx';
import EmployeeContractDetailsForm from './EmployeeContractDetailsForm.jsx';
import AdditionalOptionForm from './AdditionalOptionForm.jsx';
import EmployeeBenefitForm from './EmployeeBenefitForm.jsx';
import { useNavigate, useParams } from 'react-router-dom';
// import AddEmployeeCongrats from './AddEmployeeCongrats.jsx';

import EmployeeIndexCss from '../index.module.scss';
import CongratsAddEmployee from './CongratsAddEmployee.jsx';

export const ContextAddEmlpoyeeManually = createContext();

const steps = [
	{
		id: 'employee-info',
		label: __('Employee Info'),
		required: ['job_title', 'department_id', 'job_description'],
	},
	{
		id: 'employment-status',
		label: __('Employment Status'),
	},
	{
		id: 'contract-details',
		label: __('Contract Details'),
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

	const [state, setState] = useState({
		saving: false,
		fetching: false,
		last_step_passed: false,
		error_message: null,
		values: {}
	});

	const onChange=(name, value)=>{
		setState({
			...state,
			values: {
				...state.values,
				[name]: value
			}
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

	const updateEmployee=(callback)=>{

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
					user_id = saved_user_id = null,
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
			
			if ( !user_id && saved_user_id ) {
				navigateTab('employee-info', saved_user_id, active_tab, true);
			}

			navigateTab(1);
		});
	}

	const navigateTab = (tab, e_id, _tab, replace) => {
		const current_index = steps.findIndex((s) => s.id == active_tab);

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

	return state.last_step_passed ? <CongratsAddEmployee/> : <ContextAddEmlpoyeeManually.Provider value={{onChange, values: state.values, departments}}>
		<StickyBar title={__('People Manually')} canBack={true}>
			<div className={'d-flex align-items-center column-gap-30'.classNames()}>
				<div className={'d-inline-block'.classNames()}>
					<a
						href={`${window[data_pointer].admin_url}=${window[data_pointer].app_name}#/dashboard/jobs/editor/new/`}
						className={'button button-primary'.classNames()}
					>
						{__('Update')}
					</a>
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
							'd-flex justify-content-space-between margin-top-40'.classNames()
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
							<span className={''.classNames(AddEmployeeCss) + ''.classNames()}>{active_index + 1}</span>/
							<span className={''.classNames(AddEmployeeCss) + ''.classNames()}>{steps.length}</span>
							<span className={'margin-left-4'.classNames()}>completed</span>
							<span
								className={
									'complete-progressbar-bar'.classNames(AddEmployeeCss) + 'margin-left-10'.classNames()
								}
							>
								<span
									style={{ width: `${(60 / steps.length) * (active_index + 1)}px` }}
									className={'upgradeable-progressbar-bar'.classNames(AddEmployeeCss) + ''.classNames()}
								></span>
							</span>
						</div>
					</div>

					<div
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
						
							<div className={'d-flex margin-top-40 margin-bottom-10'.classNames()}>
								<div className={'flex-1'.classNames()}>
									<FormActionButtons
										nextText={'Save & Continue'}
										onBack={active_index>0 ? () => navigateTab(-1) : null}
										onNext={updateEmployee}
										disabledNext={state.saving}
										loading={state.saving}
									/>
								</div>
								<div className={'right-col'.classNames()}></div>
							</div>
						</div>
					</div>
				</>
		}
	</ContextAddEmlpoyeeManually.Provider>
}
