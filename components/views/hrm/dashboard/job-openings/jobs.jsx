import React, { useContext, useEffect, useState } from 'react';
import { __, getCountries } from '../../../../utilities/helpers.jsx';

import style from './jobs.module.scss';
import { StatusDot } from '../../../../materials/status-dot/status-dots.jsx';
import { NoJob } from './segments/no-job.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Options } from '../../../../materials/dropdown/dropdown.jsx';
import { ShareModal } from '../../../../materials/share-modal.jsx';
import { Pagination } from '../../../../materials/pagination/pagination.jsx';
import { request } from '../../../../utilities/request.jsx';
import { ContextNonce } from '../../../../materials/mountpoint.jsx';
import moment from 'moment-timezone';
import { StatsRow } from './segments/stats-row.jsx';
import { FilterBar } from './segments/filter-bar.jsx';
import { LoadingIcon } from '../../../../materials/loading-icon/loading-icon.jsx';
import { ContextToast } from '../../../../materials/toast/toast.jsx';

const special_stages = {
    _hired_: __('Hired'),
    _disqualified_: __('Disqualified')
};

const options = [
    {
        name: 'preview',
        label: __('Preview'),
        icon: 'ch-icon ch-icon-eye',
        for: ['draft']
    },
    {
        name: 'edit',
        label: __('Edit'),
        icon: 'ch-icon ch-icon-edit-2',
        for: ['publish', 'draft', 'expired']
    },
    {
        name: 'duplicate',
        label: __('Duplicate'),
        icon: 'ch-icon ch-icon-copy',
        for: 'all'
    },
    {
        name: 'archive',
        label: __('Archive'),
        icon: 'ch-icon ch-icon-archive',
        for: ['publish', 'draft', 'expired']
    },
    {
        name: 'unarchive',
        label: __('Un-archive'),
        icon: 'ch-icon ch-icon-archive',
        for: ['archive']
    },
    {
        name: 'share',
        label: __('Share Job'),
        icon: 'ch-icon ch-icon-share',
        for: ['publish']
    },
    {
        name: 'delete',
        label: __('Delete'),
        icon: 'ch-icon ch-icon-trash',
        for: 'all'
    }
];

export const statuses = {
    publish: {
        color: '#73BF45',
        label: __('Published')
    },
    draft: {
        color: '#EE940D',
        label: __('Draft')
    },
    archive: {
        color: '#BBBFC3',
        label: __('Archived')
    },
    expired: {
        color: '#FF180A',
        label: __('Expired')
    }
};

export const status_keys = Object.keys(statuses);

export function JobOpenings(props) {
    let { is_overview, className } = props;
    const { nonce, nonceAction } = useContext(ContextNonce);
    const { ajaxToast } = useContext(ContextToast);
    const navigate = useNavigate();

    const [state, setState] = useState({
        share_link: null,
        jobs: [],
        fetching: false,
        in_action: null,
        filters: {
            job_status: 'all',
            country_code: null,
            page: 1
        }
    });

    const onChange = (key, value) => {
        setState({
            ...state,
            filters: {
                ...state.filters,
                [key]: value
            }
        });
    };

    const onActionClick = (action, job_id) => {
        const job = state.jobs.find((j) => j.job_id == job_id);

        switch (action) {
            case 'share':
                setState({
                    ...state,
                    share_link: job.job_permalink
                });
                break;

            case 'preview':
                window.open(job.job_permalink, '_blank');
                break;

            case 'edit':
                navigate(`/dashboard/jobs/editor/${job.job_id}/`);
                break;

            case 'archive':
            case 'unarchive':
            case 'delete':
            case 'duplicate':
                // Register loading state
                setState({
                    ...state,
                    in_action: action
                });

                // Server request for action
                request(
                    'single_job_action',
                    { nonce, nonceAction, job_action: action, job_id },
                    (resp) => {
                        // Remove loading state
                        setState({
                            ...state,
                            in_action: null
                        });

                        // Show response notice
                        ajaxToast(resp);

                        // Get updated job list again
                        getJobs(action === 'duplicate' ? { page: 1 } : {}); // Get to first page to see the duplicated one.
                    }
                );
                break;
        }
    };

    const getJobs = (f = {}) => {
        setState({
            ...state,
            fetching: true
        });

        const { filters } = state;
        request(
            'get_jobs_dashboard',
            { filters: { ...filters, ...f }, nonce, nonceAction },
            (resp) => {
                const { success, data = {} } = resp;
                const { jobs = [] } = data;

                setState({
                    ...state,
                    fetching: false,
                    jobs
                });
            }
        );
    };

    useEffect(() => {
        getJobs();
    }, []);

    return (
        <div data-crewhrm-selector="job-openings" className={'jobs'.classNames(style) + className}>
            {state.share_link ? (
                <ShareModal
                    url={state.share_link}
                    closeModal={() => setState({ ...state, share_link: null })}
                />
            ) : null}

            <FilterBar {...{ is_overview, onChange, filters: state.filters }} />

            {(!state.jobs.length && <NoJob />) || (
                <div data-crewhrm-selector={'job-list'}>
                    {state.jobs.map((job) => {
                        const {
                            job_id,
                            job_title,
                            job_status,
                            department_name,
                            street_address,
                            country_code,
                            job_type,
                            vacancy,
                            application_deadline,
                            stats: { candidates = 0, stages: application_stages = {} }
                        } = job;

                        const meta_data = [
                            department_name,
                            street_address || country_code
                                ? street_address +
                                  (country_code ? ', ' + getCountries()[country_code] : '')
                                : null,
                            job_type,
                            application_deadline
                                ? moment(application_deadline).format('DD MMM, YYYY')
                                : null
                        ];

                        const { color: status_color, label: status_label = __('Unknown Status') } =
                            statuses[job_status] || {};

                        const stats = [
                            {
                                key: 'sdfsdf',
                                label: __('Candidates'),
                                content: candidates
                            }
                        ];

                        // Assign data to stats object
                        Object.keys(application_stages).forEach((id) => {
                            const { stage_id, stage_name, candidates = 0 } = application_stages[id];

                            stats.push({
                                key: stage_id,
                                label: special_stages[stage_name] || stage_name,
                                content:
                                    stage_name === '_hired_'
                                        ? candidates + (vacancy ? '/' + vacancy : '')
                                        : candidates
                            });
                        });

                        const actions = options
                            .filter((o) => o.for === 'all' || o.for.indexOf(job_status) > -1)
                            .map((o) => {
                                return {
                                    id: o.name,
                                    label: (
                                        <span
                                            className={'d-inline-flex align-items-center column-gap-10'.classNames()}
                                        >
                                            {state.action ? (
                                                <LoadingIcon size={24} />
                                            ) : (
                                                <i
                                                    className={
                                                        o.icon.classNames() +
                                                        'font-size-24 color-text'.classNames()
                                                    }
                                                ></i>
                                            )}

                                            <span
                                                className={'font-size-15 font-weight-500 line-height-25 color-text'.classNames()}
                                            >
                                                {o.label}
                                            </span>
                                        </span>
                                    )
                                };
                            });

                        return (
                            <div
                                key={job_id}
                                className={'bg-color-white border-radius-5 margin-bottom-20'.classNames()}
                            >
                                <div
                                    className={'d-flex align-items-center border-bottom-1 b-color-tertiary padding-vertical-15 padding-horizontal-20'.classNames()}
                                >
                                    <div className={'flex-1'.classNames()}>
                                        <div
                                            className={'d-flex align-items-center margin-bottom-15'.classNames()}
                                        >
                                            <div
                                                className={'d-inline-block margin-right-8'.classNames()}
                                                title={status_label}
                                            >
                                                <StatusDot color={status_color} />
                                            </div>
                                            <span
                                                className={'d-block color-text font-size-20 font-weight-600'.classNames()}
                                            >
                                                {job_title}
                                            </span>
                                        </div>
                                        <div
                                            className={'d-flex align-items-center flex-direction-row flex-wrap-wrap column-gap-30 row-gap-5'.classNames()}
                                        >
                                            {meta_data.map((data, index) => {
                                                return !data ? null : (
                                                    <span
                                                        key={data}
                                                        className={'d-inline-block font-size-15 font-weight-400 color-text-light'.classNames()}
                                                    >
                                                        {data}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <Link
                                            to={`/dashboard/jobs/${job_id}/applications/`}
                                            className={'button button-primary button-outlined button-small'.classNames()}
                                        >
                                            {__('Details')}
                                        </Link>
                                    </div>
                                    <div className={'d-contents'.classNames()}>
                                        <Options
                                            options={actions}
                                            onClick={(action) => onActionClick(action, job_id)}
                                        >
                                            <i
                                                className={'ch-icon ch-icon-more color-text-light font-size-20 cursor-pointer d-inline-block margin-left-15'.classNames()}
                                            ></i>
                                        </Options>
                                    </div>
                                </div>
                                <div
                                    className={'d-flex align-items-center justify-content-space-between padding-vertical-15 padding-horizontal-20'.classNames()}
                                >
                                    <StatsRow stats={stats} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Show view all button when it is loaded in dashboard as summary */}
            {(is_overview && state.jobs.length && (
                <Link
                    to="/dashboard/jobs/"
                    className={
                        'button button-primary button-outlined button-full-width-2'.classNames() +
                        'view-all-button'.classNames(style)
                    }
                >
                    {__('View All Jobs')}
                </Link>
            )) ||
                null}

            {/* Show pagination when it is loaded as a single view */}
            {(!is_overview && (
                <div className={'d-flex justify-content-end'.classNames()}>
                    <Pagination />
                </div>
            )) ||
                null}
        </div>
    );
}

export function JobOpeningsFullView(props) {
    return (
        <div
            data-crewhrm-selector="job-openings-full-view"
            className={'padding-30'.classNames()}
            style={{ maxWidth: '988px', margin: '0 auto' }}
        >
            <JobOpenings />
        </div>
    );
}
