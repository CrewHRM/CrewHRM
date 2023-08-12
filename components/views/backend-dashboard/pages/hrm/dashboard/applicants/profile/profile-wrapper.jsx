import React, { createContext, useState } from "react";

import {__, getFlag} from '../../../../../../../utilities/helpers.jsx';
import { HeadActions } from "./head-actions/head-actions.jsx";
import { Tabs } from "../../../../../../../materials/tabs/tabs.jsx";
import { OverView } from "./overview/overview.jsx";
import { Documents } from "./documents/documents.jsx";
import { Activity } from "./activity/activity.jsx";
import { CoverImage } from "../../../../../../../materials/image/image.jsx";
import { Line } from "../../../../../../../materials/line/line.jsx";

import avatar from '../../../../../../../images/avatar.svg';
import pdf from '../../../../../../../images/sample.pdf';
import attachment from '../../../../../../../images/attachment.png';

import style from './profile.module.scss';

const applicant = {
	name         : 'Bessie Cooper',
	address      : '2118 Thornridge Cir. Syracuse, Connecticut 35624, USA',
	email        : 'debbie.baker@example.com',
	phone        : '(480) 555-0103',
	avatar_url   : avatar,
	country_code : 'US',
	summary      : 'I am an experienced developer at https://google.com. organised and focused manager with a background in on and offline services. Highly motivated, I love learning new technology and sharing that knowledge to nurture and enhance the skills of the team.',
	cover_letter : 'Dear [Recipient\'s Name],\nI am writing to express my strong interest in the Account Manager position at [Company Name]. With my extensive experience in account management and a proven track record of driving customer satisfaction and revenue growth, I am confident in my ability to contribute to your organization\'s success.\nOver the past [X] years, I have built a solid foundation in account management, working with diverse clients across various industries. I have successfully nurtured long-term relationships with key accounts, consistently exceeding sales targets and delivering exceptional. Dear [Recipient\'s Name],\nI am writing to express my strong interest in the Account Manager position at [Company Name]. With my extensive experience in account management and a proven track record of driving customer satisfaction and revenue growth, I am confident in my ability to contribute to your organization\'s success.\nOver the past [X] years, I have built a solid foundation in account management, working with diverse clients across various industries. I have successfully nurtured long-term relationships with key accounts, consistently exceeding sales targets and delivering exceptional.',
	education    : [
		{
			education_id : 'k1',
			date_from    : '2012-01-12',
			date_to      : '2013-01-12',
			degree       : 'MBA',
			institute    : 'University of Pennsylvania'   
		},
		{
			education_id : 'k2',
			date_from    : '2014-01-12',
			date_to      : '2016-11-02',
			degree       : 'B.S. Marketing Communication & Economics',
			institute    : 'University of Chicago'   
		}
	],
	skills: [
		'Salesforce',
		'Edge',
		'CRM', 
		'Software as a service',
		'Selling',
		'Online advertising',
		'Management'
	],
	qna: [
		{
			qna_id   : 'dfsdf',
			question : 'What is your hourly rate for this job?',
			answer   : '$100'
		},
		{
			qna_id   : '234rfgdf',
			question : 'When are you available to start?',
			answer   : 'Two weeks after offer'
		},
		{
			qna_id   : '5df',
			question : 'Why are you the best candidate for this job?',
			answer   : 'Extensive Account Management Experience: With [X] years of experience in account management, I have developed a deep understanding of the role and possess the necessary skills to excel in this position. I have successfully managed a diverse portfolio of'
		},
		{
			qna_id   : 'h34sf',
			question : 'Please share some links to your previous work, or account manager task.',
			answer   : 'http://www.conecom.com\nhttp://www.faxquote.com\nhttp://www.conecom.com'
		},
	],
	social_links: [
		'https://linkedin.com',
		'https://twitter.com',
		'http://dribble.com',
		'http://behance.com',
		'http://external.com'
	],
	resume_url: pdf,
	attachments: [
		{
			mime_type: 'image/png',
			url: attachment
		},
		{
			mime_type: 'image/png',
			url: attachment
		},
		{
			mime_type: 'image/png',
			url: attachment
		},
		{
			mime_type: 'image/png',
			url: attachment
		},
		{
			mime_type: 'image/png',
			url: attachment
		},
		{
			mime_type: 'image/png',
			url: attachment
		}
	]
}

export const ContextApplicantProfile = createContext();

export function Profile() {
	const tab_class = 'font-size-15 font-weight-500 line-height-24'.classNames();
	const tabs = [
		{
			id: 'overview',
			label: <span className={tab_class}>{__( 'Overview' )}</span>
		},
		{
			id: 'documents',
			label: <span className={tab_class}>{__( 'Documents' )}</span>
		},
		{
			id: 'activity',
			label: <span className={tab_class}>{__( 'Activity' )}</span>
		}
	];

	const [state, setState] = useState({active_tab: 'overview'});

	return <div>
		<HeadActions/>
		<div className={'applicant-data'.classNames(style) + 'border-radius-5'.classNames()}>
			<div className={'d-flex align-items-center padding-20'.classNames()}>
				<CoverImage src={avatar} width={109} height={124} className={'border-radius-3'.classNames()}/>
				<div className={'flex-1 margin-left-13'.classNames()}>
					<strong className={'d-block font-size-24 font-weight-600 line-height-24 text-color-primary margin-bottom-2'.classNames()}>
						{applicant.name} <span className={'font-size-15 vertical-align-middle'.classNames()}>{getFlag(applicant.country_code)}</span>
					</strong>
					<span className={'d-block font-size-15 font-weight-400 line-height-24 text-color-secondary margin-bottom-2'.classNames()}>
						{applicant.address}
					</span>
					<span className={'d-block font-size-15 font-weight-400 line-height-24 text-color-secondary margin-bottom-2'.classNames()}>
						{applicant.email}
					</span>
					<span className={'d-block font-size-15 font-weight-400 line-height-24 text-color-secondary margin-bottom-2'.classNames()}>
						{applicant.phone}
					</span>
				</div>
			</div>

			<Line/>

			<Tabs 
				active={state.active_tab} 
				tabs={tabs} 
				onNavigate={active_tab=>setState({...state, active_tab})}
				theme={'transparent'}
				className={'margin-bottom-20'.classNames()}/>

			<ContextApplicantProfile.Provider value={{applicant}}>
				{state.active_tab == 'overview' && <OverView/> || null}
				{state.active_tab == 'documents' && <Documents/> || null}
				{state.active_tab == 'activity' && <Activity/> || null}
			</ContextApplicantProfile.Provider>
		</div>
	</div>
}