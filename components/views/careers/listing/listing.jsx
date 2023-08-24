import React, { useState } from "react";

import style from './listing.module.scss';
import { Link } from "react-router-dom";
import { __ } from "../../../utilities/helpers.jsx";
import { LoadingIcon } from "../../../materials/loading-icon/loading-icon.jsx";
import { TextField } from "../../../materials/text-field/text-field.jsx";

const job = {
	job_id    : 1,
	job_title : 'Account Executive',
	location  : 'London, England',
	job_type  : 'Full Time'
}

const jobs = Array(8).fill(job).map((j, i)=>{
	return {
		...j,
		job_id: j.job_id+i
	}
});

const filters = {
	department: {
		section_label: __( 'Departments' ),
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
	},
	location: {
		section_label: __( 'Location' ),
		selection_type: 'tag',
		options: [
			{
				id: 'us',
				label: 'USA'
			},
			{
				id: 'ca',
				label: 'Canada'
			},
			{
				id: 'in',
				label: 'India'
			},
			{
				id: 'gr',
				label: 'Germany'
			},
			{
				id: 'cn',
				label: 'China'
			}
		]
	},
	job_type: {
		section_label: 'Job Type',
		selection_type: 'list',
		options: [
			{
				id: 'full_time',
				label: 'Full Time',
			},
			{
				id: 'part_time',
				label: 'Part Time',
			}
		]
	}
}

export function Listing(props) {
	const [state, setState] = useState({
		filters: {}
	});

	const setFilter=(key, value)=>{
		setState({
			...state,
			filters: {
				...state.filters,
				[key]: value
			}
		});
	}

	return <div data-crewhrm-selector="job-listing" className={'listing'.classNames(style)} style={{marginTop: '59px'}}>
		<div data-crewhrm-selector="sidebar" className={'sidebar'.classNames(style)}>
			<div className={'margin-right-50'.classNames()}>
				{Object.keys(filters).map(filter_key=>{
					let {section_label, selection_type, options=[]} = filters[filter_key];

					return <div key={filter_key} className={'margin-bottom-23 overflow-auto'.classNames()}>
						<span className={"d-block font-size-14 font-weight-700 line-height-24 letter-spacing--14 text-color-light margin-bottom-16".classNames()}>
							{section_label}
						</span>

						{selection_type=='list' && options.map(option=>{
							let {id, label, count} = option;
							let is_active = state.filters[filter_key] === id;
							return <span key={id} className={`d-block font-size-14 cursor-pointer margin-bottom-18 ${is_active ? 'font-weight-600 text-color-primary' : 'font-weight-500 text-color-light'}`.classNames()} onClick={()=>setFilter(filter_key, id)}>
								{label} ({count})
							</span>
						}) || null}
					</div>
				})}
			</div>
		</div>
		<div data-crewhrm-selector="listing" className={'content-area'.classNames(style)}>
			<TextField 
				iconClass={'ch-icon ch-icon-search-normal-1'.classNames()} 
				className={'padding-vertical-10 padding-horizontal-11 border-1 border-color-tertiary border-focus-color-primary border-radius-5'.classNames()}/>

			{jobs.map(job=>{
				const {job_id, job_title, location} = job;
				const meta = [job_title, location].filter(m=>m!=undefined);

				return <div className={'d-flex align-items-center padding-15 margin-bottom-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<span className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 text-color-primary margin-bottom-10'.classNames()}>
							{job_title}
						</span>
						<span className={'font-size-13 font-weight-400 line-height-24 letter-spacing--13 text-color-light'.classNames()}>
							{meta.map((m, i)=>{
								return <span key={i}>
									{m} 
									{i<meta.length-1 ? <span className={'d-inline-block padding-horizontal-4'.classNames()}>&middot;</span> : null}
								</span>
							})}
						</span>
					</div>
					<div>
						<Link to={`/${job_id}/`} className={'button button-primary button-outlined button-medium-2'.classNames()}>
							{__( 'Apply' )}
						</Link>
					</div>
				</div>
			})}
			
			<div data-crewhrm-selector="loading" className={'text-align-center'.classNames()}>
				<LoadingIcon/>
				<div className={'font-size-13 font-weight-400 line-height-21 text-color-light margin-top-8'.classNames()}>
					{__( 'Loading More...' )}
				</div>
			</div>
		</div>
	</div>
}