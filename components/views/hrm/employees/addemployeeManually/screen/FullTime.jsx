import React, { useState } from 'react';
import { __ } from 'crewhrm-materials/helpers.jsx';
import EmployeeIndexCss from '../../index.module.scss';
import { DateField } from 'crewhrm-materials/date-time.jsx';
import { RadioCheckbox } from 'crewhrm-materials/radio-checkbox.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field';
import { ToggleSwitch } from 'crewhrm-materials/toggle-switch/ToggleSwitch.jsx';
import PlusImg from 'crewhrm-materials/static/images/plus-ash.svg';
import TrashImg from 'crewhrm-materials/static/images/trash-01.svg';

export default function FullTime() {
	const [isChecked, setIsChecked] = useState(true);
	const [textValue, setTextValue] = useState('');
	const [toggle, setToggle] = useState(false);

	return (
		<>
			<div className={'d-flex margin-top-30'.classNames()}>
				<div className={'flex-1'.classNames()}>
					<div
						className={'color-text font-size-15 line-height-18 font-weight-500 margin-bottom-14'.classNames()}
					>
						{__('Working hours per week')}
						<span className={'color-error'.classNames()}>*</span>
					</div>
					<TextField placeholder={__('ex. 30 hr')} value={textValue} onChange={(v) => setTextValue(v)} />
				</div>
			</div>
			<div className={'d-flex align-items-center margin-top-30'.classNames()}>
				<input type="checkbox" checked={isChecked} disabled={false} onChange={() => setIsChecked(!isChecked)} />
				<span className={'color-text font-size-15 font-weight-500 line-height-24 margin-left-10'.classNames()}>
					{__('Add Custom Working Hour')}
				</span>
			</div>

			<div
				className={
					'margin-top-10'.classNames() +
					'custom-work-schedule-wrapper crew-hrm-border'.classNames(EmployeeIndexCss)
				}
			>
				<div
					className={
						'd-flex justify-content-space-between'.classNames() +
						'custom-work-schedule'.classNames(EmployeeIndexCss)
					}
				>
					<div className={'d-flex'.classNames() + 'custom-work-schedule-day'.classNames(EmployeeIndexCss)}>
						<ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
						<span
							className={'color-text font-size-15 font-weight-400 line-height-24 margin-left-10'.classNames()}
						>
							Sunday
						</span>
					</div>
					<div
						className={
							'd-flex flex-direction-column align-items-center row-gap-15'.classNames() +
							'custom-work-schedule-time-wrapper'.classNames(EmployeeIndexCss)
						}
					>
						<span className={'color-text-light font-size-17 font-weight-400 line-height-24'.classNames()}>
							Off Day
						</span>
					</div>
					<div className={'addshedule'.classNames(EmployeeIndexCss) + 'cursor-pointer'.classNames()}>
						<img src={PlusImg} alt="addicon" />
					</div>
				</div>
				<div
					className={
						'd-flex justify-content-space-between'.classNames() +
						'custom-work-schedule'.classNames(EmployeeIndexCss)
					}
				>
					<div className={'d-flex'.classNames() + 'custom-work-schedule-day'.classNames(EmployeeIndexCss)}>
						<ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
						<span
							className={'color-text font-size-15 font-weight-500 line-height-24 margin-left-10'.classNames()}
						>
							Sunday
						</span>
					</div>
					<div
						className={
							'd-flex flex-direction-column align-items-center row-gap-15'.classNames() +
							'custom-work-schedule-time-wrapper'.classNames(EmployeeIndexCss)
						}
					>
						<div
							className={
								'd-flex align-items-center column-gap-15'.classNames() +
								'custom-work-schedule-time'.classNames(EmployeeIndexCss)
							}
						>
							<TextField
								placeholder={__('ex. 30 hr')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
							<span className={'line'.classNames(EmployeeIndexCss)}></span>
							<TextField
								placeholder={__('ex. 30 hr')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
							<img className={'cursor-pointer'.classNames()} src={TrashImg} alt="" />
						</div>
					</div>
					<div className={'addshedule'.classNames(EmployeeIndexCss) + 'cursor-pointer'.classNames()}>
						<img src={PlusImg} alt="addicon" />
					</div>
				</div>

				<div
					className={
						'd-flex justify-content-space-between '.classNames() +
						'custom-work-schedule'.classNames(EmployeeIndexCss)
					}
				>
					<div className={'d-flex'.classNames() + 'custom-work-schedule-day'.classNames(EmployeeIndexCss)}>
						<ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
						<span
							className={'color-text font-size-15 font-weight-500 line-height-24 margin-left-10'.classNames()}
						>
							Sunday
						</span>
					</div>
					<div
						className={
							'd-flex flex-direction-column align-items-center row-gap-10'.classNames() +
							'custom-work-schedule-time-wrapper'.classNames(EmployeeIndexCss)
						}
					>
						<div
							className={
								'd-flex align-items-center column-gap-15'.classNames() +
								'custom-work-schedule-time'.classNames(EmployeeIndexCss)
							}
						>
							<TextField
								placeholder={__('ex. 30 hr')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
							<span className={'line'.classNames(EmployeeIndexCss)}></span>
							<TextField
								placeholder={__('ex. 30 hr')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
							<img className={'cursor-pointer'.classNames()} src={TrashImg} alt="" />
						</div>
						<div
							className={
								'd-flex align-items-center column-gap-15'.classNames() +
								'custom-work-schedule-time'.classNames(EmployeeIndexCss)
							}
						>
							<TextField
								placeholder={__('ex. 30 hr')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
							<span className={'line'.classNames(EmployeeIndexCss)}></span>
							<TextField
								placeholder={__('ex. 30 hr')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
							<img className={'cursor-pointer'.classNames()} src={TrashImg} alt="" />
						</div>
					</div>
					<div className={'addshedule'.classNames(EmployeeIndexCss) + 'cursor-pointer'.classNames()}>
						<img src={PlusImg} alt="addicon" />
					</div>
				</div>
			</div>

			<div className={'d-flex align-items-center margin-top-30'.classNames()}>
				<input type="checkbox" checked={isChecked} disabled={false} onChange={() => setIsChecked(!isChecked)} />
				<span className={'color-text font-size-15 font-weight-500 line-height-24 margin-left-10'.classNames()}>
					{__('The employee is in a provisional period')}
				</span>
			</div>

			<div className={'d-flex margin-top-30'.classNames()}>
				<div className={'probation-date'.classNames(EmployeeIndexCss)}>
					<div
						className={'color-text font-size-15 font-weight-500 line-height-18 margin-bottom-14'.classNames()}
					>
						{__('Probation end date')}
						<span className={'margin-left-5 color-text-light'.classNames()}>{__('(optional)')}</span>
					</div>
					<DateField value={''} />
					<RadioCheckbox type={'checkbox'} name={'name'} value={'sd'} />
				</div>
			</div>
		</>
	);
}
