import React, { useState } from 'react';
import { Tabs } from '../../../../materials/tabs/tabs.jsx';
import { __ } from '../../../../utilities/helpers.jsx';
import { ContextForm, FormFields } from '../../../../materials/form.jsx';
import { sections_fields } from '../../../hrm/job-editor/application-form/form-structure.jsx';
import { FormActionButtons } from '../../../../materials/form-action.jsx';

import style from './apply.module.scss';

const steps = [
    {
        id: 'personal',
        label: __('Personal Information')
    },
    {
        id: 'documents',
        label: __('Documents')
    },
    {
        id: 'other',
        label: __('Other Information')
    }
];

const getForm=(form, {required, readonly, enabled})=>{
	let _form = [...form];
	let attrs = {required, readonly, enabled};

	// Loop through fields
	for ( let i=0; i < _form.length; i++ ) {

		// Recursive, though there are only two level ideally
		if ( Array.isArray( _form[i] ) ) {
			_form[i] = getForm( _form[i], attrs );
			continue;
		}

		_form[i] = {..._form[i], ...attrs}
	}
	return _form;
}

const fields = {
    personal: [
        ...sections_fields.personal_info.fields
            .map((f) =>getForm(f.form, f))
            .filter((f) => f)
            .flat()
    ],
    documents: [
        ...sections_fields.documents.fields
            .map((f) =>getForm(f.form, f))
            .filter((f) => f)
            .flat()
    ],
    other: [
        ...sections_fields.profile.fields
            .map((f) =>getForm(f.form, f))
            .filter((f) => f)
            .flat(),
        ...sections_fields.questions.fields
            .map((question) => {
                return [
                    {
                        name: question.id,
                        label: question.label,
                        type: question.type,
                        options: question.field_options,
                        enabled: question.enabled,
                        required: question.required
                    },
                    null
                ];
            })
            .filter((q) => q)
            .flat()
    ]
};

export function Apply({ job }) {
    const { job_title='Sampel title', location = 'Sample location' } = job || {};

    const [state, setState] = useState({
        active_tab: 'personal',
        values: {}
    });

    const step_index = steps.findIndex((s) => s.id === state.active_tab);
    const step = steps[step_index];
    const is_segment = true;
    const is_last_tab = step_index >= steps.length - 1;

    const onChange = (name, v) => {
        setState({
            ...state,
            values: {
                ...state.values,
                [name]: v
            }
        });
    };

    const navigateTab = (to) => {
        let index = steps.findIndex((s) => s.id === state.active_tab);

        if (to === -1) {
            if (index > 0) {
                // Navigate to previous tab
                index -= 1;
            } else {
                // Navigate to previous page as the tab is the first one
                window.history.back();
                return;
            }
        }

        if (to === 1) {
            // Navigate to next tab. This function will not be called on last, so check is not necessary.
            index += 1;
        }

        setState({
            ...state,
            active_tab: typeof to === 'string' ? to : steps[index].id
        });
    };

    const submitApplication = () => {
        console.log('Submit now');
    };

    return (
        <div data-crewhrm-selector="job-application" className={'apply'.classNames(style)}>
            <div className={'header'.classNames(style) + 'bg-color-tertiary'.classNames()}>
                <div className={'container'.classNames(style) + 'padding-30'.classNames()}>
                    <span
                        className={'d-block font-size-24 font-weight-600 line-height-24 letter-spacing--24 color-text'.classNames()}
                    >
                        {job_title}
                    </span>
                    <span
                        className={'d-block font-size-17 font-weight-500 line-height-25 color-text margin-bottom-10'.classNames()}
                    >
                        {location}
                    </span>
                </div>
            </div>
            {(is_segment && (
                <div
                    className={
                        'sequence'.classNames(style) +
                        'padding-vertical-20 box-shadow-thin margin-bottom-50'.classNames()
                    }
                >
                    <div>
                        <Tabs
                            active={state.active_tab}
                            tabs={steps}
                            theme="sequence"
                            onNavigate={(tab) => navigateTab(tab)}
                        />
                    </div>
                </div>
            )) ||
                null}

            <div data-crewhrm-selector="job-application-form" className={'form'.classNames(style)}>
                {(is_segment && (
                    <span
                        className={'d-block font-size-20 font-weight-600 color-text margin-bottom-30'.classNames()}
                    >
                        {step.label}
                    </span>
                )) || (
                    <div className={'margin-top-48'.classNames()}>
                        <span
                            className={'d-block font-size-20 font-weight-600 color-text margin-bottom-8'.classNames()}
                        >
                            {__('Apply for this job')}
                        </span>
                        <span
                            className={'d-block font-size-15 font-weight-400 line-height-24 color-text-light margin-bottom-30'.classNames()}
                        >
                            {__('Fields marked with * are required.')}
                        </span>
                    </div>
                )}

                <ContextForm.Provider value={{ values: state.values, onChange }}>
                    <FormFields
                        fields={
                            is_segment
                                ? fields[state.active_tab]
                                : Object.keys(fields)
                                      .map((key) => fields[key])
                                      .flat()
                        }
                    />
                </ContextForm.Provider>

                {(is_segment && (
                    <div>
                        <FormActionButtons
                            onBack={() => navigateTab(-1)}
                            onNext={() => (is_last_tab ? submitApplication() : navigateTab(1))}
                            nextText={
                                is_last_tab ? __('Submit Application') : __('Save & Continue')
                            }
                        />
                    </div>
                )) || (
                    <div>
                        <button
                            className={'button button-primary button-full-width'.classNames()}
                            onClick={submitApplication}
                        >
                            {__('Submit Application')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
