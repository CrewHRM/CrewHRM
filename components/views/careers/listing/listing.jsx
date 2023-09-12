import React, { useState } from 'react';

import style from './listing.module.scss';
import { Link } from 'react-router-dom';
import { __ } from '../../../utilities/helpers.jsx';
import { LoadingIcon } from '../../../materials/loading-icon/loading-icon.jsx';
import { TextField } from '../../../materials/text-field/text-field.jsx';
import { CoverImage } from '../../../materials/image/image.jsx';
import { TagField } from '../../../materials/tag-field/tag-field.jsx';

import hero from '../../../images/hero.png';

const job = {
    job_id: 1,
    job_title: 'Account Executive',
    location: 'London, England',
    job_type: 'Full Time',
    department: 'Design',
    salary: '34,000 - 44000 USD',
    job_description: `We are seeking a talented and experienced Senior AI/ML Engineer to join our dynamic team. In this role, you will play a pivotal role in designing, developing, and deploying cutting-edge AI and machine learning solutions that drive our products to new heights of innovation.
<br/>
<br/>
<div><strong>Responsibilities</strong></div>
<ul>
	<li>Lead the ideation, design, and implementation of AI/ML solutions that align with our product roadmap and business objectives.</li>
	<li>Collaborate with software engineers, data scientists, and domain experts to gather requirements and refine AI/ML models.</li>
	<li>Research, experiment, and implement state-of-the-art algorithms and techniques to improve product functionality and performance.</li>
	<li>Drive data collection, preprocessing, and feature engineering efforts to ensure high-quality input for AI models.</li>
</ul>

<br/>
<br/>
<div><strong>Qualifications</strong></div>
<ul>
	<li>Master's or Ph.D. in Computer Science, Machine Learning, or a related field.</li>
	<li>Proven track record of designing, implementing, and deploying AI/ML solutions in real-world applications.</li>
	<li>Proficiency in programming languages such as Python, and familiarity with AI/ML libraries like TensorFlow, PyTorch, or scikit-learn.</li>
	<li>Strong understanding of deep learning architectures, natural language processing, and/or computer vision.</li>
</ul>`
};

const jobs = Array(8)
    .fill(job)
    .map((j, i) => {
        return {
            ...j,
            job_id: j.job_id + i
        };
    });

const filterList = {
    department: {
        section_label: __('Departments'),
        selection_type: 'list',
        options: [
            {
                id: 1,
                label: 'Business Development',
                count: 2
            },
            {
                id: 2,
                label: 'Business Analytics/Operations',
                count: 5
            },
            {
                id: 3,
                label: 'Backend Engineer',
                count: 1
            },
            {
                id: 4,
                label: 'Brand & Marketing',
                count: 1
            },
            {
                id: 5,
                label: 'Copywriter',
                count: 1
            },
            {
                id: 6,
                label: 'Creative Director',
                count: 2
            },
            {
                id: 7,
                label: 'Data Science',
                count: 1
            }
        ]
    },
    location: {
        section_label: __('Location'),
        selection_type: 'tag',
        options: [
            {
                id: 'us',
                label: 'USA'
            },
            {
                id: 'ca',
                label: 'Canada'
            },
            {
                id: 'in',
                label: 'India'
            },
            {
                id: 'gr',
                label: 'Germany'
            },
            {
                id: 'cn',
                label: 'China'
            }
        ]
    },
    job_type: {
        section_label: 'Job Type',
        selection_type: 'list',
        options: [
            {
                id: 'full_time',
                label: 'Full Time'
            },
            {
                id: 'part_time',
                label: 'Part Time'
            }
        ]
    }
};

export function Listing({ base_permalink }) {
    const [state, setState] = useState({
        filters: {},
        jobs: jobs,
        hovered_job: null
    });

    const setFilter = (key, value) => {
        setState({
            ...state,
            filters: {
                ...state.filters,
                [key]: value
            }
        });
    };

    return (
        <>
            <div data-crewhrm-selector="careers-header">
                <CoverImage
                    src={hero}
                    style={{ minHeight: '355px' }}
                    className={'padding-15 text-align-center'.classNames()}
                >
                    <span
                        className={'d-block font-size-38 font-weight-500 line-height-24 letter-spacing--38 color-white padding-vertical-50 margin-top-25 margin-bottom-25'.classNames()}
                    >
                        {__('Small teams, global mission')}
                    </span>
                </CoverImage>
            </div>
            <div
                data-crewhrm-selector="job-listing"
                className={'listing'.classNames(style)}
                style={{ marginTop: '59px' }}
            >
                <div data-crewhrm-selector="sidebar" className={'sidebar'.classNames(style)}>
                    <div>
                        {Object.keys(filterList).map((filter_key) => {
                            let {
                                section_label,
                                selection_type,
                                options = []
                            } = filterList[filter_key];

                            return (
                                <div
                                    key={filter_key}
                                    className={'margin-bottom-23 overflow-auto'.classNames()}
                                >
                                    <span
                                        className={'d-block font-size-14 font-weight-700 line-height-24 letter-spacing--14 color-text-light margin-bottom-16'.classNames()}
                                    >
                                        {section_label}
                                    </span>

                                    {(selection_type == 'list' &&
                                        options.map((option) => {
                                            let { id, label, count } = option;
                                            let is_active = state.filters[filter_key] === id;
                                            return (
                                                <span
                                                    key={id}
                                                    className={`d-block font-size-14 cursor-pointer margin-bottom-18 ${
                                                        is_active
                                                            ? 'font-weight-600 color-text'
                                                            : 'font-weight-500 color-text-light'
                                                    }`.classNames()}
                                                    onClick={() => setFilter(filter_key, id)}
                                                >
                                                    {label} {(count && `(${count})`) || null}
                                                </span>
                                            );
                                        })) ||
                                        null}

                                    {(selection_type == 'tag' && (
                                        <div>
                                            <TagField
                                                theme="tag"
                                                behavior="radio"
                                                options={options}
                                                value={state.filters.location}
                                                onChange={(v) => setFilter('location', v)}
                                            />
                                        </div>
                                    )) ||
                                        null}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div
                    data-crewhrm-selector="listing"
                    className={'content-area'.classNames(style) + 'flex-1'.classNames()}
                >
                    <TextField
                        placeholder={__('Search Keywords')}
                        iconClass={'ch-icon ch-icon-search-normal-1'.classNames()}
                        className={'padding-vertical-10 padding-horizontal-11 border-1 b-color-tertiary b-color-active-primary border-radius-5'.classNames()}
                    />

                    {jobs.map((job) => {
                        const { job_id, job_title, location } = job;
                        const meta = [job_title, location].filter((m) => m != undefined);

                        return (
                            <div
                                key={job_id}
                                className={
                                    'single-job'.classNames(style) +
                                    'd-flex align-items-center padding-15 margin-bottom-20 border-radius-5'.classNames()
                                }
                                onMouseOver={() => setState({ ...state, hovered_job: job_id })}
                                onMouseOut={() => setState({ ...state, hovered_job: null })}
                            >
                                <div className={'flex-1'.classNames()}>
                                    <span
                                        className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text'.classNames()}
                                    >
                                        {job_title}
                                    </span>
                                    <span
                                        className={'font-size-13 font-weight-400 line-height-24 letter-spacing--13 color-text-light'.classNames()}
                                    >
                                        {meta.map((m, i) => {
                                            return (
                                                <span key={i}>
                                                    {m}
                                                    {i < meta.length - 1 ? (
                                                        <span
                                                            className={'d-inline-block padding-horizontal-4'.classNames()}
                                                        >
                                                            &middot;
                                                        </span>
                                                    ) : null}
                                                </span>
                                            );
                                        })}
                                    </span>
                                </div>
                                <div>
                                    <Link
                                        to={`/${base_permalink}/${job_id}/`}
                                        className={`button button-primary ${
                                            state.hovered_job !== job_id ? 'button-outlined' : ''
                                        } button-medium-2`.classNames()}
                                    >
                                        {__('Apply')}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}

                    <div
                        data-crewhrm-selector="loading"
                        className={'text-align-center'.classNames()}
                    >
                        <LoadingIcon />
                        <div
                            className={'font-size-13 font-weight-400 line-height-21 color-text-light margin-top-8'.classNames()}
                        >
                            {__('Loading More...')}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
