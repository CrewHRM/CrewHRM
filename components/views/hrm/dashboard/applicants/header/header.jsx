import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { StatusDot } from 'crewhrm-materials/status-dot/status-dots.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';

import style from './header.module.scss';

export function Header({
    job_list,
    job: { job_permalink },
    stages = [],
    candidates = 0
}) {
	const {stage_id, job_id} = useParams();
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
            data-crew="application-header"
            className={'header'.classNames(style) + 'box-shadow-thin'.classNames()}
        >
            <div className={'d-flex margin-bottom-20'.classNames()}>
                <div className={'flex-1 d-flex align-items-center'.classNames()}>
                    <div>
                        <StatusDot color="#73BF45" />
                    </div>
                    <div>
                        <DropDown
                            value={parseInt(job_id)}
                            onChange={(v) => navigate(`/dashboard/jobs/${v}/0/`)}
                            transparent={true}
                            className={'padding-vertical-8 padding-horizontal-15'.classNames()}
                            textClassName={'font-size-24 font-weight-600 color-text'.classNames()}
							clearable={false}
                            options={job_list.map((j) => {
                                return {
									id: j.job_id, 
									label: j.job_title 
								}
                            })}
                            variant='borderless'
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
                    active={parseInt(stage_id)}
                    onNavigate={stage_id=>navigate(`/dashboard/jobs/${job_id}/${stage_id}/`)}
                    theme="button"
                />
            </div>
        </div>
    );
}
