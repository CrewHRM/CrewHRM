import React from 'react';

import style from '../jobs.module.scss';
import { Link } from 'react-router-dom';
import { __, countries_array } from '../../../../../utilities/helpers.jsx';
import { DropDown } from '../../../../../materials/dropdown/dropdown.jsx';
import { status_keys, statuses } from '../jobs.jsx';
import { TextField } from '../../../../../materials/text-field/text-field.jsx';

export function FilterBar({ is_overview, filters = {}, onChange }) {
    return (
        <div
            className={
                'd-flex align-items-center margin-bottom-20'.classNames() +
                'filter'.classNames(style)
            }
        >
            <div className={'flex-1 d-flex align-items-center'.classNames()}>
                {(!is_overview && (
                    <Link to="/dashboard/">
                        <i
                            className={
                                'ch-icon ch-icon-arrow-left color-text cursor-pointer'.classNames() +
                                'back-icon'.classNames(style)
                            }
                        ></i>
                    </Link>
                )) ||
                    null}
                <span
                    className={
                        'color-text ' +
                        (is_overview
                            ? 'font-size-17 font-weight-500'
                            : 'font-size-24 font-weight-600'
                        ).classNames()
                    }
                >
                    {__('Job Openings')}
                </span>
            </div>
            <div className={'d-flex align-items-center column-gap-15'.classNames()}>
                <div className={'d-inline-block'.classNames()} style={{ minWidth: '113px' }}>
                    <DropDown
                        className={'padding-vertical-8 padding-horizontal-15'.classNames()}
                        transparent={is_overview}
                        placeholder={__('All Location')}
                        value={filters.country_code}
                        options={countries_array}
                        onChange={(v) => onChange('country_code', v)}
                    />
                </div>
                <div className={'d-inline-block'.classNames()} style={{ minWidth: '113px' }}>
                    <DropDown
                        className={'padding-vertical-8 padding-horizontal-15'.classNames()}
                        transparent={is_overview}
                        placeholder={__('Department')}
                        value={filters.job_status}
                        options={status_keys.map((key) => {
                            return { id: key, label: statuses[key].label };
                        })}
                        onChange={(v) => onChange('job_status', v)}
                    />
                </div>
                <div className={'d-inline-block'.classNames()}>
                    <TextField
                        className={`border-radius-5 border-1 height-34 padding-8 b-color-tertiary ${
                            is_overview ? 'bg-color-transparent' : ' bg-color-white'
                        }`.classNames()}
                        iconClass={'ch-icon ch-icon-search-normal-1 font-size-18 color-text cursor-pointer'.classNames()}
                        icon_position="right"
                        expandable={true}
                        value={filters.search}
                        onChange={(v) => onChange('search', v)}
                    />
                </div>
            </div>
        </div>
    );
}
