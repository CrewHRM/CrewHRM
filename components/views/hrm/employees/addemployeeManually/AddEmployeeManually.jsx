import React, { createContext, useContext, useState } from 'react';

import { __, data_pointer } from 'crewhrm-materials/helpers.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import {ContextToast} from 'crewhrm-materials/toast/toast.jsx';

import AddEmployeeCss from './AddManually.module.scss';
import EmployeeStatusForm from './EmployeeStatusForm.jsx';
import EmployeeInfoForm from './EmployeeInfoForm.jsx';
import EmployeeContractDetailsForm from './EmployeeContractDetailsForm.jsx';
import AdditionalOptionForm from './AdditionalOptionForm.jsx';
import EmployeeBenefitForm from './EmployeeBenefitForm.jsx';
import { useNavigate, useParams } from 'react-router-dom';
// import AddEmployeeCongrats from './AddEmployeeCongrats.jsx';

import EmployeeIndexCss from '../index.module.scss';

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

export default function AddEmployeeManually() {

	const {active_tab = 'employee-info'} = useParams();
	const navigate = useNavigate();
	const {ajaxToast} = useContext(ContextToast);

	const [state, setState] = useState({
		saving: false,
		fetching: false,
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

	const updateEmployee=(callback)=>{

		setState({
			...state,
			saving: true,
		});

		request('updateEmployee', {employee: state.values}, resp=>{
			const {
				success,
				data: {
					employee_id = null
				}
			} = resp;

			setState({
				...state,
				saving: false,
				values: {
					...state.values,
					employee_id: employee_id
				}
			});

			if ( !success ) {
				ajaxToast(resp);
				return;
			}
			
			callback();
		});
	}

	const navigateTab = (tab) => {
		const current_index = steps.findIndex((s) => s.id == active_tab);

		if (tab === 1 || tab === -1) {
			tab = steps[current_index + tab]?.id;
		}

		if (tab) {
			navigate(`/employee/invite/manually/${tab}/`);
		}
	};
	
	const active_index = steps.findIndex((s) => s.id === active_tab);

	return (
		<>
			<ContextAddEmlpoyeeManually.Provider
				value={{
					navigateTab,
					onChange,
					updateEmployee,
					saving: state.saving,
					values: state.values
				}}
			>
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

					{active_tab == 'employee-info' ? <EmployeeInfoForm /> : null}

					{active_tab == 'employment-status' ? <EmployeeStatusForm /> : null}

					{active_tab == 'contract-details' ? <EmployeeContractDetailsForm /> : null}

					{active_tab == 'benefits' ? <EmployeeBenefitForm /> : null}

					{active_tab == 'additional-option' ? <AdditionalOptionForm /> : null}
				</div>
			</ContextAddEmlpoyeeManually.Provider>
		</>
	);
}
