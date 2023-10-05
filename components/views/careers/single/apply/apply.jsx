import React, { useContext, useState } from 'react';

import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';
import { RenderField } from './apply-form.jsx';
import { FormActionButtons } from 'crewhrm-materials/form-action.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import { Applied } from './applied.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import {
    __,
    calculateJSONSizeInKB,
    getAddress,
    isEmpty,
    patterns,
    sprintf
} from 'crewhrm-materials/helpers.jsx';

import style from './apply.module.scss';


export function Apply({ job = {} }) {

    const { 
		job_id, 
		job_title, 
		application_form: fields = {} 
	} = job;

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
	].filter(step=>!isEmpty(fields[step.id]?.filter(f=>f.enabled)));

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

        const { application_max_size_mb } = window.CrewHRM;
        const payload_size = (calculateJSONSizeInKB(payload) + 5)/1024; // In MB.

        if (payload_size >= application_max_size_mb) {
            addToast({
                message: sprintf(
                    __('Total file size exceeds the limit of %s.'),
                    application_max_size_mb + ' MB'
                ),
                status: 'error'
            });
            return;
        }

        request('applyToJob', payload, (resp) => {
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

    const isNextEnabled = (fields=[]) => {
        let _enabled = true;

		// Handle address field exceptionally as the singular fields are not defined in the object dorectly in favour of reusing AddressFields component.
		const _address_index = fields.findIndex(f=>f.name==='address');
		if ( _address_index>-1 ) {
			const {required} = fields[_address_index];
			fields.splice(_address_index, 1);
			
			fields.push({name: 'street_address', required});
			fields.push({name: 'city', required});
			fields.push({name: 'province', required});
			fields.push({name: 'zip_code', required});
			fields.push({name: 'country_code', required});
		}

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

            const { name, required } = fields[i];
            const value = state.values[name];
			const is_empty = isEmpty(value);

			// Determine how to validate
			let validate_pattern;
			for ( let key in patterns ) {
				if ( name.indexOf(key)>-1 ) {
					validate_pattern = patterns[key];
					break;
				}
			}

            if (required && is_empty ) {
                _enabled = false;
            }

			// No need format check if it optional one is empty
			if ( is_empty || ! validate_pattern ) {
				continue;
			}

			if ( ! validate_pattern.test( value.replace(/\s+/g, ' ').trim() ) ) {
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
    let is_next_enabled = isNextEnabled([...fields_to_render]);

    if (state.submitted) {
        return <Applied error_message={state.error_message} />;
    }

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
                        {getAddress(job)}
                    </span>
                </div>
            </div>

            <Conditional show={is_segment}>
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
							scrollIntoViewOnChange={true}/>
                    </div>
                </div>
            </Conditional>

            <div data-crewhrm-selector="job-application-form" className={'form'.classNames(style)}>
                <Conditional show={is_segment}>
                    <span
                        className={'d-block font-size-20 font-weight-600 color-text margin-bottom-30'.classNames()}
                    >
                        {step.label}
                    </span>
                </Conditional>

                <Conditional show={!is_segment}>
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
                </Conditional>

				{fields_to_render.map((f, i) => (
					<div key={i} className={'margin-bottom-30'.classNames()}>
						<RenderField 
							field={f} 
							values={state.values} 
							onChange={onChange}/>
					</div>
				))}

                {is_segment ? (
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
                ) : (
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
