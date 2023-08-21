import React, { useContext } from "react";
import { ContextJobDetails } from "../job-details.jsx";

import { __ } from "../../../../../../../utilities/helpers.jsx";
import style from '../details.module.scss';
import { NumberField } from "../../../../../../../materials/number-field/number-field.jsx";
import { DateField } from "../../../../../../../materials/date-time/date-time.jsx";

const employments_types = {
	full_type : __( 'Full Time' ),
	part_time : __( 'Part Time' ),
	contract  : __( 'Contract' ),
	temporary : __( 'Temporary' ),
	trainee   : __( 'Trainee' )
}

export function EmploymentDetails(props) {
	const {
		input_class, 
		section_title_class, 
		field_label_class,
		values,
		setVal} = useContext(ContextJobDetails);

	return <>
		{/* Employment details */}
		<div className={'d-flex margin-bottom-30'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<span className={section_title_class}>
					{__( 'Employment details' )}
				</span>
			</div>
		</div>

		{/* Employment type, vacancy and deadline */}
		<span className={field_label_class}>
			{__( 'Choose employment type' )}
		</span>
		<div className={'d-flex'.classNames()}>
			<div className={'flex-1'.classNames()}>
				{/* Employment type */}
				<div className={'d-flex margin-bottom-30'.classNames() + 'type-selection'.classNames(style)}>
					{Object.keys(employments_types).map(type=>{
						const is_selected = values.employment_type===type;
						return <div key={type} className={'flex-1'.classNames()}>
							<button className={`button button-primary ${is_selected ? '' : 'button-outlined'} w-full`.classNames() + `${is_selected ? 'selected' : ''}`.classNames(style)} onClick={()=>setVal('employment_type', type)}>
								{employments_types[type]}
							</button>
						</div>
					})}
				</div>

				{/* Vacancy and Deadline */}
				<div className={'d-flex'.classNames()}>
					<div className={'margin-right-20'.classNames()} style={{width: '130px'}}>
						<span className={field_label_class + 'white-space-nowrap'.classNames()}>
							{__( 'Number of Vacancy' )}
						</span>
						<NumberField 
							min={1}
							className={input_class}
							value={values.vacancy}
							onChange={v=>setVal('vacancy', v)}/>
					</div>
					<div className={'flex-1'.classNames()}>
						<span className={field_label_class}>
							{__( 'Submission Deadline' )}
						</span>
						<DateField 
							className={input_class}
							onChange={v=>{}}/>
					</div>
				</div>
			</div>
			<div className={'right-col'.classNames(style)}>
				<span className={'font-size-13 font-weight-400 text-color-light'.classNames()}>
					{__( 'Include as many details as possible to boost the job’s performance on some job boards' )}
				</span>
			</div>
		</div>
	</>
}