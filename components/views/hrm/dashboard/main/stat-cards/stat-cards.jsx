import React, { useContext } from 'react';

import { __ } from '../../../../../utilities/helpers.jsx';
import { ContextBackendDashboard } from '../../../hrm.jsx';

import curtains from '../../../../../images/curtains.svg';
import style from './cards.module.scss';

export function StatCards({ className = '' }) {

	const {
		applicationStats:{
			total_jobs = 0,
			total_applications = 0,
			total_pending_applications = 0,
			total_hired = 0
		}
	} = useContext(ContextBackendDashboard);

	const card_stats = [
		{
			label: __('Total Job Posts'),
			count: total_jobs,
			icon: curtains
		},
		{
			label: __('Total Applications'),
			count: total_applications,
			icon: curtains
		},
		{
			label: __('Total Hired'),
			count: total_hired,
			icon: curtains
		},
		{
			label: __('Total Pending'),
			count: total_pending_applications,
			icon: curtains
		}
	];

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
