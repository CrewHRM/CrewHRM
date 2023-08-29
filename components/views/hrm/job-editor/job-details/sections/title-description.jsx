import React, { useContext, useState } from 'react';
import {
    field_label_class,
    input_class,
    section_title_class
} from '../job-details.jsx';
import { DropDown } from '../../../../../materials/dropdown/dropdown.jsx';
import { __ } from '../../../../../utilities/helpers.jsx';
import { TextField } from '../../../../../materials/text-field/text-field.jsx';
import { CircularProgress } from '../../../../../materials/circular.jsx';
import { TextEditor } from '../../../../../materials/text-editor/text-editor.jsx';
import { ContextBackendDashboard } from '../../../hrm.jsx';
import { ContextJobEditor } from '../../index.jsx';

import style from '../details.module.scss';

export function TitleAndDescription() {
    const { values, onChange } = useContext(ContextJobEditor);
	const {departments, addDepartment} = useContext(ContextBackendDashboard);
	
	const title_allowed_length = 200;
    const job_title_length = values.job_title?.length || 0;

    return (
        <>
            {/* Form intro */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <span className={section_title_class}>{__('Title & Description')}</span>
                </div>
                <div className={'right-col'.classNames(style)}>
                    <i
                        className={'ch-icon ch-icon-lamp-charge font-size-20 color-text margin-right-4 vertical-align-middle'.classNames()}
                    ></i>{' '}
                    <span className={'font-size-13 font-weight-400 color-text'.classNames()}>
                        {__('Tips')}
                    </span>
                </div>
            </div>

            {/* Job Title */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <div className={'d-flex'.classNames()}>
                        <div className={'flex-1'.classNames()}>
                            <span className={field_label_class}>
                                {__('Job Title')}
                                <span className={'color-danger'.classNames()}>*</span>
                            </span>
                        </div>
                        <div className={'d-flex align-items-center'.classNames()}>
                            <CircularProgress
                                percentage={(job_title_length / title_allowed_length) * 100}
                            />
                            <span
                                className={'d-inline-block font-size-13 font-weight-500 line-height-21 color-text-light margin-left-5'.classNames()}
                            >
                                {title_allowed_length - job_title_length}
                            </span>
                        </div>
                    </div>
                    <div>
                        <TextField
                            iconClass={
                                (job_title_length &&
                                    'ch-icon ch-icon-times font-size-20 color-tertiary cursor-pointer'.classNames()) ||
                                null
                            }
                            icon_position="right"
                            placeholder={__('ex. Product designer, Account manager')}
                            value={values.job_title}
                            onChange={(v) => onChange('job_title', v)}
                            onIconClick={(refocus) => {
                                onChange('job_title', '');
                                refocus();
                            }}
                            className={input_class}
                            maxLength={title_allowed_length}
                        />
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}>
                    <span className={field_label_class}>&nbsp;</span>
                    <span className={'font-size-13 font-weight-400 color-text-light'.classNames()}>
                        {__('Use common job titles for searchability')}
                    </span>
                </div>
            </div>

            {/* Department and internal job code */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <div className={'d-flex'.classNames()}>
                        <div className={'flex-1 margin-right-10'.classNames()}>
                            <span className={field_label_class}>
                                {__('Department')}
                                <span className={'color-danger'.classNames()}>*</span>
                            </span>
                            <DropDown
                                value={values.department_id}
                                options={departments}
                                onChange={(v) => onChange('department_id', v)}
                                className={input_class}
                                tabindex={2}
                                addText={__('Add Depertment')}
                                onAddClick={() => addDepartment(id=>onChange('department_id', id))}
                                textClassName={'font-size-17 font-weight-500 line-height-25 color-text-light'.classNames()}
                            />
                        </div>
                        <div className={'flex-1 margin-left-10'.classNames()}>
                            <span className={field_label_class}>{__('Internal Job code')}</span>
                            <input
                                type="text"
                                placeholder={__('ex. 001')}
                                className={input_class}
                                onChange={(e) => onChange('job_code', e.currentTarget.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}></div>
            </div>

            {/* Job Description* */}
            <span className={field_label_class}>
                {__('Job Description')}
                <span className={'color-danger'.classNames()}>*</span>
            </span>
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <TextEditor
                        onChange={(v) => console.log(v)}
                        placeholder={__(
                            'Enter your job description here; include key areas responsibility and specific qualification needed to perform the role. '
                        )}
                    />
                </div>
                <div className={'right-col'.classNames(style)}>
                    <span
                        className={'d-block font-size-13 font-weight-400 color-text-light margin-bottom-36'.classNames()}
                    >
                        {__('Format into sections and lists to improve readability')}
                    </span>
                    <span className={'font-size-13 font-weight-400 color-text-light'.classNames()}>
                        {__(
                            'Avoid targeting specific demographics e.g. gender, nationality and age'
                        )}
                    </span>
                </div>
            </div>
        </>
    );
}
