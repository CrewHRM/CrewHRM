import React, { useContext } from 'react';
import currenctSymbols from 'currency-symbol-map/map';

import { __, data_pointer } from 'crewhrm-materials/helpers.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { ToggleSwitch } from 'crewhrm-materials/toggle-switch/ToggleSwitch.jsx';
import { BenifitsBuilder } from 'crewhrm-materials/onboarding-modules/benifits-builder/benifits-builder.jsx';
import { LeaveBuilder } from 'crewhrm-materials/onboarding-modules/leave-builder/leave-builder.jsx';

import { ContextAddEmlpoyeeManually } from './index.jsx';
import AddEmployeeCss from './AddManually.module.scss';

export default function EmployeeBenefitForm() {

	const { values={}, onChange } = useContext(ContextAddEmlpoyeeManually);
	const {salary_currency='USD'} = values;
	const currency_symbol = currenctSymbols[salary_currency];

	return (
		<>
			<div className={'employeeinfo-form-wrapper'.classNames(AddEmployeeCss)}>
				<div className={'employeeinfo-form'.classNames(AddEmployeeCss)}>
					<div
						className={'font-size-20 font-weight-500 line-height-24 color-text margin-bottom-25'.classNames()}
					>
						{__('Bonus & Compensation')}
					</div>
					<div className={'padding-15'.classNames() + 'border'.classNames(AddEmployeeCss)}>
						<div className={'d-flex justify-content-space-between'.classNames()}>
							<div>
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
									checked={values.enable_signing_bonus ? true : false} 
									onChange={(checked) => onChange('enable_signing_bonus', checked)} />
							</div>
						</div>
						{
							!values.enable_signing_bonus ? null :
							<div className={'margin-top-20'.classNames()}>
								<div
									className={'d-flex font-size-17 font-weight-500 color-text margin-bottom-10'.classNames()}
								>
									{__('Signing bonus amount')}
								</div>
								<TextField 
									value={`${currency_symbol} ${values.signing_bonus_amount || ''}`} 
									onChange={(v) => onChange('signing_bonus_amount', (v || '').replace(/\D/g, ''))} />
							</div>
						}
					</div>
					<div
						className={
							'padding-15 margin-top-20'.classNames() + 'border'.classNames(AddEmployeeCss)
						}
					>
						<div className={'d-flex justify-content-space-between'.classNames()}>
							<div>
								<div className={'font-size-17 font-weight-500 color-text margin-bottom-5'.classNames()}>
									{__('Offer other bonuses?')}
								</div>
								<div
									className={'color-text-light font-size-13 line-height-15 font-weight-500'.classNames()}
								>
									{__('Do you want to include other bonus?')}
								</div>
							</div>
							<div className={'d-flex align-items-center justify-content-end column-gap-5'.classNames()}>
								<ToggleSwitch 
									checked={values.enable_other_bonus ? true : false} 
									onChange={(checked) => onChange('enable_other_bonus', checked )} />
							</div>
						</div>
						{
							!values.enable_other_bonus ? null :
							<div className={'margin-top-20'.classNames()}>
								<div
									className={'d-flex font-size-17 font-weight-500 color-text margin-bottom-10'.classNames()}
								>
									{__('Other bonus amount')}
								</div>
								<TextField 
									value={`${currency_symbol} ${values.other_bonus_amount || ''}`} 
									onChange={(v) => onChange('other_bonus_amount', (v || '').replace(/\D/g, ''))} />
							</div>
						}
					</div>
					<div
						className={
							'padding-15 margin-top-20'.classNames() + 'border'.classNames(AddEmployeeCss)
						}
					>
						<div className={'d-flex justify-content-space-between'.classNames()}>
							<div>
								<div className={'font-size-17 font-weight-500 color-text margin-bottom-5'.classNames()}>
									{__('Offer equity compensation?')}
								</div>
								<div
									className={'color-text-light font-size-13 line-height-15 font-weight-500'.classNames()}
								>
									{__('Do you want to offer equity compensation?')}
								</div>
							</div>
							<div className={'d-flex align-items-center justify-content-end column-gap-5'.classNames()}>
								<ToggleSwitch 
									checked={values.offer_equity_compensation ? true : false} 
									onChange={(c) => onChange('offer_equity_compensation', c)} />
							</div>
						</div>
						{
							!values.offer_equity_compensation ? null :
							<div className={'margin-top-20'.classNames()}>
								<div
									className={'d-flex font-size-17 font-weight-500 color-text margin-bottom-10'.classNames()}
								>
									{__('Equity compensation amount')}
								</div>
								<TextField 
									value={`${currency_symbol} ${values.equity_compensation_amount || ''}`} 
									onChange={(v) => onChange('equity_compensation_amount', (v || '').replace(/\D/g, ''))} />
							</div>
						}
					</div>
				</div>

				<div className={'margin-top-30'.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
					<div
						className={'font-size-20 font-weight-500 line-height-24 color-text margin-bottom-15'.classNames()}
					>
						{__('Benefits')} <a 
							target='_blank' 
							href={window[data_pointer].permalinks.settings_employee} 
							className={'ch-icon ch-icon-settings-gear font-size-14'.classNames()}
						/>
					</div>

					<span className={'d-block margin-bottom-20 font-size-14 color-text-light'.classNames()}>
						{__('The benefits policy from global settings will apply automatically. You can review the global settings by clicking the gear icon above. If you want to offer custom benefits, please check the box below. Additional options will appear.')}
					</span>

					<label className={'d-flex align-items-center column-gap-10 cursor-pointer'.classNames()}>
						<input 
							type='checkbox' 
							onChange={e=>onChange('use_custom_benefits', e.currentTarget.checked)}
							checked={values.use_custom_benefits ? true : false}
						/> {__('Add custom benefits')}
					</label>

					{
						!values.use_custom_benefits ? null :
						<BenifitsBuilder 
							benefits={values.employee_benefits || {}} 
							onChange={v=>onChange('employee_benefits', v)}/>
					}
				</div>

				<div className={'margin-top-30'.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
					<div
						className={'font-size-20 font-weight-500 line-height-24 color-text margin-bottom-15'.classNames()}
					>
						{__('Leave')} <a 
							target='_blank' 
							href={window[data_pointer].permalinks.settings_employee} 
							className={'ch-icon ch-icon-settings-gear font-size-14'.classNames()}
						/>
					</div>

					<span className={'d-block margin-bottom-20 font-size-14 color-text-light'.classNames()}>
						{__('The leaves policy from global settings will apply automatically. You can review the global settings by clicking the gear icon above. If you want to offer custom leaves, please check the box below. Additional options will appear.')}
					</span>

					<label className={'d-flex align-items-center column-gap-10 cursor-pointer'.classNames()}>
						<input 
							type='checkbox' 
							onChange={e=>onChange('use_custom_leaves', e.currentTarget.checked)}
							checked={values.use_custom_leaves ? true : false}
						/> {__('Add custom leaves')}
					</label>
					
					{
						!values.use_custom_leaves ? null :
						<LeaveBuilder
							leaves={values.employee_leaves || {}}
							onChange={leaves=>onChange('employee_leaves', leaves)}/>
					}
				</div>
			</div>
		</>
	);
}
