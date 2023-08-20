import React, { useContext, useEffect, useState } from "react";
import { ContextModal, Modal } from "../../../../../../../materials/modal/modal.jsx";
import { __, getRandomString } from "../../../../../../../utilities/helpers.jsx";
import { DropDown } from "../../../../../../../materials/dropdown/dropdown.jsx";
import { ToggleSwitch } from "../../../../../../../materials/toggle-switch/ToggleSwitch.jsx";
import { Line } from "../../../../../../../materials/line/line.jsx";

import style from './field.module.scss';

const question_types = {
	paragraph       : __( 'Paragraph' ),
	date            : __( 'Date' ),
	short_answer    : __( 'Short Answer' ),
	file_upload     : __( 'File Upload' ),
	multiple_choice : __( 'Multiple Choice' ),
	single_choice   : __( 'Single Choice' ),
	dropdown        : __( 'Dropdown' ),
}

const option_able = ['multiple_choice', 'single_choice', 'dropdown'];

function Editor(props) {
	const {close} = useContext(ContextModal);
	
	const [state, setState] = useState({
		last_id: null,
		exclude_focus: (props.field?.field_options || []).map(f=>f.id),
		field: props.field || {}
	});

	const {type: field_type, field_options=[], id: field_id} = state.field;
	
	const addOption=()=>{
		const id = getRandomString();
		setState({...state, last_id: id});

		onChange(
			'field_options',
			[
				...field_options, 
				{
					id,
					label : __( 'Untitled' )
				}
			]
		);
	}

	const updateOptionLabel=(id, value)=>{
		const index = field_options.findIndex(f=>f.id===id);
		field_options[index].label = value;
		onChange('field_options', field_options);
	}

	const onChange=(name, value)=>{
		setState({
			...state,
			field: {
				...state.field,
				[name]: value
			}
		});
	}

	useEffect(()=>{
		const {last_id, exclude_focus} = state;
		if ( !last_id || exclude_focus.indexOf( last_id )>-1 ) {
			return;
		}

		const input = document.getElementById('crewhrm-field-option-'+last_id);
		
		if (input) {
			input.focus();
			input.select();

			setState({
				...state, 
				exclude_focus:[
					...exclude_focus, 
					last_id
				]
			});
		}

	}, [field_options]);

	return <div className={'editor'.classNames(style) + 'background-color-white border-radius-10 padding-25'.classNames()}>
		<div className={'d-flex align-items-center margin-bottom-30'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<span className={'font-size-24 font-weight-600 text-color-primary'.classNames()}>
					{__( 'Add a question' )}
				</span>
			</div>
			<div>
				<i className={'ch-icon ch-icon-more font-size-24 text-color-light cursor-pointer'.classNames()} onClick={close}></i>
			</div>
		</div>

		<div className={'d-flex align-items-center margin-bottom-15'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<DropDown 
					nested={true}
					value={field_type}
					options={Object.keys(question_types).map(t=>{return {value: t, label: question_types[t]}})}
					onChange={value=>onChange('type', value)}/>
			</div>
			<div className={'d-flex align-items-center column-gap-8'.classNames()}>
				<span className={'font-size-15 font-weight-400 text-color-light'.classNames()}>
					{__( 'Required' )}
				</span>
				<ToggleSwitch checked={state.field.required} onChange={required=>onChange('required', required)}/>
			</div>
		</div>
		
		<Line className={'margin-bottom-15'.classNames()}/>

		<div className={'margin-bottom-15'.classNames()}>
			<span className={'d-block font-size-15 font-weight-500 text-color-primary margin-bottom-10'.classNames()}>
				{__( 'Question' )}
			</span>
			<input 
				value={state.field.label}
				className={'d-block padding-15 border-1-5 border-color-tertiary border-focus-color-primary border-radius-10 font-size-15 font-weight-400 line-height-25 text-color-primary w-full'.classNames()}
				placeholder={__( 'ex. How did you hear about this job?' )}
				onChange={e=>onChange('label', e.currentTarget.value)}/>
		</div>

		{option_able.indexOf(field_type)>-1 && <div className={'margin-bottom-15'.classNames()}>
			<span className={'d-block font-size-15 font-weight-500 text-color-primary margin-bottom-10'.classNames()}>
				{__( 'Options' )}
			</span>

			<div className={'border-1-5 border-color-tertiary border-radius-10'.classNames()}>
				{field_options.map(option=>{
					let {id, label} = option;
					return <div key={id} className={'padding-vertical-10 padding-horizontal-15 border-bottom-1-5 border-color-tertiary'.classNames()}>
						<input 
							id={"crewhrm-field-option-"+id}
							type="text" 
							value={label} 
							className={'text-field-flat font-size-15 font-weight-500 line-height-25'.classNames()}
							onChange={e=>updateOptionLabel(id, e.currentTarget.value)}/>
					</div>
				})}
				
				<div className={'padding-vertical-10 padding-horizontal-10'.classNames()}>
					<span className={'d-inline-flex align-items-center column-gap-10 cursor-pointer'.classNames()} onClick={addOption}>
						<i className={'ch-icon ch-icon-add-square font-size-18 text-color-secondary'.classNames()}></i>
						<span className={'font-size-15 font-weight-500 line-height-25 text-color-light text-color-hover-secondary'.classNames()}>
							{__( 'Add Option' )}
						</span>
					</span>
				</div>
			</div>
		</div> || null}

		<div className={"d-flex align-items-center justify-content-end column-gap-21".classNames()} onClick={()=>props.updateField(null)}>
			<span className={'font-size-15 font-weight-500 letter-spacing--3 text-color-light cursor-pointer'.classNames()}>
				{__( 'Cancel' )}
			</span>
			<button className={'button button-primary'.classNames()} disabled={!state.field.type || !state.field.label} onClick={()=>props.updateField(state.field)}>
				{field_id ? __( 'Update Question' ) : __( 'Add Question' )}
			</button>
		</div>
	</div>
}

export function FieldEditorModal({field, updateField}) {
	return <Modal closeOnDocumentClick={false} nested={true}>
		<Editor 
			field={field} 
			updateField={updateField}/>
	</Modal>
}