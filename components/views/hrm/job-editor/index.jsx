import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { __, addKsesPrefix, data_pointer, filterObject, getRandomString, isEmpty } from 'crewhrm-materials/helpers.jsx';
import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import { ContextWarning } from 'crewhrm-materials/warning/warning.jsx';
import { InitState } from 'crewhrm-materials/init-state.jsx';
import { ErrorBoundary } from 'crewhrm-materials/error-boundary.jsx';
import { LogoExtended } from 'crewhrm-materials/dynamic-svg/logo-extended.jsx';

import { JobDetails } from './job-details/job-details.jsx';
import { HiringFlow } from './hiring-flow/hiring-flow.jsx';
import { ApplicationForm } from './application-form/application-form.jsx';
import { sections_fields } from './application-form/form-structure.jsx';
import { Congrats } from './congrats/congrats.jsx';

import style from './editor.module.scss';

export const ContextJobEditor = createContext();

const steps = [
    {
        id: 'job-details',
        label: __('Job Details'),
        required: ['job_title', 'department_id', 'job_description']
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
function getFieldsToSave(sections_fields, section_name) {
    const _new = {};

    // Loop through the sections
    for (let section in sections_fields) {

        // Add support of specific section name
        if (section_name && section !== section_name) {
            continue;
        }

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

function justifyFields(section_fields, application_form) {

    // Remove obsolete sections from saved form
    let _application_form = filterObject(application_form, (value, key) => {
        return section_fields[key] ? true : false;
    });

    // Remove obsolete singular fields from saved form except questions as it is managed by addon
    for (let section_name in _application_form) {
        const { fields = [] } = _application_form[section_name];
        _application_form[section_name].fields = fields.filter(field => {
            return ['questions', 'ko_questions'].includes(section_name) || section_fields[section_name].fields.find(f => f.id === field.id)
        });
    }

    // Add outstanding section to saved form
    for (let section_name in sections_fields) {
        if (!_application_form[section_name]) {
            _application_form = {
                ..._application_form,
                ...getFieldsToSave(section_fields, section_name)
            }
        }

        // Add outstanding singular fields to saved form
        if (!['questions','ko_questions'].includes(section_name)) {
            const { fields = [] } = section_fields[section_name];
            const { fields: _fields = [] } = _application_form[section_name];

            // Loop through run time form fields
            runtime_loop: for (let i = 0; i < fields.length; i++) {

                // Loop through saved form fields
                for (let n = 0; n < _fields.length; n++) {
                    if (fields[i].id === _fields[n].id) {
                        continue runtime_loop;
                    }
                }

                // As it is reached here, the field is outstanding and not in saved form
                if (!Array.isArray(_application_form[section_name].fields)) {
                    _application_form[section_name].fields = [];
                }

                delete fields[i].form;

                _application_form[section_name].fields = [..._fields, fields[i]];
            }
        }
    }

    return _application_form;
}

let timer;

export function JobEditor() {
    const { showWarning, closeWarning } = useContext(ContextWarning);
    let { job_id } = useParams();
    const { ajaxToast } = useContext(ContextToast);
    const navigate = useNavigate();
    const is_new = job_id === 'new';

    const [state, setState] = useState({
        edit_session: null,
        autosaved_job: null,
        error_message: null,
        saving_mode: null,
        fetching: false,
        session: null,
        mounted: false,
        values: {},
        show_congrats: false
    });

    const [active_tab, setTab] = useState('job-details');

    const active_index = steps.findIndex((s) => s.id === active_tab);
    const is_last_step = active_tab === steps[steps.length - 1].id;
    const is_next_disabled =
        steps[active_index]?.required?.filter((f) => isEmpty(state.values[f]))?.length > 0;

    const onChange = (name, value, trigger_save = false) => {
        setState({
            ...state,
            edit_session: trigger_save ? true : getRandomString(),
            values: {
                ...state.values,
                [name]: value
            }
        });
    };

    const onSaveClick = () => {
        if (!is_last_step) {
            navigateTab(1);
            return;
        }

        saveJob(!is_last_step);
    };

    const saveJob = (auto, job_status) => {
        // Save only if the required fields are filled no matter if it is auto or manual save
        // And no other request is in progress
        if (is_next_disabled || state.saving_mode) {
            return;
        }

        setState({
            ...state,
            edit_session: null,
            saving_mode: auto ? 'auto' : 'manual'
        });

        const payload = {
            job: {
                ...state.values,
                job_status: job_status || (auto ? 'draft' : 'publish')
            }
        };

        request('updateJob', addKsesPrefix(payload, 'job_description'), (resp) => {
            const {
                success,
                data: {
                    message,
                    job_id,
                    job_slug,
                    address_id,
                    stage_ids = {},
                    job_permalink
                }
            } = resp;

            if (auto && !success) {
                // Show response message toast if auto draft failed
                ajaxToast(resp);
            }

            const new_state = {
                ...state,
                edit_session: null,
                saving_mode: null,
                show_congrats: !auto && success,
                job_permalink
            };

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
                    job_slug: job_slug || state.values.job_slug,
                    address_id: address_id || state.values.address_id,
                    job_status: payload.job.job_status
                };

                // Replace url state with job ID if it was new previously. So reload will be supported.
                if (is_new) {
                    navigate(`/dashboard/jobs/editor/${job_id}/`, { replace: true });
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
                session: getRandomString(),
                values: {
                    job_id: 0,
                    hiring_flow,
                    application_form: getFieldsToSave(sections_fields),
                    street_address: window[data_pointer].company_address.street_address,
                    zip_code: window[data_pointer].company_address.zip_code,
                    country_code: window[data_pointer].company_address.country_code,
                    currency: window[data_pointer].currency_code || 'USD'
                }
            });
            return;
        }

        setState({
            ...state,
            fetching: true
        });

        request('getSingleJobEdit', { job_id }, (resp) => {
            const {
                success,
                data: { job = {}, autosaved_job, message = __('Something went wrong!') }
            } = resp;

            setState({
                ...state,
                values: {
                    ...job,
                    hiring_flow: isEmpty(job.hiring_flow) ? hiring_flow : job.hiring_flow,
                    application_form: isEmpty(job.application_form)
                        ? getFieldsToSave(sections_fields)
                        : justifyFields(sections_fields, job.application_form)
                },
                session: getRandomString(),
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
    useEffect(() => {
        if (!state.edit_session) {
            return;
        }

        const immediate = state.edit_session === true;

        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
            saveJob(true, immediate ? state.values.job_status : undefined);
        }, immediate ? 0 : 3000);

        return () => {
            window.clearTimeout(timer);
        };
    }, [state.edit_session]);

    // Show prompt to reinstate auto saved job from any previous session.
    useEffect(() => {
        if (!state.autosaved_job) {
            return;
        }

        showWarning({
            message: __('There is an auto saved version of this job. Would you like to restore?'),
            onConfirm: () => {
                setState({
                    ...state,
                    autosaved_job: null,
                    values: {
                        ...state.autosaved_job,
                        application_form: justifyFields(sections_fields, state.autosaved_job.application_form)
                    }
                });

                closeWarning();
            },
            confirmText: __('Restore'),
            closeText: __('No'),
            mode: 'normal'
        });
    }, [state.autosaved_job]);

    if (state.error_message) {
        return (
            <div className={'text-align-center color-error'.classNames()}>
                {state.error_message}
            </div>
        );
    }

    if (!state.session && state.fetching) {
        return <InitState fetching={state.fetching} />;
    }

    return <>
        {
            !state.show_congrats ? null :
                <Congrats
                    job_permalink={state.job_permalink}
                    onClose={() => setState({ ...state, show_congrats: false })} />
        }

        <ContextJobEditor.Provider
            value={{
                values: state.values,
                onChange,
                navigateTab,
                onSaveClick,
                is_next_disabled,
                saving_mode: state.saving_mode,
                session: state.session
            }}
        >
            <StickyBar title="Job Editor">
                {[
                    <div key="log" className={'text-align-center'.classNames()}>
                        <div className={'d-inline-block'.classNames()}>
                            {
                                window[data_pointer].white_label.app_logo_extended
                                    ? <img src={window[data_pointer].white_label.app_logo_extended} style={{ width: 'autp', height: '30px' }} />
                                    : <LogoExtended height={16} />
                            }
                        </div>
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

                        <Conditional show={is_last_step && !state.saving_mode}>
                            <Link
                                className={'button button-primary button-outlined'.classNames()}
                                target="_blank"
                                to={`${state.values.job_permalink}?preview=1`}
                            >
                                {__('Preview Job')}
                            </Link>
                        </Conditional>

                        <button
                            className={'button button-primary white-space-nowrap'.classNames()}
                            disabled={is_next_disabled || state.saving_mode != null}
                            onClick={onSaveClick}
                        >
                            {is_last_step ? (state.values.job_status != 'publish' ? __('Publish') : __('Update')) : __('Save & Continue')}
                        </button>
                    </div>
                ]}
            </StickyBar>

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
                                            className={`font-size-15 font-weight-400 letter-spacing--3 ${s.id == active_tab
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
                        {active_tab == 'job-details' ? <ErrorBoundary><JobDetails /></ErrorBoundary> : null}

                        {active_tab == 'hiring-flow' ? <ErrorBoundary><HiringFlow /></ErrorBoundary> : null}

                        {active_tab == 'application-form' ? <ErrorBoundary><ApplicationForm /></ErrorBoundary> : null}
                    </div>
                </div>
            </div>
        </ContextJobEditor.Provider>
    </>
}
