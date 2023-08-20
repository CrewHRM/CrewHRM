import React, { useState } from "react";

import style from './application.module.scss';
import { __, getRandomString } from "../../../../../../utilities/helpers.jsx";
import { ToggleSwitch } from "../../../../../../materials/toggle-switch/ToggleSwitch.jsx";
import { ActionButtons } from "../index.jsx";
import { Options } from "../../../../../../materials/dropdown/dropdown.jsx";
import { FieldEditorModal } from "./field-editor/field-editor-modal.jsx";

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
	},
	questions: {
		label    : __( 'Add Questions' ),
		sortable : true,
		addLabel : __( 'Add a question' ),
		options  : {
			edit: {
				label: __( 'Edit' ),
				icon: 'ch-icon ch-icon-edit-2'
			},
			duplicate: {
				label: __( 'Duplicate' ),
				icon: 'ch-icon ch-icon-copy'
			},
			delete: {
				label: __( 'Delete' ),
				icon: 'ch-icon ch-icon-trash'
			}
		},
		fields: []
	}
}

export function ApplicationForm(props) {
	const {navigateTab} = props;
	const [state, setState] = useState({
		fields: sections_fields,
		pointer: null
	});

	const onOptionClick=(action, section_name, field_id)=>{
		let   {pointer} = state;
		const {fields} = state;
		const field_index = fields[section_name].fields.findIndex(f=>f.id==field_id);
		const field = fields[section_name].fields[field_index];

		switch (action) {
			case 'delete' :
				fields[section_name].fields.splice(field_index, 1);
				break;

			case 'duplicate' :
				fields[section_name].fields.splice(field_index, 0, {...field, id: getRandomString()});
				break;

			case 'edit' : 
				pointer = {
					section_name,
					field_index
				}
		}

		setState({
			...state,
			fields,
			pointer
		});
	}

	const updateField=(updated_field)=>{
		// Just close the modal (without storing anything in state) if no field provided
		if (updated_field===null) {
			setState({
				...state,
				pointer: null
			});
			return;
		}

		// Get pointer
		const {pointer={}, fields={}} = state;
		const {section_name, field_index} = pointer;

		// Update data in the array
		if (isNaN(field_index)) {
			// This block means it's new, so assign an ID and then push to state
			fields[section_name].fields.push({
				...updated_field, 
				enabled: true,
				id: getRandomString()
			})
		} else {
			// It's update request
			fields[section_name].fields[field_index] = updated_field;
		}
		
		// Update state 
		setState({
			...state, 
			fields,
			pointer: null
		});
	}

	const onToggle=(key, value, section_name, field_id)=>{
		// Find field
		const {fields} = state;
		const index = fields[section_name].fields.findIndex(f=>f.id===field_id);

		// Update field
		fields[section_name].fields[index][key] = value;
		setState({
			...state,
			fields
		});
	}

	return <>
		
		{state.pointer && 
			<FieldEditorModal 
				field={state.fields[state.pointer.section_name].fields[state.pointer.field_index] || {}} 
				updateField={updateField}/> || null}

		<div className={'application'.classNames(style)}>
			<span className={'d-block font-size-20 font-weight-600 text-color-primary margin-bottom-40'.classNames()}>
				{__( 'Customize your application form' )}
			</span>

			{/* General fields with toggle switch */}
			{Object.keys(state.fields).map(section_name=>{
				const {label, fields: input_fields, options={}, addLabel} = sections_fields[section_name];

				const options_array = Object.keys(options).map(option_name=>{
						return {
							id    : option_name, 
							label : options[option_name].label, 
							icon  : options[option_name].icon.classNames() + 'font-size-24 text-color-primary'.classNames()
						}
					}
				);

				return <div key={section_name} className={'section-container'.classNames(style)}>
					<strong className={'d-block font-size-17 font-weight-600 text-color-primary margin-bottom-10'.classNames()}>
						{label}
					</strong>

					{input_fields.length && <div className={'list-container'.classNames(style)}>
						{input_fields.map(field=>{
							const {label: field_label, enabled, required, read_only, id: field_id} = field;
							const checkbox_id   = 'crewhrm-checkbox-'+field_id;

							return <div key={field_id} className={'single-row'.classNames(style) + 'd-flex align-items-center'.classNames()}>
								<div>
									<input 
										id={checkbox_id}
										type="checkbox" 
										checked={enabled || read_only} 
										disabled={read_only}
										onChange={e=>onToggle('enabled', e.currentTarget.checked, section_name, field_id)}/>
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
										<div className={'d-inline-flex align-items-center column-gap-10'.classNames()}>
											<span className={'d-inline-block font-size-15 font-weight-400 text-color-light'.classNames()}>
												{__( 'Required' )}
											</span>
											
											<ToggleSwitch 
												checked={required} 
												onChange={required=>onToggle('required', required, section_name, field_id)}/>

											{options_array.length && <Options options={options_array} onClick={action=>onOptionClick(action, section_name, field_id)}>
												<i className={'ch-icon ch-icon-more font-size-20 text-color-light'.classNames()}></i>
											</Options> || null}
										</div>
									}
								</div>
							</div>
						})}
					</div> || null}
					
					{addLabel && <div className={`d-flex align-items-center column-gap-10 padding-vertical-10 padding-horizontal-15 border-1 border-radius-10 border-color-secondary cursor-pointer ${input_fields.length ? 'margin-top-10' : ''}`.classNames()} onClick={()=>setState({...state, pointer:{section_name}})}>
						<i className={'ch-icon ch-icon-add-circle font-size-24 text-color-secondary'.classNames()}></i>
						<span className={'font-size-15 font-weight-500 text-color-secondary'.classNames()}>
							{addLabel}
						</span>
					</div>}
				</div>
			})}

			<ActionButtons onBack={()=>navigateTab(-1)} onNext={()=>navigateTab(1)}/>
		</div>
	</>
}