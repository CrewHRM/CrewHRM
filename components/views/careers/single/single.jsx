import React from 'react';
import { Link } from 'react-router-dom';

import { __ } from '../../../utilities/helpers.jsx';
import style from './single.module.scss';
import { DangerouslySet } from '../../../materials/DangerouslySet.jsx';

function RenderMeta({ icon, hint, content }) {
    return (
        <div>
            <i className={`ch-icon ch-icon-${icon} font-size-16 color-text-light`.classNames()}></i>
            <span
                className={'d-block font-size-13 font-weight-500 line-height-25 color-text-light margin-top-8 margin-bottom-2'.classNames()}
            >
                {hint}
            </span>
            <span
                className={'font-size-17 font-weight-500 line-height-25 color-primary'.classNames()}
            >
                {content}
            </span>
        </div>
    );
}

export function Single({ job, about_company }) {
    const { department, job_id, job_title, job_type, job_description, location, salary } = job;

    return (
        <div className={'single'.classNames(style)}>
            <div className={'header'.classNames(style) + 'bg-color-tertiary'.classNames()}>
                <div className={'container'.classNames(style)}>
                    <span
                        className={'d-block font-size-15 font-weight-700 line-height-25 letter-spacing_3 color-primary margin-bottom-10'.classNames()}
                    >
                        {department}
                    </span>
                    <span
                        className={'d-block font-size-38 font-weight-600 line-height-24 letter-spacing--38 color-primary'.classNames()}
                    >
                        {job_title}
                    </span>
                </div>
            </div>
            <div className={'details'.classNames(style)}>
                <div className={'container'.classNames(style)}>
                    <div
                        className={'d-flex align-items-center justify-content-space-between padding-vertical-20 padding-horizontal-30 bg-color-white border-radius-10 box-shadow-thick'.classNames()}
                        style={{ marginTop: '-51px', marginBottom: '79px' }}
                    >
                        <RenderMeta
                            icon={'ch-icon-location'}
                            hint={__('Location')}
                            content={location}
                        />
                        <RenderMeta
                            icon={'ch-icon-briefcase'}
                            hint={__('Job Type')}
                            content={job_type}
                        />
                        <RenderMeta
                            icon={'ch-icon-empty-wallet'}
                            hint={__('Salary')}
                            content={salary}
                        />
                        <div className={'align-self-center'.classNames()}>
                            <Link className={'button button-primary'.classNames()}>
                                {__('Apply Now')}
                            </Link>
                        </div>
                    </div>

                    <div className={'margin-bottom-32'.classNames()}>
                        <span
                            className={'d-block font-size-17 font-weight-600 line-height-24 color-black margin-bottom-12'.classNames()}
                        >
                            {__('About Company')}
                        </span>
                        <DangerouslySet className={'font-weight-400 color-black'.classNames()}>
                            {about_company}
                        </DangerouslySet>
                    </div>

                    <div className={'margin-bottom-32'.classNames()}>
                        <span
                            className={'d-block font-size-17 font-weight-600 line-height-24 color-black margin-bottom-12'.classNames()}
                        >
                            {__('Job Description')}
                        </span>
                        <DangerouslySet className={'font-weight-400 color-black'.classNames()}>
                            {job_description}
                        </DangerouslySet>
                    </div>

                    <div>
                        <Link
                            to={`/${job_id}/apply/`}
                            className={'button button-primary button-full-width'.classNames()}
                        >
                            {__('Apply Now')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
