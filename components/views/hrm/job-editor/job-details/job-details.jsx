import React, { createContext, useContext, useState } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { TitleAndDescription } from './sections/title-description.jsx';
import { EmploymentDetails } from './sections/employment-details.jsx';
import { Experience } from './sections/required-experience.jsx';

import style from './details.module.scss';
import { Salary } from './sections/salary.jsx';
import { Location } from './sections/location.jsx';
import { FormActionButtons } from 'crewhrm-materials/form-action.jsx';
import { ContextJobEditor } from '../index.jsx';

export const textarea_class =
    'padding-vertical-15 padding-horizontal-20 border-radius-10 border-1-5 b-color-tertiary b-color-active-primary width-p-100 d-block font-size-15 font-weight-400 line-height-25 color-text'.classNames();
export const section_title_class =
    'font-size-20 font-weight-600 color-text color-text'.classNames();
export const field_label_class =
    'd-block font-size-15 font-weight-500 color-text margin-bottom-10'.classNames();

export function JobDetails() {
    const { navigateTab, is_next_disabled } = useContext(ContextJobEditor);

    return (
        <div className={'job-details'.classNames(style)}>
            {/* Job Details sections */}
            <div className={'margin-bottom-40'.classNames()}>
                <TitleAndDescription />
            </div>
            <div className={'margin-bottom-40'.classNames()}>
                <EmploymentDetails />
            </div>
            <div className={'margin-bottom-40'.classNames()}>
                <Experience />
            </div>
            <div className={'margin-bottom-40'.classNames()}>
                <Salary />
            </div>
            <div className={'margin-bottom-40'.classNames()}>
                <Location />
            </div>

            {/* Action Button */}
            <div className={'d-flex margin-bottom-10'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <FormActionButtons
                        onNext={() => navigateTab(1)}
                        disabledNext={is_next_disabled}
                    />
                </div>
                <div className={'right-col'.classNames(style)}></div>
            </div>
        </div>
    );
}
