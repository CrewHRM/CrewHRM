import React, { useContext, useState } from 'react';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { FormActionButtons } from 'crewhrm-materials/form-action.jsx';
import { ContextAddEmlpoyeeManually } from './index.jsx';
import AddEmployeeCss from './AddManually.module.scss';
import EmployeeIndexCss from '../index.module.scss';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { ToggleSwitch } from 'crewhrm-materials/toggle-switch/ToggleSwitch.jsx';
import { AddBenefitModal } from './AddBenefitModal.jsx';
import { Options } from 'crewhrm-materials/dropdown/dropdown.jsx';

const options = [
	{
		name: 'edit',
		label: __('Edit'),
		icon: 'ch-icon ch-icon-edit-2',
		for: ['publish', 'draft', 'expired'],
	},
	{
		name: 'share',
		label: __('Share Job'),
		icon: 'ch-icon ch-icon-share',
		for: ['publish'],
	},
	{
		name: 'delete',
		label: __('Delete'),
		icon: 'ch-icon ch-icon-trash',
		for: 'all',
		warning: __('Are you sure to delete permanently?'),
	},
];

export default function EmployeeBenefitForm() {
	const { navigateTab, is_next_disabled } = useContext(ContextAddEmlpoyeeManually);
	const [textValue, setTextValue] = useState('');
	const [isChecked, setIsChecked] = useState(true);
	const [toggle, setToggle] = useState(true);
	const [benefitModal, setBenefitModal] = useState(false);

	const actions = options.map((o) => {
		return {
			id: o.name,
			label: (
				<span className={'d-inline-flex align-items-center column-gap-10'.classNames()}>
					<i className={o.icon.classNames() + 'font-size-24 color-text'.classNames()}></i>

					<span className={'font-size-15 font-weight-500 line-height-25 color-text'.classNames()}>
						{o.label}
					</span>
				</span>
			),
		};
	});

	return (
		<>
			<div className={'employeeinfo-form-wrapper'.classNames(AddEmployeeCss)}>
				<div className={''.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
					<div
						className={'font-size-20 font-weight-500 line-height-24 color-text margin-bottom-25'.classNames()}
					>
						Bonus & Compensation
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
								<ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
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
								<ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
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
						Benefits
					</div>

					<div className={''.classNames() + 'benefit-dropdown-wrapper'.classNames(AddEmployeeCss)}>
						<div className={''.classNames() + 'benefit-dropdown-item'.classNames(AddEmployeeCss)}>
							<div
								className={'padding-15'.classNames() + 'crew-hrm-border'.classNames(EmployeeIndexCss)}
								style={{ backgroundColor: '#F9F9F9' }}
							>
								<div
									className={'d-flex align-items-center justify-content-space-between flex-wrap-wrap row-gap-20 font-size-17 font-weight-500 color-text'.classNames()}
								>
									<div className={'d-flex column-gap-10'.classNames()}>
										<input
											type="checkbox"
											checked={isChecked}
											disabled={false}
											onChange={() => setIsChecked(!isChecked)}
										/>
										<div className={''.classNames()}>
											{__('Health')}
											<span
												className={
													'margin-left-5 color-text-light'.classNames() +
													''.classNames(EmployeeIndexCss)
												}
											>
												{__('(3)')}
											</span>
										</div>
									</div>
									<div className={'d-flex align-items-center'.classNames()}>
										<i
											className={'ch-icon ch-icon-add-circle cursor-pointer font-size-24 color-text-light'.classNames()}
											style={{ color: '#236BFE' }}
										></i>
										<div
											className={'margin-left-5 font-size-13 font-weight-500 line-height-25 color-tex'.classNames()}
										>
											{__('Add Sub-department')}
										</div>
										<div className={'margin-left-15'.classNames()}>
											<Options options={actions}>
												<i
													className={'ch-icon ch-icon-more color-text-light font-size-20 cursor-pointer d-inline-block margin-left-15'.classNames()}
												></i>
											</Options>
										</div>
										<i
											className={'ch-icon ch-icon-arrow-down cursor-pointer font-size-24 color-text-light margin-left-10'.classNames()}
										></i>
									</div>
								</div>
							</div>
							<div
								className={''.classNames() + 'benefit-dropdown-item-wrapper'.classNames(AddEmployeeCss)}
							>
								<div
									className={
										''.classNames() + 'benefit-dropdown-item-child'.classNames(AddEmployeeCss)
									}
								>
									<div
										className={
											'benefit-line'.classNames(AddEmployeeCss) + ''.classNames(EmployeeIndexCss)
										}
									></div>
									<div
										className={
											'padding-15'.classNames() +
											'crew-hrm-border'.classNames(EmployeeIndexCss) +
											'crew-hrm-border benefit-child-content'.classNames(AddEmployeeCss)
										}
										style={{ backgroundColor: '#F9F9F9' }}
									>
										<div
											className={'d-flex align-items-center justify-content-space-between flex-wrap-wrap row-gap-20 font-size-17 font-weight-500 color-text'.classNames()}
										>
											<div className={'d-flex column-gap-10'.classNames()}>
												<input
													type="checkbox"
													checked={isChecked}
													disabled={false}
													onChange={() => setIsChecked(!isChecked)}
												/>
												<div className={''.classNames()}>
													{__('Health')}
													<span
														className={
															'margin-left-5 color-text-light'.classNames() +
															''.classNames(EmployeeIndexCss)
														}
													>
														{__('(3)')}
													</span>
												</div>
											</div>
											<div className={'d-flex align-items-center'.classNames()}>
												<div className={'margin-left-15'.classNames()}>
													<i
														className={'ch-icon ch-icon-more cursor-pointer font-size-24 color-text-light'.classNames()}
													></i>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div
									className={
										''.classNames() + 'benefit-dropdown-item-child'.classNames(AddEmployeeCss)
									}
								>
									<div
										className={
											'benefit-line'.classNames(AddEmployeeCss) + ''.classNames(EmployeeIndexCss)
										}
									></div>
									<div
										className={
											'padding-15'.classNames() +
											'crew-hrm-border'.classNames(EmployeeIndexCss) +
											'crew-hrm-border benefit-child-content'.classNames(AddEmployeeCss)
										}
										style={{ backgroundColor: '#F9F9F9' }}
									>
										<div
											className={'d-flex align-items-center justify-content-space-between flex-wrap-wrap row-gap-20 font-size-17 font-weight-500 color-text'.classNames()}
										>
											<div className={'d-flex column-gap-10'.classNames()}>
												<input
													type="checkbox"
													checked={isChecked}
													disabled={false}
													onChange={() => setIsChecked(!isChecked)}
												/>
												<div className={''.classNames()}>
													{__('Health')}
													<span
														className={
															'margin-left-5 color-text-light'.classNames() +
															''.classNames(EmployeeIndexCss)
														}
													>
														{__('(3)')}
													</span>
												</div>
											</div>
											<div className={'d-flex align-items-center'.classNames()}>
												<div className={'margin-left-15'.classNames()}>
													<i
														className={'ch-icon ch-icon-more cursor-pointer font-size-24 color-text-light'.classNames()}
													></i>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className={''.classNames() + 'benefit-dropdown-wrapper'.classNames(AddEmployeeCss)}>
						<div className={''.classNames() + 'benefit-dropdown-item'.classNames(AddEmployeeCss)}>
							<div
								className={'padding-15'.classNames() + 'crew-hrm-border'.classNames(EmployeeIndexCss)}
								style={{ backgroundColor: '#F9F9F9' }}
							>
								<div
									className={'d-flex align-items-center justify-content-space-between flex-wrap-wrap row-gap-20 font-size-17 font-weight-500 color-text'.classNames()}
								>
									<div className={'d-flex column-gap-10'.classNames()}>
										<input
											type="checkbox"
											checked={isChecked}
											disabled={false}
											onChange={() => setIsChecked(!isChecked)}
										/>
										<div className={''.classNames()}>
											{__('Health')}
											<span
												className={
													'margin-left-5 color-text-light'.classNames() +
													''.classNames(EmployeeIndexCss)
												}
											>
												{__('(3)')}
											</span>
										</div>
									</div>
									<div className={'d-flex align-items-center'.classNames()}>
										<i
											className={'ch-icon ch-icon-add-circle cursor-pointer font-size-24 color-text-light'.classNames()}
											style={{ color: '#236BFE' }}
										></i>
										<div
											className={'margin-left-5 font-size-13 font-weight-500 line-height-25 color-tex'.classNames()}
										>
											{__('Add Sub-department')}
										</div>
										<div className={'margin-left-15'.classNames()}>
											<i
												className={'ch-icon ch-icon-more cursor-pointer font-size-24 color-text-light'.classNames()}
											></i>
										</div>
										<i
											className={'ch-icon ch-icon-arrow-down cursor-pointer font-size-24 color-text-light margin-left-10'.classNames()}
										></i>
									</div>
								</div>
							</div>
							<div
								className={''.classNames() + 'benefit-dropdown-item-wrapper'.classNames(AddEmployeeCss)}
							>
								<div
									className={
										''.classNames() + 'benefit-dropdown-item-child'.classNames(AddEmployeeCss)
									}
								>
									<div
										className={
											'benefit-line'.classNames(AddEmployeeCss) + ''.classNames(EmployeeIndexCss)
										}
									></div>
									<div
										className={
											'padding-15'.classNames() +
											'crew-hrm-border'.classNames(EmployeeIndexCss) +
											'crew-hrm-border benefit-child-content'.classNames(AddEmployeeCss)
										}
										style={{ backgroundColor: '#F9F9F9' }}
									>
										<div
											className={'d-flex align-items-center justify-content-space-between flex-wrap-wrap row-gap-20 font-size-17 font-weight-500 color-text'.classNames()}
										>
											<div className={'d-flex column-gap-10'.classNames()}>
												<input
													type="checkbox"
													checked={isChecked}
													disabled={false}
													onChange={() => setIsChecked(!isChecked)}
												/>
												<div className={''.classNames()}>
													{__('Health')}
													<span
														className={
															'margin-left-5 color-text-light'.classNames() +
															''.classNames(EmployeeIndexCss)
														}
													>
														{__('(3)')}
													</span>
												</div>
											</div>
											<div className={'d-flex align-items-center'.classNames()}>
												<div className={'margin-left-15'.classNames()}>
													<i
														className={'ch-icon ch-icon-more cursor-pointer font-size-24 color-text-light'.classNames()}
													></i>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div
									className={
										''.classNames() + 'benefit-dropdown-item-child'.classNames(AddEmployeeCss)
									}
								>
									<div
										className={
											'benefit-line'.classNames(AddEmployeeCss) + ''.classNames(EmployeeIndexCss)
										}
									></div>
									<div
										className={
											'padding-15'.classNames() +
											'crew-hrm-border'.classNames(EmployeeIndexCss) +
											'crew-hrm-border benefit-child-content'.classNames(AddEmployeeCss)
										}
										style={{ backgroundColor: '#F9F9F9' }}
									>
										<div
											className={'d-flex align-items-center justify-content-space-between flex-wrap-wrap row-gap-20 font-size-17 font-weight-500 color-text'.classNames()}
										>
											<div className={'d-flex column-gap-10'.classNames()}>
												<input
													type="checkbox"
													checked={isChecked}
													disabled={false}
													onChange={() => setIsChecked(!isChecked)}
												/>
												<div className={''.classNames()}>
													{__('Health')}
													<span
														className={
															'margin-left-5 color-text-light'.classNames() +
															''.classNames(EmployeeIndexCss)
														}
													>
														{__('(3)')}
													</span>
												</div>
											</div>
											<div className={'d-flex align-items-center'.classNames()}>
												<div className={'margin-left-15'.classNames()}>
													<i
														className={'ch-icon ch-icon-more cursor-pointer font-size-24 color-text-light'.classNames()}
													></i>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div
						onClick={() => setBenefitModal(!benefitModal)}
						className={'d-flex cursor-pointer align-items-center justify-content-space-between margin-top-20'.classNames()}
						style={{ 'border-radius': '10px', border: '1px solid #236BFE', padding: '10px 15px' }}
					>
						<div className={'flex-1 d-flex align-items-center column-gap-10'.classNames()}>
							<i
								className={'ch-icon ch-icon-add-circle cursor-pointer font-size-30 color-text-light'.classNames()}
								style={{ color: '#236BFE' }}
							></i>
							<span
								className={'font-size-15 font-weight-500 color-text'.classNames()}
								style={{ color: '#236BFE' }}
							>
								{__('Add Benefits')}
							</span>
						</div>
						{benefitModal && (
							<AddBenefitModal
							// onAdd={onAddDepartment}
							// closeModal={closeDepartmentModal}
							/>
						)}
					</div>
				</div>

				<div className={'margin-top-30'.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
					<div
						className={'font-size-20 font-weight-500 line-height-24 color-text margin-bottom-25'.classNames()}
					>
						Leave
					</div>
					<div className={'padding-15'.classNames() + 'crew-hrm-border'.classNames(EmployeeIndexCss)}>
						<div
							className={'d-flex justify-content-space-between font-size-17 font-weight-500 color-text'.classNames()}
						>
							<div className={''.classNames()}>{__('Public Holiday')}</div>
							<ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
						</div>
					</div>
					<div
						className={
							'd-flex align-items-center justify-content-space-between padding-15 margin-top-20'.classNames() +
							'crew-hrm-border'.classNames(EmployeeIndexCss)
						}
					>
						<div className={'flex-1 font-size-17 font-weight-500 color-text'.classNames()}>
							{__('Annual Leave')}
						</div>
						<div className={'flex-1'.classNames()}>
							<TextField
								placeholder={__('ex. . 20')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
						</div>
					</div>
					<div
						className={
							'd-flex align-items-center justify-content-space-between padding-15 margin-top-20'.classNames() +
							'crew-hrm-border'.classNames(EmployeeIndexCss)
						}
					>
						<div className={'flex-1 font-size-17 font-weight-500 color-text'.classNames()}>
							{__('Sick leave')}
						</div>
						<div className={'flex-1'.classNames()}>
							<TextField
								placeholder={__('ex. . 20')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
						</div>
					</div>
					<div
						className={
							'd-flex align-items-center justify-content-space-between padding-15 margin-top-20'.classNames() +
							'crew-hrm-border'.classNames(EmployeeIndexCss)
						}
					>
						<div className={'flex-1 font-size-17 font-weight-500 color-text'.classNames()}>
							{__('Casual leave')}
						</div>
						<div className={'flex-1'.classNames()}>
							<TextField
								placeholder={__('ex. . 20')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
						</div>
					</div>
					<div
						className={
							'd-flex align-items-center justify-content-space-between padding-15 margin-top-20'.classNames() +
							'crew-hrm-border'.classNames(EmployeeIndexCss)
						}
					>
						<div className={'flex-1 font-size-17 font-weight-500 color-text'.classNames()}>
							{__('Religious holidays')}
						</div>
						<div className={'flex-1'.classNames()}>
							<TextField
								placeholder={__('ex. . 20')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
						</div>
					</div>
					<div
						className={
							'd-flex align-items-center justify-content-space-between padding-15 margin-top-20'.classNames() +
							'crew-hrm-border'.classNames(EmployeeIndexCss)
						}
					>
						<div className={'flex-1 font-size-17 font-weight-500 color-text'.classNames()}>
							{__('Parental leave')}
						</div>
						<div className={'flex-1'.classNames()}>
							<TextField
								placeholder={__('ex. . 20')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
						</div>
					</div>
					<div
						onClick={() => setBenefitModal(!benefitModal)}
						className={'d-flex cursor-pointer align-items-center justify-content-space-between padding-vertical-15 padding-horizontal-15 margin-top-20'.classNames()}
						style={{ 'border-radius': '10px', border: '1px solid #236BFE', padding: '10px 15px' }}
					>
						<div className={'flex-1 d-flex align-items-center column-gap-10'.classNames()}>
							<i
								className={'ch-icon ch-icon-add-circle cursor-pointer font-size-30 color-text-light'.classNames()}
								style={{ color: '#236BFE' }}
							></i>
							<span
								className={'font-size-15 font-weight-500 color-text'.classNames()}
								style={{ color: '#236BFE' }}
							>
								{__('Add Leave')}
							</span>
						</div>

						{benefitModal && (
							<AddBenefitModal
							// onAdd={onAddDepartment}
							// closeModal={closeDepartmentModal}
							/>
						)}
					</div>
				</div>

				<div className={'d-flex margin-top-40 margin-bottom-10'.classNames()}>
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
		</>
	);
}
