import React from 'react';

import img from '../../../../../images/no-job.svg';
import { __ } from '../../../../../utilities/helpers.jsx';

export function NoJob() {
    return (
        <div
            data-crewhrm-selector="no-job-openings"
            className={'bg-color-white text-align-center padding-30 border-radius-5'.classNames()}
        >
            <img src={img} />
            <div
                className={'color-text-light margin-top-10 margin-bottom-10 font-size-20 font-weight-600'.classNames()}
            >
                {__('Well done')}
            </div>
            <div>
                <span
                    className={'font-size-15'.classNames()}
                    style={{ color: 'rgba(26, 38, 58, 0.70)' }}
                >
                    {__('There are no job post')}
                </span>
                ,&nbsp;
                <a
                    href="#"
                    className={'color-text-light font-size-16 font-weight-400'.classNames()}
                >
                    {__('Add Now')}
                </a>
            </div>
        </div>
    );
}
