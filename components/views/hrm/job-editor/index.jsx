import React, { createContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StickyBar } from '../../../materials/sticky-bar/sticky-bar.jsx';
import { __ } from '../../../utilities/helpers.jsx';
import { Tabs } from '../../../materials/tabs/tabs.jsx';

import logo_extended from '../../../images/logo-extended.svg';
import { JobDetails } from './job-details/job-details.jsx';
import { HiringFlow } from './hiring-flow/hiring-flow.jsx';
import { ApplicationForm } from './application-form/application-form.jsx';

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

export function JobEditor() {
    let { job_id: id } = useParams();
    const job_id = id === 'new' ? 0 : id;

    const [state, setState] = useState({
        is_auto_saving: true,
        active_tab: 'job-details',
		values: {}
    });

	const onChange=(name, value)=>{
		setState({
			...state,
			values: {
				...state.values,
				[name]: value
			}
		});
	}

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

    return (
        <ContextJobEditor.Provider value={{ values:state.values, onChange, navigateTab}}>
            <StickyBar title="Job Editor">
                {[
                    <div key="log" className={'text-align-center'.classNames()}>
                        <img
                            src={logo_extended}
                            style={{ width: 'auto', height: '16px' }}
                            className={'d-inline-block'.classNames()}
                        />
                    </div>,
                    <div key="action" className={'text-align-right'.classNames()}>
                        {(state.is_auto_saving && (
                            <span
                                className={'font-size-15 font-weight-400 letter-spacing--3 color-text-light margin-right-20'.classNames()}
                            >
                                {__('Auto saving ...')}
                            </span>
                        )) ||
                            null}
                        <button
                            className={'button button-primary'.classNames()}
                            disabled={state.is_auto_saving}
                        >
                            {__('Save and Continue')}
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
                        {active_tab == 'job-details' ? <JobDetails/> : null}

                        {(active_tab == 'hiring-flow' && (
                            <HiringFlow navigateTab={navigateTab} />
                        )) ||
                            null}

                        {(active_tab == 'application-form' && (
                            <ApplicationForm navigateTab={navigateTab} />
                        )) ||
                            null}
                    </div>
                </div>
            </div>
        </ContextJobEditor.Provider>
    );
}
