import React, { useContext } from 'react';

import { __, formatDate, getLastOfDay, getUnixTimestamp } from 'crewhrm-materials/helpers.jsx';
import { NumberField } from 'crewhrm-materials/number-field';
import { DateField } from 'crewhrm-materials/date-time.jsx';
import { TagField } from 'crewhrm-materials/tag-field/tag-field.jsx';
import { employment_types } from 'crewhrm-materials/data.jsx';

import { section_title_class, field_label_class } from '../job-details.jsx';
import { ContextJobEditor } from '../../index.jsx';

import style from '../details.module.scss';

export function EmploymentDetails(props) {
    const { values, onChange } = useContext(ContextJobEditor);

    return (
        <>
            {/* Employment details */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <span className={section_title_class}>{__('Employment details')}</span>
                </div>
            </div>

            {/* Employment type, vacancy and application_deadline */}
            <span className={field_label_class}>{__('Choose employment type')}</span>
            <div className={'d-flex'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    {/* Employment type */}
                    <TagField
                        value={values.employment_type}
                        behavior="radio"
                        theme="button"
                        options={Object.keys(employment_types).map((type) => {
                            return {
                                id: type,
                                label: employment_types[type]
                            };
                        })}
                        onChange={(type) => onChange('employment_type', type)}
                        fullWidth={true}
                        className={'margin-bottom-30'.classNames()}
                    />

                    {/* Vacancy and Deadline */}
                    <div className={'d-flex'.classNames()}>
                        <div className={'margin-right-20'.classNames()} style={{ width: '130px' }}>
                            <span className={field_label_class + 'white-space-nowrap'.classNames()}>
                                {__('Number of Vacancy')}
                            </span>
                            <NumberField
                                min={1}
                                value={values.vacancy || 1}
                                onChange={(v) => onChange('vacancy', v)}
                            />
                        </div>
                        <div className={'flex-1'.classNames()}>
                            <span className={field_label_class}>
								{__('Submission Deadline')}
							</span>
                            <DateField
                                value={values.application_deadline ? formatDate( values.application_deadline, 'Y-m-d' ) : ''}
                                onChange={(v) => onChange('application_deadline', getUnixTimestamp( getLastOfDay( new Date( v ) ) ) )}
                            />
                        </div>
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}>
                    <span className={'font-size-13 font-weight-400 color-text-light'.classNames()}>
                        {__(
                            "Include as many details as possible to boost the job's performance on some job boards"
                        )}
                    </span>
                </div>
            </div>
        </>
    );
}
