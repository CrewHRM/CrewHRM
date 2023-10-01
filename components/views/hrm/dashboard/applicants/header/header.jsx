import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { StatusDot } from 'crewhrm-materials/status-dot/status-dots.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';

import style from './header.module.scss';

export function Header({
    job_list,
    job_id,
    job: { job_permalink },
    stages = [],
    candidates = 0,
    active_stage_id: active_tab,
    navigateStage
}) {
    const navigate = useNavigate();

    const _candidates = {
        stage_id: 0,
        stage_name: __('Candidates'),
        candidates
    };

    const header_tabs = [_candidates, ...stages]
        .map((s) => {
            return {
                id: s.stage_id,
                label: (
                    <>
                        <span
                            className={'d-inline-block font-size-15 font-weight-600 color-text margin-right-3'.classNames()}
                        >
                            {s.candidates}
                        </span>
                        <span
                            className={'d-inline-block font-size-14 font-weight-400 color-text'.classNames()}
                        >
                            {s.stage_name === '_hired_' ? __('Hired') : s.stage_name}
                        </span>
                    </>
                )
            };
        })
        .filter((s) => s);

    return (
        <div
            data-crewhrm-selector="application-header"
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
                            options={job_list.map((j) => {
                                return { id: j.job_id, label: j.job_title };
                            })}
                            onChange={(v) => navigate(`/dashboard/jobs/${v}/applications/`)}
                            transparent={true}
                            className={'padding-vertical-8 padding-horizontal-15'.classNames()}
                            textClassName={'font-size-24 font-weight-600 color-text'.classNames()}
                        />
                    </div>
                </div>
                <div className={'d-flex align-items-center column-gap-15'.classNames()}>
                    <Link
                        to={job_permalink}
                        target="_blank"
                        className={'font-size-15 font-weight-400 color-text'.classNames()}
                    >
                        {__('View Job')}
                    </Link>
                    <Link
                        to={job_permalink + 'apply/'}
                        target="_blank"
                        className={'button button-primary button-outlined button-small'.classNames()}
                    >
                        {__('Add Candidates')}
                    </Link>
                </div>
            </div>
            <div>
                <Tabs
                    tabs={header_tabs}
                    active={active_tab}
                    onNavigate={navigateStage}
                    theme="button"
                />
            </div>
        </div>
    );
}
