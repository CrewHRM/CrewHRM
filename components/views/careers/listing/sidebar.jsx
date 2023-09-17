import React from "react";
import { TagField } from '../../../materials/tag-field/tag-field.jsx';
import { employment_types } from "../../hrm/job-editor/job-details/sections/employment-details.jsx";
import { countries_object, __ } from "../../../utilities/helpers.jsx";

import style from './listing.module.scss';

export function CareersSidebar({setFilter, filters, jobs_country_codes=[]}) {

	const filterList = {
		/* department: {
			section_label: __('Departments'),
			selection_type: 'list',
			options: [
				{
					id: 1,
					label: 'Business Development',
					count: 2
				},
				{
					id: 2,
					label: 'Business Analytics/Operations',
					count: 5
				},
				{
					id: 3,
					label: 'Backend Engineer',
					count: 1
				},
				{
					id: 4,
					label: 'Brand & Marketing',
					count: 1
				},
				{
					id: 5,
					label: 'Copywriter',
					count: 1
				},
				{
					id: 6,
					label: 'Creative Director',
					count: 2
				},
				{
					id: 7,
					label: 'Data Science',
					count: 1
				}
			]
		}, */
		country_code: {
			section_label: __('Location'),
			selection_type: 'tag',
			options: jobs_country_codes.map(code=>{
				return {
					id: code, 
					label: countries_object[code]
				}
			})
		},
		employment_type: {
			section_label: 'Job Type',
			selection_type: 'list',
			options: Object.keys(employment_types).map(type=>{
				return {
					id: type, 
					label: employment_types[type]
				}
			})
		}
	};

	const _setFilter=(name, value)=>{
		setFilter(name, filters[name]==value ? null : value);
	}

	return <div data-crewhrm-selector="sidebar" className={'sidebar'.classNames(style)}>
		<div>
			{Object.keys(filterList).map((filter_key) => {
				let {
					section_label,
					selection_type,
					options = []
				} = filterList[filter_key];

				return options.length>1 ? <div
					key={filter_key}
					className={'margin-bottom-23 overflow-auto'.classNames()}
				>
					<span
						className={'d-block font-size-14 font-weight-700 line-height-24 letter-spacing--14 color-text-light margin-bottom-16'.classNames()}
					>
						{section_label}
					</span>

					{selection_type == 'list' ? options.map((option) => {
							let { id, label, count } = option;
							let is_active = filters[filter_key] === id;
							return (
								<span
									key={id}
									className={`d-block font-size-14 cursor-pointer margin-bottom-18 ${
										is_active
											? 'font-weight-600 color-text'
											: 'font-weight-500 color-text-light'
									}`.classNames()}
									onClick={() => _setFilter(filter_key, id)}
								>
									{label} {count ? `(${count})` : null}
								</span>
							);
						}) : null
					}

					{selection_type == 'tag' ? <div>
							<TagField
								theme="tag"
								behavior="radio"
								options={options}
								value={filters[filter_key]}
								onChange={(v) => _setFilter(filter_key, v)}
							/>
						</div> : null
					}
				</div> : null
			})}
		</div>
	</div>
}