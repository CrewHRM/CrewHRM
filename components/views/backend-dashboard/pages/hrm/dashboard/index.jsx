import React from "react";
import { StickyBar } from "../../../../../materials/sticky-bar/sticky-bar.jsx";
import { __ } from "../../../../../utilities/helpers.jsx";
import { useParams } from "react-router-dom";
import { DahboardMain } from "./main/main.jsx";
import { Applicants } from "./applicants/applicants.jsx";
import { JobOpeningsFullView } from "./job-openings/jobs.jsx";

export function Dashboard() {
	const {page, sub_page} = useParams();

	return <>
		<StickyBar>
			<div className={'d-flex align-items-center'.classNames()}>
				<div>
					{__( 'Menu' )}
				</div>
				<div className={'flex-1 text-align-right'.classNames()}>
					<div className={'d-inline-block'.classNames()}>
						<button className={'button button-primary'.classNames()}>
							Create A New Job
						</button>
					</div>
				</div>
			</div>
		</StickyBar>

		{page=='main' && <DahboardMain/>}
		{page=='job-openings' && <JobOpeningsFullView/>}
		{page=='applicants' && <Applicants job_id={sub_page}/>}
	</> 
}
