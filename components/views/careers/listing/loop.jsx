import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { __, getAddress } from 'crewhrm-materials/helpers.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import { employment_types } from 'crewhrm-materials/data.jsx';

import style from './listing.module.scss';

export function CareersLoop({ jobs, base_permalink }) {
    const [state, setState] = useState({
        hovered_job: null
    });

    return jobs?.map((job) => {
        const { job_id, job_title, employment_type, city, province, street_address, country_code } = job;

        const meta = [
            getAddress({
				city, 
				province: !city ? province : null,
				street_address: (!city && !province) ? street_address : null,
				country_code
			}),
            employment_types[employment_type]
        ].filter((m) => m);

        return (
            <div
                key={job_id}
                className={
                    'single-job'.classNames(style) +
                    'd-flex align-items-center column-gap-10 padding-vertical-12 padding-horizontal-15 margin-bottom-20 border-radius-5'.classNames()
                }
                onMouseOver={() => setState({ ...state, hovered_job: job_id })}
                onMouseOut={() => setState({ ...state, hovered_job: null })}
            >
                <div className={'flex-1'.classNames()}>
                    <span
                        className={'d-block font-size-17 font-weight-600 line-height-15 letter-spacing--17 color-text'.classNames()}
                    >
                        {job_title}
                    </span>
                    <span
                        className={'font-size-13 font-weight-400 line-height-15 letter-spacing--13 color-text-light'.classNames()}
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
