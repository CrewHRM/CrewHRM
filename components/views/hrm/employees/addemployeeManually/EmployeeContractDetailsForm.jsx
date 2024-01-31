import React, { useContext, useState } from 'react';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { FormActionButtons } from 'crewhrm-materials/form-action.jsx';
import { ContextAddEmlpoyeeManually } from './AddEmployeeManually.jsx';
import { employment_types } from 'crewhrm-materials/data.jsx';
import AddEmployeeCss from './AddManually.module.scss';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TagField } from 'crewhrm-materials/tag-field/tag-field.jsx';

import Contract from './screen/Contract.jsx';
import PartTime from './screen/PartTime.jsx';
import Temporary from './screen/Temporary.jsx';
import Trainee from './screen/Trainee.jsx';
import FullTime from './screen/FullTime.jsx';

export default function EmployeeContractDetailsForm() {
	const { navigateTab, is_next_disabled } = useContext(ContextAddEmlpoyeeManually);
	const [departments] = useState(['Canadian Dollar (CAD)', 'Design', 'Business']);
	const [selectedDept, setSelectedDept] = useState('');
	const [textValue, setTextValue] = useState('');

	const [activeEmploymentTypes, setActiveEmploymentTypes] = useState('full_time');

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
								value={selectedDept}
								placeholder="Select"
								onChange={(v) => {
									setSelectedDept(v);
								}}
								options={departments.map((email) => {
									return { id: email, label: email };
								})}
							/>
						</div>
						<div className={'flex-1'.classNames()}>
							<div
								className={'color-text font-size-15 line-height-18 font-weight-500 margin-bottom-14'.classNames()}
							>
								{__('Annual Gross salary')}
							</div>
							<TextField placeholder={__('$ 0.00')} value={textValue} onChange={(v) => setTextValue(v)} />
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
							<TextField
								placeholder={__('ex. Product Designer')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
						</div>
					</div>
					<div className={'d-flex'.classNames()}>
						<div className={'flex-1 margin-top-20'.classNames()}>
							<TagField
								value={activeEmploymentTypes}
								behavior="radio"
								theme="button"
								options={Object.keys(employment_types).map((a) => {
									return {
										id: a,
										label: employment_types[a],
									};
								})}
								onChange={(type) => {
									setActiveEmploymentTypes(type);
								}}
								fullWidth={true}
								className={'margin-bottom-30'.classNames()}
							/>
							{activeEmploymentTypes == 'full_time' && <FullTime />}
							{activeEmploymentTypes == 'part_time' && <PartTime />}
							{activeEmploymentTypes == 'contract' && <Contract />}
							{activeEmploymentTypes == 'temporary' && <Temporary />}
							{activeEmploymentTypes == 'trainee' && <Trainee />}
						</div>
					</div>
					<div className={'d-flex margin-top-40'.classNames()}>
						<div className={'flex-1'.classNames()}>
							<FormActionButtons
								onBack={() => navigateTab(-1)}
								onNext={() => navigateTab(1)}
								disabledNext={is_next_disabled}
								nextText={'Save & Continue'}
							/>
						</div>
						<div className={'right-col'.classNames()}></div>
					</div>
				</div>
			</div>
		</>
	);
}
