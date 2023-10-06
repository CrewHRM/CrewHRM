import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { __, formatDate } from 'crewhrm-materials/helpers.jsx';
import { StatusDot } from 'crewhrm-materials/status-dot/status-dots.jsx';
import { Options } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { ShareModal } from 'crewhrm-materials/share-modal.jsx';
import { Pagination } from 'crewhrm-materials/pagination/pagination.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import { ContextWarning } from 'crewhrm-materials/warning/warning.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import { statuses, countries_object } from 'crewhrm-materials/data.jsx';

import { NoJob } from './segments/no-job.jsx';
import { StatsRow } from './segments/stats-row.jsx';
import { FilterBar } from './segments/filter-bar.jsx';

import style from './jobs.module.scss';

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
        for: 'all',
        warning: __('Are you sure to duplicate?')
    },
    {
        name: 'archive',
        label: __('Archive'),
        icon: 'ch-icon ch-icon-archive',
        for: ['publish', 'draft', 'expired'],
        warning: __('Are you sure to archive?')
    },
    {
        name: 'unarchive',
        label: __('Un-archive'),
        icon: 'ch-icon ch-icon-archive',
        for: ['archive'],
        warning: __('Are you sure to un-archive?')
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
        for: 'all',
        warning: __('Are you sure to delete permanently?')
    }
];

export function JobOpenings(props) {
    let { is_overview, className } = props;
    const { ajaxToast } = useContext(ContextToast);
    const { showWarning, closeWarning } = useContext(ContextWarning);
    const navigate = useNavigate();

    const [state, setState] = useState({
        share_link: null,
        jobs: [],
        fetching: true,
        in_action: null,
        segmentation: null,
        filters: {
            job_status: null,
            department_id: null,
            search: '',
            // country_code: null,
            page: 1
        }
    });

    const onChange = (key, value) => {
        setState({
            ...state,
            filters: {
                ...state.filters,
                [key]: value,
                page: key === 'page' ? value : 1
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
                showWarning(
                    __(options.find((o) => o.name === action)?.warning || 'Sure to proceed?'),
                    () => {
                        // Close warning modal and execute in background
                        closeWarning();

                        // Register loading state
                        setState({
                            ...state,
                            in_action: action
                        });

                        // Server request for action
                        request('singleJobAction', { job_action: action, job_id }, (resp) => {
                            // Remove loading state
                            setState({
                                ...state,
                                in_action: null
                            });

                            // Show response notice
                            ajaxToast(resp);

                            // Get updated job list again
                            getJobs(action === 'duplicate' ? { page: 1 } : {}); // Get to first page to see the duplicated one.
                        });
                    },
                    null,
                    __('Yes')
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

        request('getJobsDashboard', { filters: { ...filters, ...f } }, (resp) => {
            const {
                success,
                data: { jobs = [], segmentation = {} }
            } = resp;

            if (!success) {
                ajaxToast(resp);
            }

            setState({
                ...state,
                fetching: false,
                segmentation,
                jobs
            });
        });
    };

    useEffect(() => {
        getJobs();
    }, [state.filters]);

    return (
        <>
            <Conditional show={state.share_link}>
                <ShareModal
                    url={state.share_link}
                    closeModal={() => setState({ ...state, share_link: null })}
                />
            </Conditional>

            <div
                data-crewhrm-selector="job-openings"
                className={'jobs'.classNames(style) + className}
            >
                <FilterBar
                    {...{
                        is_overview,
                        onChange,
                        filters: state.filters,
                        fetching: state.fetching
                    }}
                />

                <Conditional show={!state.jobs.length && !state.fetching}>
                    <NoJob />
                </Conditional>

                <Conditional show={state.jobs.length}>
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
								job_permalink,
                                stats: { candidates = 0, stages: application_stages = {} }
                            } = job;

                            const meta_data = [
                                department_name,
                                street_address || country_code
                                    ? street_address +
                                      (country_code ? ', ' + countries_object[country_code] : '')
                                    : null,
                                job_type,
                                application_deadline
                                    ? formatDate(application_deadline)
                                    : null
                            ];

                            const {
                                color: status_color,
                                label: status_label = __('Unknown Status')
                            } = statuses[job_status] || {};

                            const stats = [
                                {
                                    key: 'sdfsdf',
                                    label: __('Candidates'),
                                    content: candidates
                                }
                            ];

                            // Assign data to stats object
                            Object.keys(application_stages).forEach((id) => {
                                const {
                                    stage_id,
                                    stage_name,
                                    candidates = 0
                                } = application_stages[id];

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
                                                <a
													href={job_permalink}
													target='_blank'
                                                    className={'d-block color-text font-size-20 font-weight-600 hover-underline'.classNames()}
                                                >
                                                    {job_title}
                                                </a>
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
                </Conditional>

                {/* Show view all button when it is loaded in dashboard as summary */}
                <Conditional show={is_overview && state.jobs.length}>
                    <Link
                        to="/dashboard/jobs/"
                        className={
                            'button button-primary button-outlined button-full-width-2'.classNames() +
                            'view-all-button'.classNames(style)
                        }
                    >
                        {__('View All Jobs')}
                    </Link>
                </Conditional>

                {/* Show pagination when it is loaded as a single view */}
                <Conditional show={!is_overview}>
                    <div className={'d-flex justify-content-end'.classNames()}>
                        <Pagination
                            onChange={(page) => onChange('page', page)}
                            pageNumber={state.filters.page}
                            pageCount={state.segmentation?.page_count || 1}
                        />
                    </div>
                </Conditional>
            </div>
        </>
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
