import React, { createContext, useState } from "react";

import { __ } from "../../../../../../utilities/helpers.jsx";
import { ActionButtons } from "../index.jsx";
import { TitleAndDescription } from "./sections/title-description.jsx";
import { EmploymentDetails } from "./sections/employment-details.jsx";
import { Experience } from "./sections/required-experience.jsx";

import style from './details.module.scss';
import { Salary } from "./sections/salary.jsx";
import { Location } from "./sections/location.jsx";

const departments = [
	{
		value: 'sales', 
		label: 'Sales'
	}, 
	{
		value: 'research', 
		label: 'Research'
	},
	{
		value: 'marketing', 
		label: 'Marketing'
	},
	{
		value: 'design', 
		label: 'Design'
	}
];

const textarea_class      = 'padding-vertical-15 padding-horizontal-20 border-radius-10 border-1-5 border-color-tertiary border-focus-color-primary w-full d-block font-size-15 font-weight-400 line-height-25 text-color-primary'.classNames();
const input_class         = 'padding-15 border-radius-10 border-1-5 border-color-tertiary border-focus-color-primary w-full d-block height-50 font-size-15 font-weight-400 line-height-25 text-color-primary'.classNames();
const section_title_class = 'font-size-20 font-weight-600 text-color-primary text-color-primary'.classNames();
const field_label_class   = 'd-block font-size-15 font-weight-500 text-color-primary margin-bottom-10'.classNames();

export const ContextJobDetails = createContext();

export function JobDetails(props) {
	const {navigateTab} = props;
	const [state, setState] = useState({
		values: {
			vacancy: 1,
			experience_level: null,
			department: null,
			country: 'us'
		}
	});

	const setVal=(name, value)=>{
		setState({
			...state,
			values: {
				...state.values,
				[name]: value
			}
		});
	}

	return <div className={'job-details'.classNames(style)}>

		<ContextJobDetails.Provider value={{textarea_class, input_class, section_title_class, field_label_class, departments, setVal, values: state.values}}>
			<div className={'margin-bottom-40'.classNames()}>
				<TitleAndDescription/>
			</div>
			<div className={'margin-bottom-40'.classNames()}>
				<EmploymentDetails/>
			</div>
			<div className={'margin-bottom-40'.classNames()}>
				<Experience/>
			</div>
			<div className={'margin-bottom-40'.classNames()}>
				<Salary/>
			</div>
			<div className={'margin-bottom-40'.classNames()}>
				<Location/>
			</div>
		</ContextJobDetails.Provider>

		<div className={'d-flex margin-bottom-10'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<ActionButtons onNext={()=>navigateTab(1)}/>
			</div>
			<div className={'right-col'.classNames(style)}></div>
		</div>
	</div>
}