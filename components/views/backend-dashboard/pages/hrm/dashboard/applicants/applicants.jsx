import React, { createContext } from "react";

import style from './applicants.module.scss';
import { __ } from "../../../../../../utilities/helpers.jsx";
import { Header } from "./header/header.jsx";
import { Sidebar } from "./sidebar/sidebar.jsx";
import { Profile } from "./profile/Profile.jsx";

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
	const {job_id} = props;

	return <ContextApplicants.Provider value={{job_id, jobs, steps}}>
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