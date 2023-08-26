import React from 'react';

import style from './listing.module.scss';
import { Link } from 'react-router-dom';
import { __ } from '../../../utilities/helpers.jsx';
import { LoadingIcon } from '../../../materials/loading-icon/loading-icon.jsx';
import { TextField } from '../../../materials/text-field/text-field.jsx';
import { CoverImage } from '../../../materials/image/image.jsx';

import hero from '../../../images/hero.png';

export function Listing({ setFilter, jobs, filters, filterList }) {
    return (
        <>
            <div data-crewhrm-selector="careers-header">
                <CoverImage src={hero} width="100%" className={'padding-vertical'}>
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
                    <div className={'margin-right-50'.classNames()}>
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
                                            let is_active = filters[filter_key] === id;
                                            return (
                                                <span
                                                    key={id}
                                                    className={`d-block font-size-14 cursor-pointer margin-bottom-18 ${
                                                        is_active
                                                            ? 'font-weight-600 color-primary'
                                                            : 'font-weight-500 color-text-light'
                                                    }`.classNames()}
                                                    onClick={() => setFilter(filter_key, id)}
                                                >
                                                    {label} ({count})
                                                </span>
                                            );
                                        })) ||
                                        null}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div data-crewhrm-selector="listing" className={'content-area'.classNames(style)}>
                    <TextField
                        iconClass={'ch-icon ch-icon-search-normal-1'.classNames()}
                        className={'padding-vertical-10 padding-horizontal-11 border-1 b-color-tertiary b-color-active-primary border-radius-5'.classNames()}
                    />

                    {jobs.map((job) => {
                        const { job_id, job_title, location } = job;
                        const meta = [job_title, location].filter((m) => m != undefined);

                        return (
                            <div
                                className={'d-flex align-items-center padding-15 margin-bottom-20'.classNames()}
                            >
                                <div className={'flex-1'.classNames()}>
                                    <span
                                        className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-primary margin-bottom-10'.classNames()}
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
                                        to={`/${job_id}/`}
                                        className={'button button-primary button-outlined button-medium-2'.classNames()}
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
