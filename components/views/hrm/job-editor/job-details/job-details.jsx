import React, { createContext, useState } from 'react';

import { __ } from '../../../../utilities/helpers.jsx';
import { TitleAndDescription } from './sections/title-description.jsx';
import { EmploymentDetails } from './sections/employment-details.jsx';
import { Experience } from './sections/required-experience.jsx';

import style from './details.module.scss';
import { Salary } from './sections/salary.jsx';
import { Location } from './sections/location.jsx';
import { FormActionButtons } from '../../../../materials/form-action.jsx';

export const textarea_class =
    'padding-vertical-15 padding-horizontal-20 border-radius-10 border-1-5 b-color-tertiary b-color-active-primary w-full d-block font-size-15 font-weight-400 line-height-25 color-primary'.classNames();
export const input_class =
    'padding-15 border-radius-10 border-1-5 b-color-tertiary b-color-active-primary w-full d-block height-48 font-size-15 font-weight-400 line-height-25 color-primary'.classNames();
export const section_title_class =
    'font-size-20 font-weight-600 color-primary color-primary'.classNames();
export const field_label_class =
    'd-block font-size-15 font-weight-500 color-primary margin-bottom-10'.classNames();

export const ContextJobDetails = createContext();

export function JobDetails(props) {
    const { navigateTab } = props;
    const [state, setState] = useState({
        departments: [
            {
                id: 'sales',
                label: 'Sales'
            },
            {
                id: 'research',
                label: 'Research'
            },
            {
                id: 'marketing',
                label: 'Marketing'
            },
            {
                id: 'design',
                label: 'Design'
            }
        ],
        values: {
            vacancy: 1,
            experience_level: null,
            department: null,
            country: 'us'
        }
    });

    const setVal = (name, value) => {
        setState({
            ...state,
            values: {
                ...state.values,
                [name]: value
            }
        });
    };

    const addDepartMent = (new_department) => {
        if (!new_department) {
            return;
        }

        setState({
            ...state,
            departments: [...state.departments, new_department],
            values: {
                ...state.values,
                department: new_department.id
            }
        });
    };

    return (
        <div className={'job-details'.classNames(style)}>
            <ContextJobDetails.Provider
                value={{
                    departments: state.departments,
                    setVal,
                    values: state.values,
                    addDepartMent
                }}
            >
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
            </ContextJobDetails.Provider>

            <div className={'d-flex margin-bottom-10'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <FormActionButtons onNext={() => navigateTab(1)} />
                </div>
                <div className={'right-col'.classNames(style)}></div>
            </div>
        </div>
    );
}
