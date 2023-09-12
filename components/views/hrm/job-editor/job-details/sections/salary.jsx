import React, { useContext } from 'react';

import { __ } from '../../../../../utilities/helpers.jsx';
import { field_label_class, input_class, section_title_class } from '../job-details.jsx';
import style from '../details.module.scss';
import { DropDown } from '../../../../../materials/dropdown/dropdown.jsx';
import { TagField } from '../../../../../materials/tag-field/tag-field.jsx';
import { ContextJobEditor } from '../../index.jsx';

const salary_types = {
    hourly: __('Hourly'),
    daily: __('Daily'),
    weekly: __('Weekly'),
    monthly: __('Monthly'),
    yearly: __('Yearly')
};

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
                        options={Object.keys(salary_types).map((type) => {
                            return { id: type, label: salary_types[type] };
                        })}
                        onChange={(value) => onChange('salary_basis', value)}
                        fullWidth={true}
                        className={'margin-bottom-30'.classNames()}
                    />

                    {/* Salary and Currency */}
                    <div className={'d-flex'.classNames()}>
                        <div className={'flex-1 margin-right-10'.classNames()}>
                            <span className={field_label_class + 'white-space-nowrap'.classNames()}>
                                {__('Currency')}
                            </span>
                            <DropDown
                                value={values.currency}
                                options={Intl.supportedValuesOf('currency').map((c) => {
                                    return { id: c, label: c };
                                })}
                                onChange={(v) => onChange('currency', v)}
                                className={input_class}
                            />
                        </div>
                        <div className={'flex-1 margin-left-10'.classNames()}>
                            <span className={field_label_class}>{__('Salary')}</span>
                            <input
                                className={input_class}
                                placeholder={__('ex 70000-90000')}
                                value={values.salary || ''}
                                onChange={(e) => onChange('salary', e.currentTarget.value)}
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
