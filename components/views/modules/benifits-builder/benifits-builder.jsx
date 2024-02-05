import React, {useState} from "react";

import { __, getRandomString } from 'crewhrm-materials/helpers.jsx';
import { Options } from 'crewhrm-materials/dropdown/dropdown.jsx';

import { AddBenefitModal } from './AddBenefitModal.jsx';
import AddEmployeeCss from './builder.module.scss';

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

export function BenifitsBuilder(props) {

	const {
		benefits={}, 
		onChange
	} = props;

	const [benefitModalFor, setBenefitModal] = useState(null);

	const addBenefit=(benefit)=>{
		const {benefits={}} = props;
		
		if ( benefitModalFor ) {
			benefits[benefitModalFor].children[getRandomString()] = benefit;
		} else {
			benefits[getRandomString()] = {
				...benefit,
				children: {}
			}
		}

		onChange(benefits);

		setBenefitModal(null);
	}

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

	const isChecked = true;

	return <>
		{
			benefitModalFor===null ? null : 
				<AddBenefitModal 
					onAdd={addBenefit} 
					onClose={()=>setBenefitModal(null)}/>
		}
		
		{
			Object.keys(benefits).map(id=>{
				
				const {label, description, children={}} = benefits[id];
				const child_ids = Object.keys(children);

				return <div key={id} className={'benefit-dropdown-wrapper'.classNames(AddEmployeeCss)}>
					<div className={'benefit-dropdown-item'.classNames(AddEmployeeCss)}>
						<div
							className={'padding-15'.classNames() + 'benifit-borders'.classNames(AddEmployeeCss)}
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
										{label}
										<span
											className={
												'margin-left-5 color-text-light'.classNames()
											}
										>
											{child_ids.length ? <>({__(child_ids.length)})</> : null} 
										</span>
									</div>
								</div>
								<div className={'d-flex align-items-center'.classNames()}>
									<div 
										className={'d-flex align-items-center cursor-pointer'.classNames()}
										onClick={()=>setBenefitModal(id)}
									>
										<i
											className={'ch-icon ch-icon-add-circle cursor-pointer font-size-24 color-text-light'.classNames()}
											style={{ color: '#236BFE' }}
										></i>
										<div
											className={'margin-left-5 font-size-13 font-weight-500 line-height-25 color-text'.classNames()}
										>
											{__('Add Sub-department')}
										</div>
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
						{
							!child_ids.length ? null :
							<div
								className={'benefit-dropdown-item-wrapper'.classNames(AddEmployeeCss)}
							>
								{
									child_ids.map(child_id=>{
										const {label, description} = children[child_id];
										
										return <div
											key={child_id}
											className={
												'benefit-dropdown-item-child'.classNames(AddEmployeeCss)
											}
										>
											<div
												className={
													'benefit-line'.classNames(AddEmployeeCss)
												}
											></div>
											<div
												className={
													'padding-15'.classNames() +
													'benifit-borders benefit-child-content'.classNames(AddEmployeeCss)
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
															{label}
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
									})
								}
							</div>
						}
					</div>
				</div>
			})
		}
		
		<div
			className={'d-flex cursor-pointer align-items-center justify-content-space-between margin-top-20'.classNames()}
			style={{ borderRadius: '10px', border: '1px solid #236BFE', padding: '10px 15px' }}
		>
			<div 
				className={'flex-1 d-inline-flex align-items-center column-gap-10'.classNames()}
				onClick={()=>setBenefitModal(0)}
			>
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
		</div>
	</>
}