import React, { useContext, useState } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { ToggleSwitch } from 'crewhrm-materials/toggle-switch/ToggleSwitch.jsx';

import { ContextAddEmlpoyeeManually } from './index.jsx';
import { BenifitsBuilder } from '../../../modules/benifits-builder/benifits-builder.jsx';

import AddEmployeeCss from './AddManually.module.scss';
import EmployeeIndexCss from '../index.module.scss';
import { LeaveBuilder } from '../../../modules/leave-builder/leave-builder.jsx';

export default function EmployeeBenefitForm() {
	const { values={}, onChange } = useContext(ContextAddEmlpoyeeManually);
	const [textValue, setTextValue] = useState('');
	const [toggle, setToggle] = useState(true);

	return (
		<>
			<div className={'employeeinfo-form-wrapper'.classNames(AddEmployeeCss)}>
				<div className={''.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
					<div
						className={'font-size-20 font-weight-500 line-height-24 color-text margin-bottom-25'.classNames()}
					>
						{__('Bonus & Compensation')}
					</div>
					<div className={'padding-15'.classNames() + 'crew-hrm-border'.classNames(EmployeeIndexCss)}>
						<div className={'d-flex justify-content-space-between'.classNames()}>
							<div className={''.classNames()}>
								<div className={'font-size-17 font-weight-500 color-text margin-bottom-5'.classNames()}>
									{__('Signning Bonus')}
								</div>
								<div
									className={'color-text-light font-size-13 line-height-15 font-weight-500'.classNames()}
								>
									{__('Do you want to include one-time signing bonus?')}
								</div>
							</div>
							<div className={'d-flex align-items-center justify-content-end column-gap-5'.classNames()}>
								<ToggleSwitch 
									checked={toggle} 
									onChange={() => setToggle(!toggle)} />
							</div>
						</div>
						<div className={'margin-top-20'.classNames()}>
							<div
								className={'d-flex font-size-17 font-weight-500 color-text margin-bottom-10'.classNames()}
							>
								{__('Signing bonus amount')}
							</div>
							<TextField placeholder={__('$ 0.00')} value={textValue} onChange={(v) => setTextValue(v)} />
						</div>
					</div>
					<div
						className={
							'padding-15 margin-top-20'.classNames() + 'crew-hrm-border'.classNames(EmployeeIndexCss)
						}
					>
						<div className={'d-flex justify-content-space-between'.classNames()}>
							<div className={''.classNames()}>
								<div className={'font-size-17 font-weight-500 color-text margin-bottom-5'.classNames()}>
									{__('Offer other bonuses?')}
								</div>
								<div
									className={'color-text-light font-size-13 line-height-15 font-weight-500'.classNames()}
								>
									{__('Do you want to include one-time signing bonus?')}
								</div>
							</div>
							<div className={'d-flex align-items-center justify-content-end column-gap-5'.classNames()}>
								<ToggleSwitch 
									checked={toggle} 
									onChange={() => setToggle(!toggle)} />
							</div>
						</div>
					</div>
					<div
						className={
							'padding-15 margin-top-20'.classNames() + 'crew-hrm-border'.classNames(EmployeeIndexCss)
						}
					>
						<div className={'d-flex justify-content-space-between'.classNames()}>
							<div className={''.classNames()}>
								<div className={'font-size-17 font-weight-500 color-text margin-bottom-5'.classNames()}>
									{__('Offer equity compensation?')}
								</div>
								<div
									className={'color-text-light font-size-13 line-height-15 font-weight-500'.classNames()}
								>
									{__('Do you want to include one-time signing bonus?')}
								</div>
							</div>
							<div className={'d-flex align-items-center justify-content-end column-gap-5'.classNames()}>
								<ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
							</div>
						</div>
					</div>
				</div>

				<div className={'margin-top-30'.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
					<div
						className={'font-size-20 font-weight-500 line-height-24 color-text margin-bottom-25'.classNames()}
					>
						{__('Benefits')}
					</div>

					<BenifitsBuilder 
						benefits={values.employee_benefits || {}} 
						onChange={v=>onChange('employee_benefits', v)}/>
				</div>

				<div className={'margin-top-30'.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
					<div
						className={'font-size-20 font-weight-500 line-height-24 color-text margin-bottom-25'.classNames()}
					>
						{__('Leave')}
					</div>
					<LeaveBuilder
						leaves={values.employee_leaves || {}}
						onChange={leaves=>onChange('employee_leaves', leaves)}/>
				</div>
			</div>
		</>
	);
}
