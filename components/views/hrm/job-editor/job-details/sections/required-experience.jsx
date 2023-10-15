import React, { useContext } from 'react';

import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { experience_levels } from 'crewhrm-materials/data.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';

import { field_label_class, section_title_class } from '../job-details.jsx';
import { ContextJobEditor } from '../../index.jsx';

import style from '../details.module.scss';

export function Experience() {
    const { values, onChange } = useContext(ContextJobEditor);

    return (
        <>
            {/* Experience */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <span className={section_title_class}>{__('Experience')}</span>
                </div>
            </div>

            {/* Experience level and duration */}
            <div className={'d-flex'.classNames()}>
                <div className={'flex-1 d-flex'.classNames()}>
                    <div className={'flex-1 margin-right-10'.classNames()}>
                        <span className={field_label_class + 'white-space-nowrap'.classNames()}>
                            {__('Experience Level')}
                        </span>
                        <DropDown
                            value={values.experience_level}
                            onChange={(v) => onChange('experience_level', v)}
                            options={Object.keys(experience_levels).map((l) => {
                                return { id: l, label: experience_levels[l] };
                            })}
                        />
                    </div>
                    <div className={'flex-1 margin-left-10'.classNames()}>
                        <span className={field_label_class + 'white-space-nowrap'.classNames()}>
                            {__('Years of Experience')}
                        </span>
                        <TextField
                            placeholder={__('ex 2-3 Years')}
                            value={values.experience_years || ''}
                            onChange={v => onChange('experience_years', v)}
                        />
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}></div>
            </div>
        </>
    );
}
