import React, { useContext, useState } from 'react';
import { Tabs } from '../../../../materials/tabs/tabs.jsx';
import { __, calculateJSONSizeInKB, countries_object, isEmpty, sprintf } from '../../../../utilities/helpers.jsx';
import { ContextForm, FormFields } from '../../../../materials/form.jsx';
import { FormActionButtons } from '../../../../materials/form-action.jsx';
import { request } from '../../../../utilities/request.jsx';
import { ContextToast } from '../../../../materials/toast/toast.jsx';

import style from './apply.module.scss';
import { Applied } from './applied.jsx';

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

export function Apply({ job = {} }) {
    const { job_id, job_title, street_address, country_code, application_form: fields = {} } = job;

    const [state, setState] = useState({
        active_tab: 'personal',
        submitted: false,
        error_message: null,
        values: {
            job_id
        }
    });

    const { addToast } = useContext(ContextToast);

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
		const payload = { application: state.values };

		const {application_max_size} = window.CrewHRM;
		const payload_size = calculateJSONSizeInKB( payload ) + 5;

		if ( payload_size >= application_max_size ) {
			addToast({
				message: sprintf( __('Total file size exceeds the limit of %s.'), application_max_size+' KB'),
				status: 'error'
			});
			return;
		}

        request('apply_to_job', payload, (resp) => {
            const {
                success,
                data: { notice, message }
            } = resp;

            // If failed to submit application
            if (!success) {
                // Either notice or message is supposed to be in the response if the success is false.
                if (notice || !message) {
                    // Minor notice that can be fixed
                    addToast({
                        message: notice || __('Submission failed. Something went wrong!'),
                        status: 'error'
                    });
                } else {
                    // Final notice that can't be fixed
                    setState({
                        ...state,
                        submitted: true,
                        error_message: message
                    });
                }
            } else {
                // This block means submitted successfully
                setState({
                    ...state,
                    submitted: true
                });
            }
        });
    };

    const isNextEnabled = (fields) => {
        let _enabled = true;

        // Loop through fields
        for (let i = 0; i < fields.length; i++) {

            // If it is already false, break the loop, no more check necessary
            if (!_enabled) {
                break;
            }

            // If it is array, use recursion
            if (Array.isArray(fields[i])) {
                _enabled = isNextEnabled(fields[i]);
                continue;
            }

            // Skip null that is used for line break
            if (!fields[i] || !fields[i].name) {
                continue;
            }

            const { name, required } = fields[i];
            const value = state.values[name];

            if (required && isEmpty(value)) {
                _enabled = false;
            }
        }

        return _enabled;
    };

    let fields_to_render = is_segment
        ? fields[state.active_tab]
        : Object.keys(fields)
              .map((key) => fields[key])
              .flat();
    let is_next_enabled = isNextEnabled(fields_to_render);

    return state.submitted ? (
        <Applied error_message={state.error_message} />
    ) : (
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
                        {street_address}, {countries_object[country_code]}
                    </span>
                </div>
            </div>

            {is_segment ? (
                <div
                    className={
                        'sequence'.classNames(style) +
                        'padding-vertical-20 box-shadow-thin margin-bottom-50'.classNames()
                    }
                >
                    <div>
                        <Tabs active={state.active_tab} tabs={steps} theme="sequence" />
                    </div>
                </div>
            ) : null}

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
                    <FormFields defaultEnabled={false} fields={fields_to_render} />
                </ContextForm.Provider>

                {(is_segment && (
                    <div>
                        <FormActionButtons
                            disabledNext={!is_next_enabled}
                            title={
                                !is_next_enabled
                                    ? __('Please fill all the required fields first')
                                    : null
                            }
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
                            disabled={!is_next_enabled}
                            title={
                                !is_next_enabled
                                    ? __('Please fill all the required fields to submit')
                                    : null
                            }
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
