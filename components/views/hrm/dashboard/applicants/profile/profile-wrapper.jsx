import React, { createContext, useContext, useEffect, useState } from 'react';

import { __, getFlag } from '../../../../../utilities/helpers.jsx';
import { HeadActions } from './head-actions/head-actions.jsx';
import { Tabs } from '../../../../../materials/tabs/tabs.jsx';
import { OverView } from './overview/overview.jsx';
import { Documents } from './documents/documents.jsx';
import { Activity } from './activity/activity.jsx';
import { CoverImage } from '../../../../../materials/image/image.jsx';
import { Line } from '../../../../../materials/line/line.jsx';

import pdf from '../../../../../images/sample.pdf';
import attachment from '../../../../../images/attachment.png';
import style from './profile.module.scss';
import { request } from '../../../../../utilities/request.jsx';
import { ContextNonce } from '../../../../../materials/mountpoint.jsx';
import { InitState } from '../../../../../materials/init-state.jsx';
import { Address } from '../../../../../materials/address.jsx';

const applicant = {
    name: 'Bessie Cooper',
    address: '2118 Thornridge Cir. Syracuse, Connecticut 35624, USA',
    email: 'debbie.baker@example.com',
    phone: '(480) 555-0103',
    country_code: 'US',
    summary:
        'I am an experienced developer at https://google.com. organised and focused manager with a background in on and offline services. Highly motivated, I love learning new technology and sharing that knowledge to nurture and enhance the skills of the team.',
    cover_letter:
        "Dear [Recipient's Name],\nI am writing to express my strong interest in the Account Manager position at [Company Name]. With my extensive experience in account management and a proven track record of driving customer satisfaction and revenue growth, I am confident in my ability to contribute to your organization's success.\nOver the past [X] years, I have built a solid foundation in account management, working with diverse clients across various industries. I have successfully nurtured long-term relationships with key accounts, consistently exceeding sales targets and delivering exceptional. Dear [Recipient's Name],\nI am writing to express my strong interest in the Account Manager position at [Company Name]. With my extensive experience in account management and a proven track record of driving customer satisfaction and revenue growth, I am confident in my ability to contribute to your organization's success.\nOver the past [X] years, I have built a solid foundation in account management, working with diverse clients across various industries. I have successfully nurtured long-term relationships with key accounts, consistently exceeding sales targets and delivering exceptional.",
    education: [
        {
            education_id: 'k1',
            date_from: '2012-01-12',
            date_to: '2013-01-12',
            degree: 'MBA',
            institute: 'University of Pennsylvania'
        },
        {
            education_id: 'k2',
            date_from: '2014-01-12',
            date_to: '2016-11-02',
            degree: 'B.S. Marketing Communication & Economics',
            institute: 'University of Chicago'
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
            qna_id: 'dfsdf',
            question: 'What is your hourly rate for this job?',
            answer: '$100'
        },
        {
            qna_id: '234rfgdf',
            question: 'When are you available to start?',
            answer: 'Two weeks after offer'
        },
        {
            qna_id: '5df',
            question: 'Why are you the best candidate for this job?',
            answer: 'Extensive Account Management Experience: With [X] years of experience in account management, I have developed a deep understanding of the role and possess the necessary skills to excel in this position. I have successfully managed a diverse portfolio of'
        },
        {
            qna_id: 'h34sf',
            question: 'Please share some links to your previous work, or account manager task.',
            answer: 'http://www.conecom.com\nhttp://www.faxquote.com\nhttp://www.conecom.com'
        }
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
            name: 'Sample.png',
            mime_type: 'image/png',
            url: attachment
        },
        {
            name: 'How to build.jpg',
            mime_type: 'image/jpeg',
            url: attachment
        },
        {
            name: 'Demo App.jpg',
            mime_type: 'application/zip',
            url: attachment
        },
        {
            name: 'Banner Design.jpg',
            mime_type: 'image/png',
            url: attachment
        },
        {
            name: 'Banner Design.jpg',
            mime_type: 'video/mp4',
            url: attachment
        },
        {
            name: 'Beats Pattern',
            mime_type: 'audio/mp3',
            url: attachment
        },
        {
            name: 'How to build.pdf',
            mime_type: 'application/pdf',
            url: attachment
        },
        {
            name: 'Piano Melodic.mp3',
            mime_type: 'audio/mp3',
            url: attachment
        },
        {
            name: 'Rock Notes Sample',
            mime_type: 'audio/mp3',
            url: attachment
        }
    ]
};

const tab_class =
	'd-flex align-items-center justify-content-center font-size-15 font-weight-500 line-height-24'.classNames();
	
const tabs = [
	{
		id: 'overview',
		label: <span className={tab_class}>{__('Overview')}</span>
	},
	{
		id: 'documents',
		label: <span className={tab_class}>{__('Documents')}</span>
	},
	{
		id: 'activity',
		label: (
			<span className={tab_class}>
				<span className={'d-inline-block vertical-align-middle'.classNames()}>
					{__('Activity')}
				</span>
				<span
					className={'d-inline-block vertical-align-middle bg-color-secondary border-radius-30 color-white font-size-13 font-weight-500 line-height-24 letter-spacing--13 padding-horizontal-7 margin-left-10'.classNames()}
				>
					12
				</span>
			</span>
		)
	}
];

export function Profile({job_id, applicant_id, stages=[]}) {
	const {nonce, nonceAction} = useContext(ContextNonce);

    const [state, setState] = useState({ 
		fetching: false,
		active_tab: 'overview',
		error_message: null
	});

	const getApplicant=()=>{
		setState({
			...state,
			fetching: true
		});

		request('get_applicant_single', {nonce, nonceAction, job_id, applicant_id}, resp=>{
			const {success, data: {applicant={}, message=__('Something went wrong!')}} = resp;

			setState({
				...state,
				fetching: false,
				applicant,
				error_message: success ? null : message
			});
		});
	}

	useEffect(()=>{
		getApplicant();

	}, [applicant_id]);


	if (state.fetching || state.error_message) {
		return <InitState 
				fetching={state.fetching} 
				error_message={state.error_message}/>
	}

	const {applicant={}} = state;

    return (
        <>
            <HeadActions stages={stages}/>

            <div className={'applicant-data'.classNames(style) + 'border-radius-5'.classNames()}>
                {/* Basic Personal Info Heading */}
                <div className={'d-flex align-items-center padding-20'.classNames()}>
                    <CoverImage
                        src={applicant.avatar_url}
                        width={109}
                        height={124}
                        name={applicant.first_name + ' ' + applicant.last_name}
                        className={'border-radius-3'.classNames()}
                    />
                    <div className={'flex-1 margin-left-13'.classNames()}>
                        <span
                            className={'d-block font-size-24 font-weight-600 line-height-24 color-text margin-bottom-2'.classNames()}
                        >
                            {applicant.first_name} {applicant.last_name}
                            <span
                                className={'d-inline-block margin-left-4 font-size-15 vertical-align-middle'.classNames()}
                            >
                                {getFlag(applicant.address?.country_code)}
                            </span>
                        </span>

						{applicant.address ? <span
                            className={'d-block font-size-15 font-weight-400 line-height-24 color-text-light margin-bottom-2'.classNames()}
                        >
                            <Address {...applicant.address}/>
                        </span> : null}
                        
                        <span
                            className={'d-block font-size-15 font-weight-400 line-height-24 color-text-light margin-bottom-2'.classNames()}
                        >
                            {applicant.email}
                        </span>
                        <span
                            className={'d-block font-size-15 font-weight-400 line-height-24 color-text-light margin-bottom-2'.classNames()}
                        >
                            {applicant.phone}
                        </span>
                    </div>
                </div>

                <Line />

                {/* Profile Contents Tab */}
                <Tabs
                    active={state.active_tab}
                    tabs={tabs}
                    onNavigate={(active_tab) => setState({ ...state, active_tab })}
                    theme={'transparent'}
                    className={'margin-bottom-20'.classNames()}
                />

                {/* Profile contents per selected tab */}
				{state.active_tab == 'overview' ? <OverView applicant={applicant}/> : null}
				{state.active_tab == 'documents' ? <Documents applicant={applicant}/> : null}
				{state.active_tab == 'activity' ? <Activity applicant={applicant}/> : null}
            </div>
        </>
    );
}
