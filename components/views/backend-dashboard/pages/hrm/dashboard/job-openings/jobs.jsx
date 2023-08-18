import React, { useState } from "react";
import { __ } from "../../../../../../utilities/helpers.jsx";

import style from './jobs.module.scss';
import { StatusDot } from "../../../../../../materials/status-dot/status-dots.jsx";
import { NoJob } from "./no-job.jsx";
import { Link } from "react-router-dom";
import { DropDown, Options } from "../../../../../../materials/dropdown/dropdown.jsx";
import { Line } from "../../../../../../materials/line/line.jsx";
import { ShareModal } from "../../../../../../materials/share-modal/share-modal.jsx";

const options = [
	{
		name  : 'preview',
		label : __( 'Preview' ),
		icon  : 'ch-icon ch-icon-eye',
		for   : ['draft']
	},
	{
		name  : 'duplicate',
		label : __( 'Duplicate' ),
		icon  : 'ch-icon ch-icon-copy',
		for   : 'all'
	},
	{
		name  : 'archive',
		label : __( 'Archive' ),
		icon  : 'ch-icon ch-icon-archive',
		for   : ['publish', 'draft', 'expired']
	},
	{
		name  : 'share',
		label : __( 'Share Job' ),
		icon  : 'ch-icon ch-icon-share',
		for   : ['publish']
	},
	{
		name  : 'delete',
		label : __( 'Delete' ),
		icon  : 'ch-icon ch-icon-trash',
		for   : 'all'
	}
];

const statuses = {
	publish: {
		color : '#73BF45', 
		label : __( 'Published' )
	},
	draft: {
		color : '#EE940D', 
		label : __( 'Draft' )
	},
	archive: {
		color : '#BBBFC3', 
		label : __( 'Archived' )
	},
	expired: {
		color : '#FF180A', 
		label : __( 'Expired' )
	}
}

const job = {
	job_id: 1,
	job_permalink: 'https://example.com/jobs/1',
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
		share_link: null,
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

	const onActionClick=(action, job_id)=>{
		const job = jobs.find(j=>j.job_id==job_id);

		switch(action) {
			case 'share' :
				setState({
					...state, 
					share_link: job.job_permalink
				});
				break;
		}
	}

	const filter_status_options = [
		{value: 'all', label: __( 'All' )},
		...status_keys.map(key=>{return {value: key, label: statuses[key].label}})
	];

	return <div className={'jobs'.classNames(style) + className}>
		{
			state.share_link && 
			<ShareModal url={state.share_link} onClose={()=>setState({...state, share_link: null})}/> || null
		}
		
		<div className={'d-flex align-items-center margin-bottom-20'.classNames() + 'filter'.classNames(style)}>
			<div className={'flex-1 d-flex align-items-center'.classNames()}>
				{!is_overview && <Link to="/dashboard/">
					<i className={'ch-icon ch-icon-arrow-left text-color-primary cursor-pointer'.classNames() + 'back-icon'.classNames(style)}></i>
				</Link> || null}
				<span className={'text-color-primary '+(is_overview ? 'font-size-17 font-weight-500' : 'font-size-24 font-weight-600').classNames()}>
					{__( 'Job Openings' )}
				</span>
			</div>
			<div>
				<div className={'d-inline-block'.classNames()}>
					<DropDown
						className={'padding-vertical-8 padding-horizontal-15'.classNames()}
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
					const {color: status_color, label: status_label} = statuses[job_status];

					const stats = {
						candidates           : job.candidates,
						qualified_candidates : job.qualified_candidates,
						job_views            : job.job_views,
						interviewing         : job.interviewing,
						hired                : job.hired+'/'+job.vacancy
					};

					const actions = options.filter(o=>o.for==='all' || o.for.indexOf(job_status)>-1).map(o=>{
						return {
							value: o.name,
							label: <span className={'d-inline-flex align-items-center column-gap-10'.classNames()}>
								<i className={o.icon.classNames() + 'font-size-24 text-color-primary'.classNames()}></i>
								<span className={'font-size-15 font-weight-500 line-height-25 text-color-primary'.classNames()}>
									{o.label}
								</span>
							</span>
						}
					})

					return <div key={job_id}>
						<div className={'d-flex align-items-center'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<div className={'d-flex align-items-center margin-bottom-15'.classNames()}>
									<div className={"d-inline-block margin-right-8".classNames()} title={status_label}>
										<StatusDot color={status_color}/>
									</div>
									<span className={"job-title".classNames(style) + 'd-block text-color-primary font-size-20 font-weight-600'.classNames()}>
										{job_title}
									</span>
								</div>
								<div className={"meta-data".classNames(style)}>
									{meta_data.map((data, index)=>{
										return data && <span key={data} className={'d-inline-block font-size-15 font-weight-400 text-color-light'.classNames()}>
											{data}
										</span> || null
									})}
								</div>
							</div>
							<div>
								<Link to={`/dashboard/jobs/${job_id}/applicants/`} className={'button button-primary button-outlined button-small'.classNames()}>
									{__( 'Details' )}
								</Link>
							</div>
							<div className={'d-contents'.classNames()}>
								<Options options={actions} onClick={action=>onActionClick(action, job_id)}>
									<i className={'ch-icon ch-icon-more text-color-light font-size-20 cursor-pointer d-inline-block margin-left-15'.classNames()}></i>
								</Options>
							</div>
						</div>
						<div className={'d-flex align-items-center justify-content-space-between'.classNames()}>
							{
								Object.keys(stats).map((key, index)=>{
									let is_last = index == Object.keys(stats).length-1;

									return [
										<div key={key} style={!is_last ? {} : {paddingRight: '5%'}}>
											<div>
												<span className={'d-block text-color-light font-size-14 font-weight-400 margin-bottom-7'.classNames()}>
													{stat_labels[key]}
												</span>
												<span className={'d-block text-color-primary font-size-17 font-weight-600'}>
													{stats[key]}
												</span>
											</div>
										</div>,
										!is_last && <Line key={key+'_separator'} orientation="vertical"/> || null
									]
								})
							}
						</div>
					</div>
				})}
			</div>
		}

		{is_overview && jobs.length && <Link to="/dashboard/jobs/" className={'button button-primary button-outlined button-full-width-2'.classNames() + 'view-all-button'.classNames(style)}>
			{__( 'View All Jobs' )}
		</Link> || null}
	</div>
}

export function JobOpeningsFullView(props) {
	return <div className={'padding-30'.classNames()} style={{maxWidth: '988px', margin: '0 auto'}}>
		<JobOpenings/>
	</div>
}