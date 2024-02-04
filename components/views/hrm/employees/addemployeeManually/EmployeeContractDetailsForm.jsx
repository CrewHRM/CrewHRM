import React, { useContext, useState } from 'react';
import currenctSymbols from 'currency-symbol-map/map';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { employment_types } from 'crewhrm-materials/data.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TagField } from 'crewhrm-materials/tag-field/tag-field.jsx';

import Contract from './screen/Contract.jsx';
import PartTime from './screen/PartTime.jsx';
import Temporary from './screen/Temporary.jsx';
import Trainee from './screen/Trainee.jsx';
import FullTime from './screen/FullTime.jsx';
import { ContextAddEmlpoyeeManually } from './index.jsx';
import AddEmployeeCss from './AddManually.module.scss';

export default function EmployeeContractDetailsForm() {

	const { onChange, values={} } = useContext(ContextAddEmlpoyeeManually);
	const {salary_currency='USD'} = values;
	
	return (
		<>
			<div className={'employeeinfo-form-wrapper'.classNames(AddEmployeeCss)}>
				<div className={'color-text'.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
					<div className={'font-size-20 font-weight-500 color-text margin-bottom-30'.classNames()}>
						{__('Contract details')}
					</div>
					<div className={'d-flex margin-top-20'.classNames()}>
						<div className={'flex-1 margin-right-10'.classNames()}>
							<div
								className={'color-text font-size-15 line-height-18 font-weight-500 margin-bottom-14'.classNames()}
							>
								{__('Currency')}
							</div>
							<DropDown
								value={salary_currency}
								placeholder="Select"
								onChange={(v) => onChange('salary_currency', v)}
								options={Object.keys(currenctSymbols).map((s) => {
									return {
										id: s, 
										label: s
									};
								})}
							/>
						</div>
						<div className={'flex-1'.classNames()}>
							<div
								className={'color-text font-size-15 line-height-18 font-weight-500 margin-bottom-14'.classNames()}
							>
								{__('Annual Gross salary')}
							</div>
							<TextField 
								placeholder={`${currenctSymbols[salary_currency]} 0.00`} 
								value={`${currenctSymbols[salary_currency]} ${values.annual_gross_salary || ''}`} 
								onChange={(v) => onChange('annual_gross_salary', (v || '').replace(/\D/g, ''))} />
						</div>
					</div>
					<div className={'d-flex'.classNames()}>
						<div className={'flex-1'.classNames()}>
							<div
								className={'color-text font-size-15 line-height-18 font-weight-500 margin-top-20 margin-bottom-14'.classNames()}
							>
								{__('Employment Type')}
								<span className={'color-error'.classNames()}>*</span>
							</div>
							<TagField
								value={values.employment_type}
								behavior="radio"
								theme="button"
								options={Object.keys(employment_types).map((a) => {
									return {
										id: a,
										label: employment_types[a],
									};
								})}
								onChange={(v) => onChange('employment_type', v)}
								fullWidth={true}
								className={'margin-bottom-30'.classNames()}
							/>
							{values.employment_type == 'full_time' && <FullTime />}
							{values.employment_type == 'part_time' && <PartTime />}
							{values.employment_type == 'contract' && <Contract />}
							{values.employment_type == 'temporary' && <Temporary />}
							{values.employment_type == 'trainee' && <Trainee />}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
