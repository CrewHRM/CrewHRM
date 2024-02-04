import React, { useState, useContext } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { experience_levels } from 'crewhrm-materials/data.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TagField } from 'crewhrm-materials/tag-field/tag-field.jsx';
import { attendance_types } from 'crewhrm-materials/data.jsx';
import SearchImg from 'crewhrm-materials/static/images/search-normal-add-8.svg';
import Profileimg from 'crewhrm-materials/static/images/addemployee-user-profile-demo.svg';

import {ContextAddEmlpoyeeManually} from './index.jsx';
import AddEmployeeCss from './AddManually.module.scss';
import EmployeeIndexCss from '../index.module.scss';

export default function EmployeeStatusForm() {
	
	const { onChange, values={}, departments=[] } = useContext(ContextAddEmlpoyeeManually);
	const [textValue, setTextValue] = useState('');

	return (
		<>
			<div
				className={'font-size-24 color-text'.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}
			>
				<div className={'font-size-20 font-weight-500 color-text margin-bottom-30'.classNames()}>
					{__('Employment info')}
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
							placeholder={__('005')} 
							value={values.employee_id || ''} 
							onChange={(v) => onChange('employee_id', v)} />
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
							{__('Job Location type')}
						</div>
						<TagField
							theme="button-control"
							behavior="checkbox"
							value={values.attendance_types || []}
							onChange={(types) => onChange('attendance_types', types)}
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
					'margin-top-30 -font-size-24 color-text'.classNames() +
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
							<TextField
								placeholder={__('ex. John doe')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
								image={SearchImg}
								icon_position={'right'}
							/>
						</div>
					</div>
					<div className={'d-flex flex-wrap-wrap column-gap-10 row-gap-10 margin-top-15'.classNames()}>
						<div
							className={
								'd-flex align-items-center column-gap-5 padding-horizontal-10 padding-vertical-5'.classNames() +
								'person-card width-max-content'.classNames(EmployeeIndexCss)
							}
						>
							<img src={Profileimg} alt="" />
							<span className={'color-text font-size-15 line-height-18 font-weight-500'.classNames()}>
								{__('Floyd Miles')}
							</span>
							<i
								className={'ch-icon ch-icon-times font-size-15 color-text-lighter cursor-pointer'.classNames()}
								onClick={() => null}
							></i>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
