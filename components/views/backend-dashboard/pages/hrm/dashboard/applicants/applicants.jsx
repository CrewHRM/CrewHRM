import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { __ } from "../../../../../../utilities/helpers.jsx";
import { Header } from "./header/header.jsx";
import { Sidebar } from "./sidebar/sidebar.jsx";
import { Profile } from "./profile/profile-wrapper.jsx";

import style from './applicants.module.scss';

const jobs = [
	'Account Manager',
	'Lead Backend Developer',
	'Junior React Developer'
].map((j, i)=>{
	return {
		value: i+1,
		label: j
	}
});

const steps = [
	{
		id: 'cnd',
		label: 'Candidates',
		count: 500
	},
	{
		id: 'sc',
		label: 'Screening',
		count: 37
	},
	{
		id: 'asses',
		label: 'Assesment',
		count: 20
	},
	{
		id: 'intr',
		label: 'Interview',
		count: 10
	},
	{
		id: 'offr',
		label: 'Make an Offer',
		count: 10
	},
	{
		id: 'hrd',
		label: 'Hired',
		count: 2
	},
];

export const ContextApplicants = createContext();

export function Applicants( props ) {
	const {job_id: raw_job_id, applicant_id} = useParams();
	const job_id = parseInt(raw_job_id);
	
	const [state, setState] = useState({
		job: {
			job_id: job_id,
			job_title: 'Sampel Job Title',
			application_stages: [
				{
					id: 'id1',
					label: 'Screening'
				},
				{
					id: 'id2',
					label: 'Assessment'
				},
				{
					id: 'id3',
					label: 'Interview'
				},
				{
					id: 'id4',
					label: 'Make an offer'
				},
				{
					id: 'id5',
					label: 'Hired'
				},
			],
			current_stage: 'id2'
		}
	});

	const getJobData=()=>{

	}

	useEffect(()=>{

	}, []);

	return <ContextApplicants.Provider value={{job_id, jobs, steps, job: state.job}}>
		<div className={'applicants'.classNames(style)}>
			<Header/>
			<div className={'content-area'.classNames(style)}>
				<div className={'sidebar-wrapper'.classNames(style)}>
					<Sidebar/>
				</div>
				<div className={'profile-wrapper'.classNames(style)}>
					<Profile/>
				</div>
			</div>
		</div>
	</ContextApplicants.Provider> 
}