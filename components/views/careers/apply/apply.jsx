import React, { useState } from "react";
import { Tabs } from "../../../materials/tabs/tabs.jsx";
import { __, countries_array } from "../../../utilities/helpers.jsx";
import { ContextForm, FormFields } from "../../../materials/form/form.jsx";
import { sections_fields } from "../../hrm/job-editor/application-form/form-structure.jsx";

import style from './apply.module.scss';

const steps = [
	{
		id: 'personal',
		label: __( 'Personal Information' )
	},
	{
		id: 'documents',
		label: __( 'Documents' )
	},
	{
		id: 'other',
		label: __( 'Other Information' )
	}
];

const fields = {
	personal: [
		...sections_fields.personal_info.fields.map(f=>f.form).filter(f=>f).flat()
	],
	documents: [
		...sections_fields.documents.fields.map(f=>f.form).filter(f=>f).flat()
	],
	other: [
		...sections_fields.profile.fields.map(f=>f.form).filter(f=>f).flat(),
		...sections_fields.questions.fields.map(question=>{
			return [{
				name     : question.id,
				label    : question.label,
				type     : question.type,
				options  : question.field_options,
				enabled  : question.enabled,
				required : question.required
			}, null]
		}).filter(q=>q).flat()
	]
}

export function Apply() {
	const [state, setState] = useState({
		active_tab: 'personal',
		values: {}
	});

	const onChange = (name, v) => {
		setState({
			...state,
			values: {
				...state.values,
				[name]: v
			}
		});
	}

	const step = steps.find(s=>s.id===state.active_tab);

	return <div data-crewhrm-selector="job-application" className={'apply'.classNames(style)}>
		<div className={'sequence'.classNames(style) + 'padding-vertical-20 box-shadow-thin margin-bottom-50'.classNames()}>
			<div>
				<Tabs 
					active={state.active_tab} 
					tabs={steps} 
					theme="sequence"
					onNavigate={active_tab=>setState({...state, active_tab})}/>
			</div>
		</div>
		
		<div data-crewhrm-selector="job-application-form" className={'form'.classNames(style)}>
			<span className={'d-block font-size-20 font-weight-600 text-color-primary margin-bottom-30'.classNames()}>
				{step.label}
			</span>

			<ContextForm.Provider value={{values: state.values, onChange}}>
				<FormFields fields={fields[state.active_tab] || []}/>
			</ContextForm.Provider>
		</div>
	</div>
}