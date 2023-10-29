import React from 'react';
import { Link } from 'react-router-dom';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { StatCards } from './stat-cards/stat-cards.jsx';
import { JobOpenings } from '../job-openings/jobs.jsx';
import { IntroCard } from 'crewhrm-materials/intro-card/intro-card.jsx';
import { RenderExternal } from 'crewhrm-materials/render-external.jsx';
import { applyFilters } from 'crewhrm-materials/hooks.jsx';
// import { DangerouslySet } from 'crewhrm-materials/dangerously-set.jsx';

import { Promote } from '../../../../promote/promote.jsx';

import style from './main.module.scss';

function CreateJobIntro({orientation="vertical"}) {
	return <IntroCard
		image="megaphone"
		orientation={orientation}
		className={'margin-bottom-20'.classNames()}
		style={{ backgroundPosition: orientation=="vertical" ? 'center bottom -41px' : 'right'}}
	>
		<span
			className={'d-block color-text font-size-28 font-weight-600 line-height-32 margin-bottom-15'.classNames()}
		>
			{__('Find the person you want to hire ')}
		</span>
		<small
			className={'color-text-light font-size-15 font-weight-400 margin-bottom-30 d-block'.classNames()}
		>
			{__('Candidates see your logo and description on job posts, and more')}
		</small>
		<Link
			to="/dashboard/jobs/editor/new/"
			className={'button button-primary button-medium'.classNames()}
		>
			{__('Create A New Job')}
		</Link>
	</IntroCard>
}

export function DahboardMain() {
    return (
        <div
            data-crew="hrm-main"
            className={'h-full'.classNames() + 'wrapper'.classNames(style)}
        >
            <div className={'sidebar'.classNames(style)}>
                <StatCards className={'margin-bottom-20'.classNames()} />
				<div className={'position-relative border-radius-5 overflow-hidden'.classNames()}>
					<RenderExternal component={applyFilters('crewhrm_dashboard_vertical_card', ()=><Promote content="calendar_widget"/>)}/>
				</div>
            </div>

            <div className={'content-area'.classNames(style)}>
				<CreateJobIntro orientation='horizontal'/>
                <JobOpenings is_overview={true} className={'margin-bottom-20'.classNames()} />
            </div>
        </div>
    );
}
