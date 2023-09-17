import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StickyBar } from '../../../materials/sticky-bar/sticky-bar.jsx';
import { __, getRandomString } from '../../../utilities/helpers.jsx';
import { Tabs } from '../../../materials/tabs/tabs.jsx';
import { JobDetails } from './job-details/job-details.jsx';
import { HiringFlow } from './hiring-flow/hiring-flow.jsx';
import { ApplicationForm } from './application-form/application-form.jsx';
import { sections_fields } from './application-form/form-structure.jsx';
import { request } from '../../../utilities/request.jsx';
import { ContextToast } from '../../../materials/toast/toast.jsx';
import { LoadingIcon } from '../../../materials/loading-icon/loading-icon.jsx';
import { Conditional } from '../../../materials/conditional.jsx';
import { ContextWarning } from '../../../materials/warning/warning.jsx';

import logo_extended from '../../../images/logo-extended.svg';
import style from './editor.module.scss';

export const ContextJobEditor = createContext();

const steps = [
    {
        id: 'job-details',
        label: __('Job Details')
    },
    {
        id: 'hiring-flow',
        label: __('Hiring Flow')
    },
    {
        id: 'application-form',
        label: __('Application Form')
    }
];

export const hiring_flow = [
    __('Screening'),
    __('Assesment'),
    __('Interview'),
    __('Make an Offer')
].map((s) => {
    return {
        stage_id: getRandomString(),
        stage_name: s
    };
});

// Remove unnecessary properties before saving
function getFieldsToSave(sections_fields) {
    const _new = {};

    // Loop through the sections
    for (let section in sections_fields) {
        // Spread section properties into new object
        _new[section] = { ...sections_fields[section] };

        // Delete popup options array
        delete _new[section].options;

        // Extract fields array
        let { fields = [] } = _new[section];

        // Loop through fields
        fields = fields.map((field) => {
            let new_field = { ...field };

            // Delete form that is meant to be used for only job application form
            if (new_field.form) {
                delete new_field.form;
            }

            return new_field;
        });

        _new[section] = { ..._new[section], fields };
    }

    return _new;
}

export function JobEditor() {
	const {showWarning, closeWarning} = useContext(ContextWarning);
    let { job_id } = useParams();
    const { ajaxToast } = useContext(ContextToast);
	const navigate = useNavigate();
	const is_new = job_id==='new';

    const [state, setState] = useState({
        active_tab: 'job-details',
		edit_session: null,
		autosaved_job: null,
        error_message: null,
		saving_mode: null,
		fetching: false,
        values: {}
    });

    const is_last_step = state.active_tab === steps[steps.length - 1].id;
	
    const onChange = (name, value) => {
        setState({
            ...state,
            edit_session: getRandomString(),
            values: {
                ...state.values,
                [name]: value
            }
        });
    };

	const onSaveClick=()=>{
		saveJob(!is_last_step); 

		if ( !is_last_step ) {
			navigateTab(1);
		}
	}

    const saveJob = (auto) => {
        setState({
			...state,
			saving_mode: auto ? 'auto' : 'manual',
        });

		const payload = {
			job: {
				...state.values, 
				job_status: auto ? 'draft' : 'publish'
			}
		}

        request('update_job', payload, (resp) => {
            const {
                success,
                data: { job_id, address_id, stage_ids = {} }
            } = resp;

            if (!auto || (auto && !success)) {
                ajaxToast(resp);
            }

			const new_state = {
				...state,
				saving_mode: null,
			}

            // Add job id and address id to the job object
            if (success) {
                // Replace dynamic stage id with database one
                const hiring_flow = state.values.hiring_flow.map((f) => {
                    return {
                        stage_id: stage_ids[f.stage_id] || f.stage_id,
                        stage_name: f.stage_name
                    };
                });

				new_state.values = {
					...state.values,
					hiring_flow,
					job_id: job_id || state.values.job_id,
					address_id: address_id || state.values.address_id,
					edit_session: null,
				}

				// Replace url state with job ID if it was new previously. So reload will be supported. 
				if ( is_new ) {
					navigate(`/dashboard/jobs/editor/${stored_job_id}/`, {replace: true});
				}
            }

			setState(new_state);
        });
    };

    const navigateTab = (tab) => {
        const current_index = steps.findIndex((s) => s.id == state.active_tab);

        if (tab === 1 || tab === -1) {
            tab = steps[current_index + tab].id;
        }

        setState({
            ...state,
            active_tab: tab
        });
    };

    const getJob = () => {
        if (is_new) {
            // As it is new, just use predefined template at mount time
            setState({
                ...state,
                values: {
                    job_id: 0,
                    hiring_flow,
                    application_form: getFieldsToSave(sections_fields)
                }
            });
            return;
        }

        setState({
            ...state,
            fetching: true
        });

        request('get_single_job_edit', { job_id }, (resp) => {
            const {
                success,
                data: { job = {}, autosaved_job, message = __('Something went wrong!') }
            } = resp;

            setState({
                ...state,
                values: {
                    ...job,
                    application_form: job.application_form || sections_fields
                },
				autosaved_job,
                fetching: false,
                error_message: !success ? message : null
            });
        });
    };

	// Load the job in editor from server whenever job_id change in url
    useEffect(() => {
        getJob();
    }, [job_id]);

	// Auto save job after certain times
	useEffect(()=>{

		if ( !state.edit_session ) {
			return;
		}

		const timer = window.setTimeout(() => {
        	saveJob(true);
		}, 3000);

		return ()=>{
			window.clearTimeout(timer);
		}
		
	}, [state.edit_session]);

	// Show prompt to reinstate auto saved job from any previous session.
	useEffect(()=>{
		if( !state.autosaved_job ) {
			return;
		}

		showWarning(
			__('There is an auto saved version of this job. Would you like to restore?'), 
			()=>{
				setState({
					...state,
					autosaved_job: null,
					values: state.autosaved_job
				});
				
				closeWarning();
			}
		);

	}, [state.autosaved_job]);

    if (state.fetching) {
        return <LoadingIcon center={true} />;
    }

    if (state.error_message) {
        return (
            <div className={'text-align-center color-danger'.classNames()}>
                {state.error_message}
            </div>
        );
    }

    return (
        <ContextJobEditor.Provider value={{ values: state.values, onChange, navigateTab }}>
            <StickyBar title="Job Editor">
                {[
                    <div key="log" className={'text-align-center'.classNames()}>
                        <img
                            src={logo_extended}
                            style={{ width: 'auto', height: '16px' }}
                            className={'d-inline-block'.classNames()}
                        />
                    </div>,
                    <div
                        key="action"
                        className={'d-flex align-items-center column-gap-20 justify-content-end'.classNames()}
                    >
						<Conditional show={state.saving_mode === 'auto'}>
							<span
                                className={'font-size-15 font-weight-400 letter-spacing--3 color-text-light margin-right-20'.classNames()}
                            >
                                {__('Auto saving ...')}
                            </span>
						</Conditional>
						
						<Conditional show={is_last_step}>
							<button
                                className={'button button-primary button-outlined'.classNames()}
                            >
                                {__('Preview Job')}
                            </button>
						</Conditional>
						
                        <button
                            className={'button button-primary'.classNames()}
                            disabled={state.saving_mode != null || !state.edit_session}
							onClick={onSaveClick}
                        >
                            {is_last_step ? __('Publish') : __('Save and Continue')}
                        </button>
                    </div>
                ]}
            </StickyBar>

            <div className={'editor-wrapper'.classNames(style)}>
                <div className={'box-shadow-thin padding-20'.classNames()}>
                    <div>
                        <Tabs
                            theme="sequence"
                            active={state.active_tab}
                            tabs={steps.map((s) => {
                                return {
                                    ...s,
                                    label: (
                                        <span
                                            className={`font-size-15 font-weight-400 letter-spacing--3 ${
                                                s.id == state.active_tab
                                                    ? 'color-text'
                                                    : 'color-text-light'
                                            }`.classNames()}
                                        >
                                            {s.label}
                                        </span>
                                    )
                                };
                            })}
                        />
                    </div>
                </div>

                <div
                    className={
                        'form'.classNames(style) +
                        'margin-top-40 padding-horizontal-15'.classNames()
                    }
                >
                    <div>
                        {state.active_tab == 'job-details' ? <JobDetails /> : null}

                        {state.active_tab == 'hiring-flow' ? <HiringFlow /> : null}

                        {state.active_tab == 'application-form' ? <ApplicationForm /> : null}
                    </div>
                </div>
            </div>
        </ContextJobEditor.Provider>
    );
}
