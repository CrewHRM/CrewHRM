import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { experience_levels } from 'crewhrm-materials/data.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TagField } from 'crewhrm-materials/tag-field/tag-field.jsx';
import { attendance_types } from 'crewhrm-materials/data.jsx';
import { InstantSearch } from 'crewhrm-materials/instant-search.jsx';

import {ContextAddEmlpoyeeManually} from './index.jsx';
import AddEmployeeCss from './AddManually.module.scss';
import EmployeeIndexCss from '../index.module.scss';
import { DateField } from 'crewhrm-materials/date-time.jsx';

export default function EmployeeStatusForm() {
	
	const { 
		onChange, 
		values={}, 
		departments=[],
		regex={},
		showErrorsAlways
	} = useContext(ContextAddEmlpoyeeManually);

	const {user_id} = useParams();
	
	const addReportingPerson=(user)=>{
		onChange({
			reporting_person: user ? {avatar_url: user.thumbnail_url, display_name: user.label} : null,
			reporting_person_user_id: user ? user.id : null
		});
	}
	
	return (
		<>
			<div
				className={'font-size-24 color-text'.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}
			>
				<div className={'font-size-20 font-weight-500 color-text margin-bottom-30'.classNames()}>
					{__('Employment info')}
				</div>
				<div className={'d-flex margin-top-20'.classNames()}>
					<div style={{width: '302px'}}>
						<div
							className={'color-text font-size-15 line-height-18 margin-bottom-14 font-weight-500'.classNames()}
						>
							{__('Hire Date')}
						</div>
						<DateField 
							value={values.hire_date} 
							onChange={(v) => onChange('hire_date', v)} />
					</div>
				</div>
				<div className={'d-flex margin-top-20'.classNames()}>
					<div className={'margin-right-20'.classNames()}>
						<div
							className={'color-text font-size-15 line-height-18 margin-bottom-14 font-weight-500'.classNames()}
						>
							{__('Employee ID')}
							<span className={'color-error'.classNames()}>*</span>
						</div>
						<TextField 
							placeholder={__('001')} 
							value={values.employee_id || ''} 
							onChange={(v) => onChange('employee_id', v)}
							regex={regex.employee_id}
							showErrorsAlways={showErrorsAlways}
						/>
					</div>
					<div className={'flex-1'.classNames()}>
						<div
							className={'color-text font-size-15 line-height-18 margin-bottom-14  font-weight-500'.classNames()}
						>
							{__('Experience Level')}
						</div>
						<DropDown
							value={values.experience_level}
							placeholder="Select"
							onChange={(v) => onChange('experience_level', v)}
							options={Object.keys(experience_levels).map((level) => {
								return { 
									id: level, 
									label: experience_levels[level] 
								};
							})}
						/>
					</div>
				</div>
				<div className={'flex-1'.classNames()}>
					<div className={''.classNames()}>
						<div
							className={'color-text font-size-15 line-height-18 margin-top-20 margin-bottom-14  font-weight-500'.classNames()}
						>
							{__('Role/Designation')}
							<span className={'color-error'.classNames()}>*</span>
						</div>
						<TextField
							placeholder={__('ex. Product Designer')}
							value={values.designation || ''}
							onChange={(v) => onChange('designation', v)}
							regex={regex.designation}
							showErrorsAlways={showErrorsAlways}
						/>
					</div>
				</div>
				<div className={'d-flex'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<div
							className={'color-text font-size-15 line-height-18 margin-top-20 margin-bottom-14  font-weight-500'.classNames()}
						>
							{__('Department')}
							<span className={'color-error'.classNames()}>*</span>
						</div>
						<DropDown
							value={values.department_id}
							onChange={v=>onChange('department_id', v)}
							required={true}
							showErrorsAlways={showErrorsAlways}
							options={departments.map(dep=>{
								return {
									id: dep.department_id,
									label: dep.department_name
								}
							})}
						/>
					</div>
				</div>
				<div className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<div
							className={'color-text font-size-15 line-height-18 margin-bottom-20  font-weight-500'.classNames()}
						>
							{__('Workplace')}
						</div>
						<TagField
							theme="button-control"
							behavior="radio"
							value={values.attendance_type}
							onChange={(types) => onChange('attendance_type', types)}
							options={Object.keys(attendance_types).map((a) => {
								return {
									id: a,
									label: attendance_types[a],
								};
							})}
						/>
					</div>
				</div>
			</div>
			<div
				className={
					'margin-top-30 font-size-24 color-text'.classNames() +
					'employeeinfo-form'.classNames(AddEmployeeCss)
				}
			>
				<div className={'flex-1'.classNames()}>
					<div className={'d-flex margin-top-10'.classNames()}>
						<div className={'flex-1 margin-right-20'.classNames()}>
							<div
								className={'color-text font-size-20 line-height-24 font-weight-500 margin-bottom-14'.classNames()}
							>
								{__('Reporting Person')}
							</div>
						</div>
					</div>
					<div className={'d-flex margin-top-20'.classNames()}>
						<div className={'flex-1'.classNames()}>
							<div
								className={'color-text font-size-15 line-height-18 font-weight-500 margin-bottom-14'.classNames()}
							>
								{__('Reporting person name')}
							</div>
							<InstantSearch 
								onAdd={addReportingPerson}
								placeholder={__('ex. John doe')}
								args={{
									source: 'users', 
									role: 'crewhrm-employee', 
									exclude: [user_id]
								}}
							/>
						</div>
					</div>
					{
						!values.reporting_person ? null :
						<div className={'d-flex flex-wrap-wrap column-gap-10 row-gap-10 margin-top-15'.classNames()}>
							<div
								className={
									'd-flex align-items-center column-gap-5 padding-horizontal-10 padding-vertical-5'.classNames() +
									'person-card width-max-content'.classNames(EmployeeIndexCss)
								}
							>
								<img 
									src={values.reporting_person.avatar_url} 
									style={{width: '24px', height: '24px', borderRadius: '50%'}}
								/>
								<span className={'color-text font-size-15 line-height-18 font-weight-500'.classNames()}>
									{values.reporting_person.display_name}
								</span>
								<i
									className={'ch-icon ch-icon-times font-size-15 color-text-lighter cursor-pointer'.classNames()}
									onClick={() => addReportingPerson(null)}
								></i>
							</div>
						</div>
					}
				</div>
			</div>
		</>
	);
}
