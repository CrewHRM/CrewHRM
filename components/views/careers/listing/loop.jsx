import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { __, getAddress } from '../../../utilities/helpers.jsx';
import { Conditional } from '../../../materials/conditional.jsx';

import style from './listing.module.scss';
import { employment_types } from '../../hrm/job-editor/job-details/sections/employment-details.jsx';

export function CareersLoop({ jobs, base_permalink }) {
    const [state, setState] = useState({
        hovered_job: null
    });

    return jobs?.map((job) => {
        const { job_id, job_title, meta: job_meta = {} } = job;

        const meta = [
            job_title,
            getAddress(job),
            employment_types[job_meta?.employment_type]
        ].filter((m) => m);

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
                                    <Conditional show={i < meta.length - 1}>
                                        <span
                                            className={'d-inline-block padding-horizontal-4'.classNames()}
                                        >
                                            &middot;
                                        </span>
                                    </Conditional>
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
    });
}
