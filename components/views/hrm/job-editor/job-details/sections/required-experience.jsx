import React, { useContext } from 'react';

import { DropDown } from '../../../../../materials/dropdown/dropdown.jsx';
import { __ } from '../../../../../utilities/helpers.jsx';
import {
    input_class,
    field_label_class,
    section_title_class
} from '../job-details.jsx';
import style from '../details.module.scss';
import { ContextJobEditor } from '../../index.jsx';

const experience_levels = {
    beginner: __('Beginner'),
    intermidiate: __('Intermidiate'),
    adanced: __('Advanced')
};

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
                            options={Object.keys(experience_levels).map((l) => {
                                return { id: l, label: experience_levels[l] };
                            })}
                            onChage={(v) => onChange('experience_level', v)}
                            className={input_class}
                        />
                    </div>
                    <div className={'flex-1 margin-left-10'.classNames()}>
                        <span className={field_label_class + 'white-space-nowrap'.classNames()}>
                            {__('Years of Experience')}
                        </span>
                        <input placeholder={__('ex 2-3 Years')} className={input_class} />
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}></div>
            </div>
        </>
    );
}
