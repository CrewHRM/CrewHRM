import React, { useContext } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TagField } from 'crewhrm-materials/tag-field/tag-field.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { salary_types } from 'crewhrm-materials/data.jsx';

import { ContextJobEditor } from '../../index.jsx';
import { field_label_class, section_title_class } from '../job-details.jsx';

import style from '../details.module.scss';

export function Salary() {
    const { values = {}, onChange } = useContext(ContextJobEditor);

    return (
        <>
            {/* Salary details */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <span className={section_title_class}>{__('Salary')}</span>
                </div>
            </div>

            {/* Salary type */}
            <span className={field_label_class}>{__('Salary Type')}</span>
            <div className={'d-flex margin-bottom-40'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    {/* Employment type */}
                    <TagField
                        theme="button"
                        behavior="radio"
                        value={values.salary_basis}
                        onChange={(value) => onChange('salary_basis', value)}
                        fullWidth={true}
                        className={'margin-bottom-30'.classNames()}
                        options={Object.keys(salary_types).map((type) => {
                            return { 
								id: type, 
								label: __(salary_types[type])
							};
                        })}
                    />

                    {/* Salary and Currency */}
                    <div className={'d-flex'.classNames()}>
                        <div className={'flex-1 margin-right-10'.classNames()}>
                            <span className={field_label_class + 'white-space-nowrap'.classNames()}>
                                {__('Currency')}
                            </span>
                            <DropDown
                                value={values.currency}
                                onChange={(v) => onChange('currency', v)}
                                options={Intl.supportedValuesOf('currency').map((c) => {
                                    return { 
										id: c, 
										label: c 
									};
                                })}
                            />
                        </div>
                        <div className={'flex-1 margin-left-10'.classNames()}>
                            <span className={field_label_class}>{__('Salary')}</span>
                            <TextField
                                placeholder={__('ex 70000-90000')}
                                value={values.salary || ''}
                                onChange={v => onChange('salary', v)}
                            />
                        </div>
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}>
                    <span className={'font-size-13 font-weight-400 color-text-light'.classNames()}>
                        {__(
                            'Adding the salary here will improve performance on some job boards. You can also include the salary in the job description'
                        )}
                    </span>
                </div>
            </div>
        </>
    );
}
