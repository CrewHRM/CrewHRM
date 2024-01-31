import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import { statuses } from 'crewhrm-materials/data.jsx';

import { ContextBackendDashboard } from '../../../dashboard/home.jsx';

import style from '../jobs.module.scss';

export const status_keys = Object.keys(statuses);

export function FilterBar({ is_overview, filters = {}, onChange, fetching }) {
    const { departments = [] } = useContext(ContextBackendDashboard);
	const [keyWord, setKeyword] = useState('');
	
	useEffect(()=>onChange('search', keyWord), [keyWord]);

    return (
        <div
            className={
                'd-flex align-items-center justify-content-end flex-wrap-wrap margin-bottom-20'.classNames() +
                'filter'.classNames(style)
            }
        >
            <div className={'flex-1 d-flex align-items-center white-space-nowrap'.classNames()}>
                <Conditional show={!is_overview}>
                    <Link to="/dashboard/">
                        <i
                            className={
                                'ch-icon ch-icon-arrow-left color-text cursor-pointer'.classNames() +
                                'back-icon'.classNames(style)
                            }
                        ></i>
                    </Link>
                </Conditional>

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
					<LoadingIcon show={fetching} className={'margin-left-5'.classNames()} />
                </span>
            </div>
            <div className={'d-flex align-items-center justify-content-end flex-wrap-wrap column-gap-15'.classNames()}>
                <div className={'d-inline-block'.classNames()} style={{ minWidth: '113px' }}>
                    <DropDown
                        className={'padding-vertical-8 padding-horizontal-15'.classNames()}
                        transparent={is_overview}
                        placeholder={__('All Departments')}
                        value={filters.department_id}
                        onChange={(v) => onChange('department_id', v)}
                        options={[
                            {
                                id: 0,
                                label: __('All Departments')
                            },
                            ...departments.map((d) => {
                                return {
                                    id: d.department_id,
                                    label: d.department_name
                                };
                            })
                        ]}
                        variant="borderless"
						iconSizeClass={'font-size-18'.classNames()}
                    />
                </div>
                <div className={'d-inline-block'.classNames()} style={{ minWidth: '113px' }}>
                    <DropDown
                        className={'padding-vertical-8 padding-horizontal-15'.classNames()}
                        transparent={is_overview}
                        placeholder={__('All Status')}
                        value={filters.job_status}
                        onChange={(v) => onChange('job_status', v)}
                        options={[
                            { id: 0, label: __('All Status') },
                            ...status_keys.map((key) => {
                                return {
                                    id: key,
                                    label: statuses[key].label
                                };
                            })
                        ]}
                        variant="borderless"
						iconSizeClass={'font-size-18'.classNames()}
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
                        onChange={setKeyword}
                    />
                </div>
            </div>
        </div>
    );
}
