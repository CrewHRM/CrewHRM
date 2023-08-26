import React from 'react';

import curtains from '../../../../../images/curtains.svg';
import style from './cards.module.scss';
import { __ } from '../../../../../utilities/helpers.jsx';

const card_stats = [
    {
        label: __('Total Job Posts'),
        count: 12,
        icon: curtains
    },
    {
        label: __('Total Applicants'),
        count: 1232,
        icon: curtains
    },
    {
        label: __('Total Hired'),
        count: 32,
        icon: curtains
    },
    {
        label: __('Total Pending'),
        count: 233,
        icon: curtains
    }
];

export function StatCards({ className = '' }) {
    return (
        <div
            data-crewhrm-selector="hrm-stat"
            className={'card-wrapper'.classNames(style) + className}
        >
            {card_stats.map((stat) => {
                let { label, count, icon } = stat;

                return (
                    <div
                        key={label}
                        className={
                            'card'.classNames(style) +
                            'd-flex flex-direction-column justify-content-space-between box-shadow-thin border-radius-5 padding-25'.classNames()
                        }
                    >
                        <img src={icon} className={'width-24'.classNames()} />
                        <div>
                            <span
                                className={'d-block margin-bottom-12 font-size-28 font-weight-700 color-primary'.classNames()}
                            >
                                {count}
                            </span>
                            <span
                                className={'d-block font-size-15 font-weight-500 color-text-light'.classNames()}
                            >
                                {label}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
