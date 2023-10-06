import React, { useContext } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { countries_array, attendance_types } from 'crewhrm-materials/data.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TagField } from 'crewhrm-materials/tag-field/tag-field.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';

import { section_title_class, field_label_class } from '../job-details.jsx';
import { ContextJobEditor } from '../../index.jsx';

import style from '../details.module.scss';

export function Location() {
    const { values, onChange } = useContext(ContextJobEditor);

    return (
        <>
            {/* Location */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <span className={section_title_class}>{__('Location')}</span>
                </div>
            </div>

            {/* Job Locations */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <span className={field_label_class}>{__('Job Location type')}</span>
                    <TagField
                        theme="button-control"
                        behavior="checkbox"
                        value={values.attendance_type || []}
                        onChange={(types) => onChange('attendance_type', types)}
                        options={Object.keys(attendance_types).map((a) => {
                            return {
                                id: a,
                                label: attendance_types[a]
                            };
                        })}
                    />
                </div>
                <div className={'right-col'.classNames(style)}></div>
            </div>

            {/* Job Title */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <span className={field_label_class}>{__('Street Address')}</span>
                    <div>
                        <TextField
                            placeholder={__('ex. New York, NY 00010, USA')}
                            value={values.street_address || ''}
                            onChange={v=> onChange('street_address', v)}
                        />
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}>
                    <span className={field_label_class}>&nbsp;</span>
                    <span className={'font-size-13 font-weight-400 color-text-light'.classNames()}>
                        {__('Use a location to attract the most appropriate candidates')}
                    </span>
                </div>
            </div>

            {/* Job Title */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1 d-flex'.classNames()}>
                    <div className={'flex-1 margin-right-10'.classNames()}>
                        <span className={field_label_class + 'white-space-nowrap'.classNames()}>
                            {__('Zip/Postal Code')}
                        </span>
                        <TextField
                            placeholder={__('ex. NY 00010')}
                            value={values.zip_code || ''}
                            onChange={v => onChange('zip_code', v)}
                        />
                    </div>
                    <div className={'flex-1 margin-left-10'.classNames()}>
                        <span className={field_label_class}>{__('Country')}</span>
                        <DropDown
                            value={values.country_code}
                            options={countries_array}
                            onChange={(v) => onChange('country_code', v)}
                        />
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}></div>
            </div>
        </>
    );
}
