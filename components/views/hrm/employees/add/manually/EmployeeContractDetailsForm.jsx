import React, { useContext } from 'react';
import currenctSymbols from 'currency-symbol-map/map';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { employment_types } from 'crewhrm-materials/data.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { DateField } from 'crewhrm-materials/date-time.jsx';
import { TagField } from 'crewhrm-materials/tag-field/tag-field.jsx';

import { WeeklyScheduleEditor } from 'crewhrm-materials/onboarding-modules/weekly-schedule-editor/weekly-schedule-editor.jsx';
import { ContextAddEmlpoyeeManually } from './index.jsx';

import AddEmployeeCss from './AddManually.module.scss';

export default function EmployeeContractDetailsForm() {

	const { onChange, values={}, showErrorsAlways, regex={} } = useContext(ContextAddEmlpoyeeManually);
	const {salary_currency='USD'} = values;
	const use_custom_weekly_schedule = values.use_custom_weekly_schedule ? true : false;
	const is_provisional = values.is_provisional ? true : false;
	
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
								value={`${currenctSymbols[salary_currency] || ''} ${values.annual_gross_salary || ''}`} 
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
								showErrorsAlways={showErrorsAlways}
								required={true}
							/>

							{
								['full_time', 'part_time'].indexOf(values.employment_type)===-1 ? null :
								<div className={'d-flex margin-top-30'.classNames()}>
									<div className={'flex-1'.classNames()}>
										<div
											className={'color-text font-size-15 line-height-18 font-weight-500 margin-bottom-14'.classNames()}
										>
											{__('Working hours per week')}
											<span className={'color-error'.classNames()}>*</span>
										</div>
										<TextField 
											placeholder={__('ex. 30')} 
											value={values.weekly_working_hour || ''} 
											onChange={(v) => onChange('weekly_working_hour', (v || '').replace(/\D/g, ''))}
											showErrorsAlways={showErrorsAlways}
											regex={regex.weekly_working_hour}
										/>
									</div>
								</div>
							}

							{
								['contract', 'temporary', 'trainee'].indexOf(values.employment_type)===-1 ? null :
								<div className={'d-flex margin-top-30'.classNames()}>
									<div className={'flex-1 margin-right-10'.classNames()}>
										<div
											className={'color-text font-size-15 line-height-18 font-weight-500 margin-bottom-14'.classNames()}
										>
											{__('Start date')}
										</div>
										<DateField 
											value={values.start_date} 
											onChange={v=>onChange('start_date', v)}/>
									</div>
									<div className={'flex-1'.classNames()}>
										<div
											className={'color-text font-size-15 line-height-18 font-weight-500 margin-bottom-14'.classNames()}
										>
											{__('End date')}
										</div>
										<DateField 
											value={values.end_date} 
											onChange={v=>onChange('end_date', v)}/>
									</div>
								</div>
							}

							<div className={'d-flex align-items-center margin-top-30'.classNames()}>
								<label className={'d-block'.classNames()}>
									<input 
										type="checkbox" 
										checked={use_custom_weekly_schedule} 
										onChange={() => onChange('use_custom_weekly_schedule', !use_custom_weekly_schedule)} />
									<span className={'color-text font-size-15 font-weight-500 line-height-24 margin-left-10'.classNames()}>
										{__('Add Custom Working Hour')}
									</span>
								</label>
							</div>

							{
								!use_custom_weekly_schedule ? null : 
								<WeeklyScheduleEditor 
									value={values.weekly_schedules || {}} 
									onChange={value=>onChange('weekly_schedules', value)}/>
							}
							
							<div className={'d-flex align-items-center margin-top-30'.classNames()}>
								<label>
									<input 
										type="checkbox" 
										checked={is_provisional} 
										onChange={() => onChange('is_provisional', !is_provisional)}
									/>
									<span className={'color-text font-size-15 font-weight-500 line-height-24 margin-left-10'.classNames()}>
										{__('The employee is in a provisional period')}
									</span>
								</label>
							</div>

							{
								!is_provisional ? null :
								<div className={'d-flex margin-top-30'.classNames()}>
									<div style={{width: '300px'}}>
										<div
											className={'color-text font-size-15 font-weight-500 line-height-18 margin-bottom-14'.classNames()}
										>
											{__('Probation end date')}
											<span className={'margin-left-5 color-text-light'.classNames()}>{__('(optional)')}</span>
										</div>
										<DateField 
											value={values.probation_end_date} 
											onChange={date=>onChange('probation_end_date', date)}/>
									</div>
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
