import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StickyBar } from '../../../materials/sticky-bar/sticky-bar.jsx';
import { __, getRandomString, isEmpty } from '../../../utilities/helpers.jsx';
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
        label: __('Job Details'),
		required: [
			'job_title',
			'department_id',
			'job_description'
		]
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
		edit_session: null,
		autosaved_job: null,
        error_message: null,
		saving_mode: null,
		fetching: false,
        values: {}
    });

	const [active_tab, setTab] = useState('job-details');

	const active_index = steps.findIndex(s=>s.id===active_tab);
    const is_last_step = active_tab === steps[steps.length - 1].id;
	const is_next_disabled = steps[active_index]?.required?.filter(f=>isEmpty(state.values[f]))?.length>0;

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
		if ( !is_last_step ) {
			navigateTab(1);
			return;
		}
		
		saveJob(!is_last_step); 
	}

    const saveJob = (auto) => {
		// Save only if the required fields are filled no matter if it is auto or manual save
		if (is_next_disabled) {
			return;
		}
		
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
					navigate(`/dashboard/jobs/editor/${job_id}/`, {replace: true});
				}
            }

			setState(new_state);
        });
    };

    const navigateTab = (tab) => {
        const current_index = steps.findIndex((s) => s.id == active_tab);

        if (tab === 1 || tab === -1) {
            tab = steps[current_index + tab]?.id;
        }

		if (tab) {
			setTab(tab);
		}
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
			},
			null,
			__('Restore'),
			__('No')
		);

	}, [state.autosaved_job]);

    if (state.error_message) {
        return (
            <div className={'text-align-center color-error'.classNames()}>
                {state.error_message}
            </div>
        );
    }

    return (
        <ContextJobEditor.Provider value={{ values: state.values, onChange, navigateTab, onSaveClick, is_next_disabled, saving_mode: state.saving_mode }}>
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
							<Link
                                className={'button button-primary button-outlined'.classNames()}
								target='_blank'
								to={`${state.values.job_permalink}?preview=1`}
                            >
                                {__('Preview Job')}
                            </Link>
						</Conditional>
						
                        <button
                            className={'button button-primary'.classNames()}
                            disabled={is_next_disabled || state.saving_mode != null || !state.edit_session}
							onClick={onSaveClick}
                        >
                            {is_last_step ? __('Publish') : __('Save & Continue')}
                        </button>
                    </div>
                ]}
            </StickyBar>
			
			<Conditional show={state.fetching}>
				<div className={'margin-top-20 margin-bottom-20'.classNames()}>
					<LoadingIcon center={true} />
				</div>
			</Conditional>

            <div className={'editor-wrapper'.classNames(style)}>
                <div className={'box-shadow-thin padding-20'.classNames()}>
                    <div>
                        <Tabs
                            theme="sequence"
                            active={active_tab}
                            tabs={steps.map((s) => {
                                return {
                                    ...s,
                                    label: (
                                        <span
                                            className={`font-size-15 font-weight-400 letter-spacing--3 ${
                                                s.id == active_tab
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
                        {active_tab == 'job-details' ? <JobDetails /> : null}

                        {active_tab == 'hiring-flow' ? <HiringFlow /> : null}

                        {active_tab == 'application-form' ? <ApplicationForm /> : null}
                    </div>
                </div>
            </div>
        </ContextJobEditor.Provider>
    );
}
