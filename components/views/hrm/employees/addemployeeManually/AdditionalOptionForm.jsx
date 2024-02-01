import React, { useContext, useState } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { FormActionButtons } from 'crewhrm-materials/form-action.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import SearchImg from 'crewhrm-materials/static/images/search-normal-add-8.svg';

import { ContextAddEmlpoyeeManually } from './AddEmployeeManually.jsx';

import AddEmployeeCss from './AddManually.module.scss';
import EmployeeIndexCss from '../index.module.scss';

export default function AdditionalOptionForm() {
	const { navigateTab } = useContext(ContextAddEmlpoyeeManually);
	const [textValue, setTextValue] = useState('');

	return (
		<>
			<div className={'employeeinfo-form-wrapper'.classNames(AddEmployeeCss)}>
				<div className={''.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
					<div className={'d-flex'.classNames()}>
						<div className={'flex-1'.classNames()}>
							<div className={'color-text font-size-20 line-height-24 font-weight-500'.classNames()}>
								{__('Document')}
							</div>
						</div>
						<div
							className={'flex-1 d-flex align-items-center justify-content-end column-gap-5'.classNames()}
						>
							<i
								className={'ch-icon ch-icon-folder-add font-size-20 color-text cursor-pointer'.classNames()}
								onClick={() => null}
								style={{ color: '#236BFE' }}
							></i>
							<div
								className={'color-primary font-size-15 line-height-18 font-weight-500'.classNames()}
								style={{ color: '#236BFE' }}
							>
								{__('Upload')}
							</div>
						</div>
					</div>
					<div className={'d-flex margin-top-15'.classNames()}>
						<div className={'flex-1'.classNames()}>
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
								'd-flex align-items-center column-gap-10 padding-horizontal-10 padding-vertical-5'.classNames() +
								'person-card width-max-content'.classNames(EmployeeIndexCss)
							}
						>
							<span className={'color-text font-size-15 line-height-18 font-weight-500'.classNames()}>
								{__('Advanced Training Course.pdf')}
							</span>
							<i
								className={'ch-icon ch-icon-times font-size-15 color-text cursor-pointer'.classNames()}
								onClick={() => null}
							></i>
						</div>
						<div
							className={
								'd-flex align-items-center column-gap-10 padding-horizontal-10 padding-vertical-5'.classNames() +
								'person-card width-max-content'.classNames(EmployeeIndexCss)
							}
						>
							<span className={'color-text font-size-15 line-height-18 font-weight-500'.classNames()}>
								{__('Hands-On Python & R In Data Science')}
							</span>
							<i
								className={'ch-icon ch-icon-times font-size-15 color-text cursor-pointer'.classNames()}
								onClick={() => null}
							></i>
						</div>
					</div>
				</div>

				<div className={'margin-top-30'.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
					<div className={'d-flex'.classNames()}>
						<div className={'flex-1'.classNames()}>
							<div className={'color-text font-size-20 line-height-24 font-weight-500'.classNames()}>
								{__('Training')}
							</div>
						</div>
						<div
							className={'flex-1 d-flex align-items-center justify-content-end column-gap-5'.classNames()}
						>
							<i
								className={'ch-icon ch-icon-folder-add font-size-20 color-text cursor-pointer'.classNames()}
								onClick={() => null}
								style={{ color: '#236BFE' }}
							></i>
							<div
								className={'color-primary font-size-15 line-height-18 font-weight-500'.classNames()}
								style={{ color: '#236BFE' }}
							>
								{__('Upload')}
							</div>
						</div>
					</div>
					<div className={'d-flex margin-top-15'.classNames()}>
						<div className={'flex-1'.classNames()}>
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
								'd-flex align-items-center column-gap-10 padding-horizontal-10 padding-vertical-5'.classNames() +
								'person-card width-max-content'.classNames(EmployeeIndexCss)
							}
						>
							<span className={'color-text font-size-15 line-height-18 font-weight-500'.classNames()}>
								{__('Advanced Training Course.pdf')}
							</span>
							<i
								className={'ch-icon ch-icon-times font-size-15 color-text cursor-pointer'.classNames()}
								onClick={() => null}
							></i>
						</div>
						<div
							className={
								'd-flex align-items-center column-gap-10 padding-horizontal-10 padding-vertical-5'.classNames() +
								'person-card width-max-content'.classNames(EmployeeIndexCss)
							}
						>
							<span className={'color-text font-size-15 line-height-18 font-weight-500'.classNames()}>
								{__('Hands-On Python & R In Data Science')}
							</span>
							<i
								className={'ch-icon ch-icon-times font-size-15 color-text cursor-pointer'.classNames()}
								onClick={() => null}
							></i>
						</div>
					</div>
				</div>

				<div className={'d-flex column-gap-30 margin-top-40'.classNames()}>
					<FormActionButtons
						onBack={() => navigateTab(-1)}
						onNext={() => navigateTab(1)}
						disabledNext={false}
						nextText={'Save & Continue'}
					/>
				</div>
			</div>
		</>
	);
}
