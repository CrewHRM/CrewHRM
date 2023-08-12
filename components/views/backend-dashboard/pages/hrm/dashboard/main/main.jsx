import React from "react";
import { __ } from "../../../../../../utilities/helpers.jsx";

import { StatCards } from "./stat-cards/stat-cards.jsx";
import { Calendar } from "./calendar/calendar.jsx";

import style from './main.module.scss';
import { JobOpenings } from "../job-openings/jobs.jsx";
import { IntroCard } from "../../../../../../materials/intro-card/intro-card.jsx";
import { DangerouslySet } from "../../../../../../materials/dangerously-set/DangerouslySet.jsx";

export function DahboardMain() {
	return <div className={'h-full'.classNames() + 'wrapper'.classNames(style)}>
		<div className={'sidebar'.classNames(style)}>
			<StatCards/>
			<Calendar/>
		</div>
		<div className={'content-area'.classNames(style)}>
			<IntroCard image="megaphone" className={'margin-bottom-20'.classNames()}>
				<span className={'d-block text-color-primary font-size-28 font-weight-600 margin-bottom-15'.classNames()}>
					{__( 'Find the person you want to hire ' )}
				</span>
				<small className={'text-color-secondary font-size-15 font-weight-400 margin-bottom-30 d-block'.classNames()}>
					{__( 'Candidates see your logo and description on job posts, and more' )}
				</small>
				<button className={'button button-primary button-medium'.classNames()}>
					{__( 'Create A New Job' )}
				</button>
			</IntroCard>

			<JobOpenings is_overview={true} className={"margin-bottom-20".classNames()}/>
			
			<div className={'d-flex align-items-center margin-bottom-20'.classNames()}>
				<div className={'flex-1'.classNames()}>
					<span className={'text-color-primary font-size-17 font-weight-500'.classNames()}>
						{__( 'Suggested Action' )}
					</span>
				</div>
				<div>
					<span className={'text-color-primary font-size-14 font-weight-400'.classNames()}>
						{__( 'Don’t show again' )}
					</span>
				</div>
			</div>
			<div className={'column'.classNames()}>
				<div>
					<IntroCard image="designer_working">
						<span className={'d-block font-size-20 font-weight-600 text-color-primary margin-bottom-8'.classNames()}>
							{__( 'Question Bank' )}
						</span>
						<DangerouslySet className={"d-block font-size-14 font-weight-400 text-color-secondary margin-bottom-26".classNames()}>
							{__('Let’s create a questionnaire for <br/> hiring the right people.')}
						</DangerouslySet>
						<a href="#" className={'button button-primary button-outlined button-medium'.classNames()}>
							{__( 'Choose Templates' )}
						</a>
					</IntroCard>
				</div>
				<div>
					<IntroCard image="being_creative">
						<span className={'d-block font-size-20 font-weight-600 text-color-primary margin-bottom-8'.classNames()}>
							{__( 'Design your page' )}
						</span>
						<span className={"d-block font-size-14 font-weight-400 text-color-secondary margin-bottom-26".classNames()}>
							{__('Keep your great talented candidate on file in the Talent Pool.')}
						</span>
						<a href="#" className={'button button-primary button-outlined button-medium'.classNames()}>
							{__( 'Choose Templates' )}
						</a>
					</IntroCard>
				</div>
			</div>
		</div>
	</div>
}