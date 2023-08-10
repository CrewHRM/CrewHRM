import React, { useState } from "react";
import { __ } from "../../../../../../utilities/helpers.jsx";

import style from './jobs.module.scss';
import { StatusDot } from "../../../../../../materials/status-dot/status-dots.jsx";
import { NoJob } from "./no-job.jsx";
import { Link } from "react-router-dom";
import { DropDown } from "../../../../../../materials/dropdown/dropdown.jsx";

const statuses = {
	publish: {color: '#73BF45', label: __( 'Active' )},
	draft: {color: '#BBBFC3', label: __( 'Draft' )},
	expired: {color: '#EE940D', label: __( 'Expired' )},
	completed: {color: '#FF180A', label: __( 'Completed' )}
}

const job = {
	job_id: 1,
	job_status: 'publish',
	job_title: 'Account Manager',
	department: 'Sales',
	location: 'London, England',
	job_type: 'Full Time',
	application_deadline: '2023-12-21',
	candidates: 433,
	qualified_candidates: 100,
	job_views: 10,
	interviewing: 3,
	selected: 10,
	vacancy: 3,
	hired: 2
}

const status_keys = Object.keys(statuses);
const jobs = Array(status_keys.length).fill(job).map((j, i)=>{
	return {
		...j, 
		job_id: j.job_id+i,
		job_status: status_keys[i]
	}
});

const stat_labels = {
	candidates: __( 'Candidates' ),
	qualified_candidates: __( 'Qualified' ),
	job_views: __( 'Job Views' ),
	interviewing: __( 'Interview' ),
	selected: __( 'Selected' ),
	hired: __( 'Hired' )
}

export function JobOpenings(props) {
	let {is_overview, className} = props;
	const [state, setState] = useState({
		filter: {
			job_status: 'all',
			page: 1
		}
	});

	const onChange=(key, value)=>{
		setState({
			...state,
			filter: {
				...state.filter,
				[key]: value
			}
		});
	}

	const filter_status_options = [
		{value: 'all', label: __( 'All' )},
		...status_keys.map(key=>{return {value: key, label: statuses[key].label}})
	];

	return <div className={'jobs'.classNames(style) + className}>
		<div className={'d-flex align-items-center margin-bottom-20'.classNames() + 'filter'.classNames(style)}>
			<div className={'flex-1 d-flex align-items-center'.classNames()}>
				{!is_overview && <Link to="/dashboard/main/">
					<i className={'ch-icon ch-icon-arrow-left text-color-primary cursor-pointer'.classNames() + 'back-icon'.classNames(style)}></i>
				</Link>}
				<strong className={'text-color-primary '+(is_overview ? 'font-size-17 font-weight-500' : 'font-size-24 font-weight-600').classNames()}>
					{__( 'Job Openings' )}
				</strong>
			</div>
			<div>
				<div className={'d-inline-block'.classNames()}>
					<DropDown
						transparent={is_overview}
						value={state.filter.job_status} 
						options={filter_status_options} 
						onChange={(v)=>onChange('job_status', v)}/>
				</div>
			</div>
		</div>
		
		{!jobs.length && <NoJob/> ||
			<div className={"job-list".classNames(style)}>
				{jobs.map(job=>{
					const {job_id, job_title, job_status, department, location, job_type, application_deadline} = job;
					const meta_data = [department, location, job_type, application_deadline];
					const stats = {
						candidates           : job.candidates,
						qualified_candidates : job.qualified_candidates,
						job_views            : job.job_views,
						interviewing         : job.interviewing,
						hired                : job.hired+'/'+job.vacancy
					};

					return <div key={job_id}>
						<div className={'d-flex align-items-center'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<div className={'d-flex align-items-center margin-bottom-15'.classNames()}>
									<div className={"d-inline-block margin-right-8".classNames()}>
										<StatusDot color={statuses[job_status].color}/>
									</div>
									<strong className={"job-title".classNames(style) + 'd-block text-color-primary font-size-20 font-weight-600'.classNames()}>
										{job_title}
									</strong>
								</div>
								<div className={"meta-data".classNames(style)}>
									{meta_data.map((data, index)=>{
										return data && <span key={data} className={'d-inline-block font-size-15 font-weight-400 text-color-secondary'.classNames()}>
											{data}
										</span>
									})}
								</div>
							</div>
							<div>
								<button className={'button button-primary button-outlined button-small'.classNames()}>{__( 'Details' )}</button>
							</div>
							<div className={'d-contents'.classNames()}>
								<i className={'ch-icon ch-icon-more-1 text-color-secondary font-size-20 cursor-pointer d-inline-block margin-left-15'.classNames()}></i>
							</div>
						</div>
						<div className={'d-flex align-items-center space-between'.classNames()}>
							{
								Object.keys(stats).map((key, index)=>{
									let is_last = index == Object.keys(stats).length-1;

									return [
										<div key={key} style={!is_last ? {} : {paddingRight: '5%'}}>
											<div>
												<span className={'d-block text-color-secondary font-size-14 font-weight-400 margin-bottom-7'.classNames()}>
													{stat_labels[key]}
												</span>
												<strong className={'d-block text-color-primary font-size-17 font-weight-600'}>
													{stats[key]}
												</strong>
											</div>
										</div>,
										!is_last && <div  key={key+'_separator'} style={{borderLeft: '1px solid var(--crewhrm-border-color-primary)', alignSelf: 'stretch'}}></div>
									]
								})
							}
						</div>
					</div>
				})}
			</div>
		}

		{is_overview && jobs.length && <Link to="/dashboard/job-openings" className={'button button-primary button-outlined button-full-width-2'.classNames()}>
			{__( 'View All Jobs' )}
		</Link>}
	</div>
}

export function JobOpeningsFullView(props) {
	return <div className={'padding-30'.classNames()} style={{maxWidth: '988px', margin: '0 auto'}}>
		<JobOpenings/>
	</div>
}