import React, { useContext } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { ContextBackendDashboard } from '../../../hrm.jsx';

import icon_learning from 'crewhrm-materials/static/images/Icon-learning.svg';
import icon_users from 'crewhrm-materials/static/images/Icon-users.svg';
import icon_essential from 'crewhrm-materials/static/images/Icon-essential.svg';
import icon_time from 'crewhrm-materials/static/images/Icon-time.svg';

import style from './cards.module.scss';

export function StatCards({ className = '' }) {
    const {
        applicationStats: {
            total_jobs = 0,
            total_applications = 0,
            total_pending_applications = 0,
            total_hired = 0
        }
    } = useContext(ContextBackendDashboard);

    const card_stats = [
        {
            label: __('Total Job Posts'),
            count: __(total_jobs),
            icon: icon_learning
        },
        {
            label: __('Total Applications'),
            count: __(total_applications),
            icon: icon_users
        },
        {
            label: __('Total Hired'),
            count: __( total_hired ),
            icon: icon_essential
        },
        {
            label: __('Total Pending'),
            count: __( total_pending_applications ),
            icon: icon_time
        }
    ];

    return (
        <div
            data-crew="hrm-stat"
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
                                className={'d-block margin-bottom-12 font-size-28 font-weight-700 color-text'.classNames()}
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
