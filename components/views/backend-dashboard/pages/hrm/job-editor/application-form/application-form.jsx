import React, { useState } from "react";

import style from './application.module.scss';
import { __, getRandomString } from "../../../../../../utilities/helpers.jsx";
import { ToggleSwitch } from "../../../../../../materials/toggle-switch/ToggleSwitch.jsx";
import { ActionButtons } from "../index.jsx";

const sections_fields = {
	personal_info: {
		label: __( 'Personal information' ),
		fields: [
			{
				id        : 'name',
				label     :  __( 'Name' ),
				read_only : true
			},
			{
				id        : 'address',
				label     :  __( 'Address' ),
				read_only : true
			},
			{
				id        : 'mobile_number',
				label     :  __( 'Mobile Number' ),
				read_only : true
			},
			{
				id        : 'email',
				label     :  __( 'Email' ),
				read_only : true
			}
		]
	},
	documents: {
		label: __( 'Documents' ),
		fields: [
			{
				id        : 'resume',
				label     :  __( 'Resume' ),
				read_only : true
			},
			{
				id        : 'cover_letter',
				label     :  __( 'Cover Letter' ),
			},
			{
				id        : 'file_attachment',
				label     :  __( 'File Attachment' ),
			}
		]
	},
	profile: {
		label: __( 'Profile' ),
		fields: [
			{
				id        : 'date_of_birth',
				label     :  __( 'Date of Birth' ),
			},
			{
				id        : 'gender',
				label     :  __( 'Gender' ),
			},
			{
				id        : 'education',
				label     :  __( 'Education' ),
			},
			{
				id        : 'experience',
				label     :  __( 'Experience' ),
			},
			{
				id        : 'nationality',
				label     :  __( 'Nationality' ),
			},
			{
				id        : 'martial_status',
				label     :  __( 'Martial Status' ),
			},
			{
				id        : 'hobbies',
				label     :  __( 'Hobbies' ),
			},
			{
				id        : 'driving_license',
				label     :  __( 'Driving License' ),
			},
			{
				id        : 'social_link',
				label     :  __( 'Social Link' ),
			}
		]
	},
	other_information: {
		label: __( 'Other Information' ),
		fields: [
			{
				id        : 'us_eeo',
				label     :  __( 'U.S. Equal Employment Opportunity' ),
			},
			{
				id        : 'veteran_status',
				label     :  __( 'Veteran Status' ),
			},
			{
				id        : 'i_o_d',
				label     :  __( 'Identification of Disability' ),
			}
		]
	}
}

const question_types = {
	paragraph: {
		label      : __( 'Paragraph' ),
		input_type : 'textarea'
	},
	date: {
		label      : __( 'Date' ),
		input_type : 'date', 
	},
	number: {
		label      : __( 'Number' ),
		input_type : 'number' 
	},
	file: {
		label      : __( 'File Upload' ),
		input_type : 'file'
	},
	yes_no: {
		label      : __( 'Yes or No' ),
		input_type : 'yes_no'
	}
}

const questions = [
	{
		id        : getRandomString(),
		type      : 'paragraph',
		question  : 'There are lots of steps within product design, such as research, prototyping, visual design, technical implementation.',
		mandatory : true,
		checked   : false
	}
];

export function ApplicationForm(props) {
	const {navigateTab} = props;
	const [state, setState] = useState({
		questions: questions
	});

	return <div className={'application'.classNames(style)}>
		<span className={'d-block font-size-20 font-weight-600 text-color-primary margin-bottom-40'.classNames()}>
			{__( 'Customize your application form' )}
		</span>

		{/* General fields with toggle switch */}
		{Object.keys(sections_fields).map(field_name=>{
			const {label, fields: input_fields} = sections_fields[field_name];

			return <div key={field_name} className={'section-container'.classNames(style)}>
				<strong className={'d-block font-size-17 font-weight-600 text-color-primary margin-bottom-10'.classNames()}>
					{label}
				</strong>

				<div className={'list-container'.classNames(style)}>
					{input_fields.map(field=>{
						const {label: field_label, checked, read_only, id: field_id} = field;
						const checkbox_id = 'crewhrm-checkbox-'+field_id;

						return <div key={field_id} className={'single-row'.classNames(style) + 'd-flex align-items-center'.classNames()}>
							<div>
								<input 
									id={checkbox_id}
									className={'checkbox-secondary'.classNames()}
									type="checkbox" 
									checked={checked || read_only} 
									disabled={read_only}/>
							</div>
							<div className={'flex-1'.classNames()}>
								<label className={'d-block font-size-15 font-weight-500 line-height-25 text-color-primary margin-left-10'.classNames()} htmlFor={checkbox_id}>
									{field_label}
								</label>
							</div>
							<div>
								{
									read_only && <span className={'required'.classNames(style) + 'font-size-13 font-weight-500 padding-vertical-8 padding-horizontal-15 border-radius-50'.classNames()}>
										{__( 'Required' )}
									</span> ||
									<div className={'d-inline-flex align-items-center'.classNames()}>
										<span className={'d-inline-block margin-right-8 font-size-15 font-weight-400 text-color-light'.classNames()}>{__( 'Mandatory' )}</span>
										<ToggleSwitch/>
									</div>
								}
							</div>
						</div>
					})}
				</div>
			</div>
		})}

		<ActionButtons onBack={()=>navigateTab(-1)} onNext={()=>navigateTab(1)}/>
	</div>
}