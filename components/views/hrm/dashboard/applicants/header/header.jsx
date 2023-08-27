import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { __ } from '../../../../../utilities/helpers.jsx';
import { StatusDot } from '../../../../../materials/status-dot/status-dots.jsx';
import { DropDown } from '../../../../../materials/dropdown/dropdown.jsx';
import { ContextApplicants } from '../applicants.jsx';
import { Tabs } from '../../../../../materials/tabs/tabs.jsx';

import style from './header.module.scss';

export function Header(props) {
    const { jobs, job_id, steps } = useContext(ContextApplicants);
    const [state, setState] = useState({ active_tab: 'cnd' });
    const navigate = useNavigate();

    const header_tabs = steps.map((s) => {
        return {
            id: s.id,
            label: (
                <>
                    <span
                        className={'d-inline-block font-size-15 font-weight-600 color-text margin-right-3'.classNames()}
                    >
                        {s.count}
                    </span>
                    <span
                        className={'d-inline-block font-size-14 font-weight-400 color-text'.classNames()}
                    >
                        {s.label}
                    </span>
                </>
            )
        };
    });

    return (
        <div
            data-crewhrm-selector="applicant-header"
            className={'header'.classNames(style) + 'box-shadow-thin'.classNames()}
        >
            <div className={'d-flex margin-bottom-20'.classNames()}>
                <div className={'flex-1 d-flex align-items-center'.classNames()}>
                    <div>
                        <StatusDot color="#73BF45" />
                    </div>
                    <div>
                        <DropDown
                            value={job_id}
                            options={jobs}
                            onChange={(v) => navigate(`/dashboard/jobs/${v}/applicants/`)}
                            transparent={true}
                            className={'padding-vertical-8 padding-horizontal-15'.classNames()}
                            textClassName={'font-size-24 font-weight-600 color-text'.classNames()}
                        />
                    </div>
                </div>
                <div className={'d-flex align-items-center column-gap-15'.classNames()}>
                    <a
                        href="#"
                        className={'font-size-15 font-weight-400 color-text'.classNames()}
                    >
                        {__('View Post')}
                    </a>
                    <button
                        className={'button button-primary button-outlined button-small'.classNames()}
                    >
                        {__('Add Candidates')}
                    </button>
                </div>
            </div>
            <div>
                <Tabs
                    tabs={header_tabs}
                    active={state.active_tab}
                    onNavigate={(active_tab) => setState({ ...state, active_tab })}
                    theme="button"
                />
            </div>
        </div>
    );
}
