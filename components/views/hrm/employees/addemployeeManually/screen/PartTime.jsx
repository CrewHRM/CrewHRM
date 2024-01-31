import React, { useState } from 'react';
import { __ } from 'crewhrm-materials/helpers.jsx';
import EmployeeIndexCss from '../../index.module.scss';
import { DateField } from 'crewhrm-materials/date-time.jsx';
import { RadioCheckbox } from 'crewhrm-materials/radio-checkbox.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field';

export default function PartTime() {
	const [isChecked, setIsChecked] = useState(true);
	const [textValue, setTextValue] = useState('');

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
				<input type="checkbox" checked={isChecked} disabled={true} onChange={() => setIsChecked(!isChecked)} />
				<span className={'color-text font-size-15 font-weight-500 line-height-24 margin-left-10'.classNames()}>
					{__('Add Custom Working hour')}
				</span>
			</div>
			<div className={'d-flex align-items-center margin-top-30'.classNames()}>
				<input type="checkbox" checked={isChecked} disabled={false} onChange={() => setIsChecked(!isChecked)} />
				<span className={'color-text font-size-15 font-weight-500 line-height-24 margin-left-10'.classNames()}>
					{__('(The employee is in a provisional period)')}
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
