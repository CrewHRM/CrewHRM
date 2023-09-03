import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StickyBar } from '../../../materials/sticky-bar/sticky-bar.jsx';
import { __, getRandomString } from '../../../utilities/helpers.jsx';
import { Tabs } from '../../../materials/tabs/tabs.jsx';

import logo_extended from '../../../images/logo-extended.svg';
import { JobDetails } from './job-details/job-details.jsx';
import { HiringFlow } from './hiring-flow/hiring-flow.jsx';
import { ApplicationForm } from './application-form/application-form.jsx';
import { sections_fields } from './application-form/form-structure.jsx';
import { request } from '../../../utilities/request.jsx';
import { ContextNonce } from '../../../materials/mountpoint.jsx';
import { ContextToast } from '../../../materials/toast/toast.jsx';

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


export const hiriging_flow = [
    __('Screening'),
    __('Assesment'),
    __('Interview'),
    __('Make an Offer')
].map((s) => {
    return {
        id: getRandomString(),
        label: s
    };
});


function getFieldsToSave(sections_fields) {
    const _new = {};

    // Loop through the sections
    for (let section in sections_fields) {

		// Spread section properties into new object
		_new[section] = {...sections_fields[section]};

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
    let { job_id: id } = useParams();
    const job_id = id === 'new' ? 0 : id;
	const {nonce, nonceAction} = useContext(ContextNonce);
	const {ajaxToast} = useContext(ContextToast);

    const [state, setState] = useState({
        active_tab: 'job-details',
		has_changes: false,
		auto_saver: null,
        values: {
			job_status: 'draft',
            hiriging_flow,
            application_form: sections_fields
        }
    });

	const [updates, setUpdates] = useState({
		saving_mode: null,
		saving_in_progress: false
	});

	useEffect(()=>{
		console.log(updates);

		if ( !updates.saving_mode || updates.saving_in_progress ) {
			return;
		}

		saveJob(true);

	}, [updates.saving_mode]);

    const onChange = (name, value) => {
		// Clear Previous timeout
		window.clearTimeout(state.auto_saver);
	
        setState({
            ...state,
			has_changes: true,
            values: {
                ...state.values,
                [name]: value
            },
			auto_saver: window.setTimeout(()=>{
				setUpdates({
					...updates,
					saving_mode: 'auto'
				});
			}, 3000),
        });
    };

	const saveJob=(auto)=>{
		setUpdates({
			saving_in_progress: true
		});

		const paylod = {
			nonce, 
			nonceAction,
			job:{
				...state.values,
				application_form: getFieldsToSave(state.values.application_form)
			}, 
		}

		request('update_job', paylod, resp=>{
			const {success, data:{job_id, address_id}} = resp;

			if ( ! auto || ( auto && !success ) ) {
				ajaxToast(resp);
			}

			// Add job id and address id to the job object
			if ( success ) {
				setState({
					...state,
					values: {
						...state.values,
						job_id,
						address_id
					}
				});
			}

			// Clear save state
			setUpdates({
				...updates,
				saving_mode: null,
				saving_in_progress: false
			});
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

    const { active_tab } = state;
	const is_last_step = active_tab === steps[steps.length-1].id;

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
                    <div key="action" className={'d-flex align-items-center column-gap-20 justify-content-end'.classNames()}>
                        {updates.saving_mode==='auto' ? <span className={'font-size-15 font-weight-400 letter-spacing--3 color-text-light margin-right-20'.classNames()}>
							{__('Auto saving ...')}
						</span> : null}
						
						{is_last_step ? <button className={'button button-primary button-outlined'.classNames()}>
                            {__('Preview Job')}
                        </button> : null}

                        <button
                            className={'button button-primary'.classNames()}
                            disabled={updates.saving_mode!==null || !state.has_changes}
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
							onNavigate={navigateTab}
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
                        {active_tab == 'job-details' ? <JobDetails /> : null}

                        {active_tab == 'hiring-flow' ? <HiringFlow /> : null}

                        {active_tab == 'application-form' ? <ApplicationForm /> : null}
                    </div>
                </div>
            </div>
        </ContextJobEditor.Provider>
    );
}
