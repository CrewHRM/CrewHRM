import React from "react";

import { __ } from "../../../../../../utilities/helpers.jsx";

import style from './details.module.scss';
import { DropDown } from "../../../../../../materials/dropdown/dropdown.jsx";

const employments_types = {
	full_type : __( 'Full Time' ),
	part_time : __( 'Part Time' ),
	contract  : __( 'Contract' ),
	temporary : __( 'Temporary' ),
	trainee   : __( 'Trainee' )
}

const salary_types = {
	hourly  : __( 'Hourly' ),
	daily   : __( 'Daily' ),
	weekly  : __( 'Weekly' ),
	monthly : __( 'Monthly' ),
	yearly  : __( 'Yearly' )
}

export function JobDetails(props) {
	const setVal=(name, value)=>{

	}

	return <div className={'job-details'.classNames(style)}>

		{/* Form intro */}
		<div className={'d-flex margin-bottom-30'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<span className={'font-size-20 font-weight-600 text-color-primary text-color-primary'.classNames()}>
					{__( 'Title & Description' )}
				</span>
			</div>
			<div className={'right-col'.classNames(style)}>
				<i className={'ch-icon ch-icon-lamp-charge font-size-20 text-color-primary margin-right-4 vertical-align-middle'.classNames()}>

				</i> <span className={'font-size-13 font-weight-400 text-color-primary'.classNames()}>
					{__( 'Tips' )}
				</span>
			</div>
		</div>

		{/* Job Title */}
		<div className={'d-flex margin-bottom-30'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<div className={'d-flex margin-bottom-10'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<span className={'font-size-15 font-weight-500 text-color-primary'.classNames()}>
							{__( 'Job Title' )}<span className={"text-color-danger".classNames()}>*</span>
						</span>
					</div>
					<div>
						<span className={'font-size-13 font-weight-500 line-height-21 text-color-secondary'.classNames()}>
							200
						</span>
					</div>
				</div>
				<div>
					<input type="text" placeholder={__( 'ex. Product designer, Account manager' )} className={'plain-text-input'.classNames(style)}/>
				</div>
			</div>
			<div className={'right-col'.classNames(style)}>
				<span className={'font-size-13 font-weight-400 text-color-secondary'.classNames()}>
					{__( 'Use common job titles for searchability' )}
				</span>
			</div>
		</div>
		
		{/* Department and internal job code */}
		<div className={'d-flex margin-bottom-30'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<div className={'d-flex'.classNames()}>
					<div className={'flex-1 margin-right-10'.classNames()}>
						<span className={'d-block font-size-15 font-weight-500 text-color-primary margin-bottom-10'.classNames()}>
							{__( 'Department' )}<span className={"text-color-danger".classNames()}>*</span>
						</span>
						<DropDown
							value='sales'
							options={[{value: 'sales', label: 'Sales'}, {value: 'research', label: 'Research'}]}
							onChage={v=>setVal('department', v)}
							className={'plain-text-input'.classNames(style)}
							textClassName={'font-size-17 font-weight-500 line-height-25 text-color-secondary'.classNames()}/>
					</div>
					<div className={'flex-1 margin-left-10'.classNames()}>
						<span className={'d-block font-size-15 font-weight-500 text-color-primary margin-bottom-10'.classNames()}>
							{__( 'Internal Job code' )}
						</span>
						<input type="text" placeholder={__( 'ex. 001' )} className={'plain-text-input'.classNames(style)}/>
					</div>
				</div>
			</div>
			<div className={'right-col'.classNames(style)}>
				
			</div>
		</div>


		{/* Job Description* */}
		<span className={'d-block font-size-15 font-weight-500 text-color-primary margin-bottom-10'.classNames()}>
			{__( 'Job Description' )}<span className={"text-color-danger".classNames()}>*</span>
		</span>
		<div className={'d-flex margin-bottom-30'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<textarea 
					className={'plain-text-input'.classNames(style)} 
					placeholder={__( 'Enter your job description here; include key areas responsibility and specific qualification needed to perform the role. ' )}
				></textarea>
			</div>
			<div className={'right-col'.classNames(style)}>
				<span className={'d-block font-size-13 font-weight-400 text-color-secondary margin-bottom-36'.classNames()}>
					{__( 'Format into sections and lists to improve readability' )}
				</span>
				<span className={'font-size-13 font-weight-400 text-color-secondary'.classNames()}>
					{__( 'Avoid targeting specific demographics e.g. gender, nationality and age' )}
				</span>
			</div>
		</div>




		{/* Employment details */}
		<div className={'d-flex margin-bottom-30'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<span className={'font-size-20 font-weight-600 text-color-primary text-color-primary'.classNames()}>
					{__( 'Employment details' )}
				</span>
			</div>
		</div>

		{/* Employment type */}
		<span className={'d-block font-size-15 font-weight-500 text-color-primary margin-bottom-10'.classNames()}>
			{__( 'Choose employment type' )}
		</span>
		<div className={'d-flex margin-bottom-30'.classNames()}>
			<div className={'flex-1'.classNames() + 'type-selection'.classNames(style)}>
				{Object.keys(employments_types).map(type=>{
					return <div>
						<button key={type} className={'button button-primary button-outlined'.classNames()}>
							{employments_types[type]}
						</button>
					</div>
				})}
			</div>
			<div className={'right-col'.classNames(style)}>
				<span className={'font-size-13 font-weight-400 text-color-secondary'.classNames()}>
					{__( 'Include as many details as possible to boost the job’s performance on some job boards' )}
				</span>
			</div>
		</div>

		<div className={'d-flex'.classNames()}>
			<div className={'flex-1'.classNames()}></div>
			<div className={'right-col'.classNames(style)}></div>
		</div>
	</div>
}