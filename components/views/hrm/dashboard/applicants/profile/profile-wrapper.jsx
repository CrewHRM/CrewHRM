import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { __, getAddress, getFlag, formatDate } from 'crewhrm-materials/helpers.jsx';
import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';
import { CoverImage } from 'crewhrm-materials/image/image.jsx';
import { Line } from 'crewhrm-materials/line/line.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { InitState } from 'crewhrm-materials/init-state.jsx';
import { ErrorBoundary } from 'crewhrm-materials/error-boundary.jsx';
import { genders } from 'crewhrm-materials/data.jsx';

import { HeadActions } from './head-actions/head-actions.jsx';
import { OverView } from './overview/overview.jsx';
import { Documents } from './documents/documents.jsx';
import { Activity } from './activity/activity.jsx';
import { ContextApplicationSession } from '../applicants.jsx';

import no_app_image from './no.png';

const tab_class =
    'd-flex align-items-center justify-content-center font-size-15 font-weight-500 line-height-24'.classNames();

const mail_phone_class = 'd-block font-size-15 font-weight-400 line-height-24 color-text-light color-hover-text margin-bottom-2 cursor-pointer'.classNames();

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
                {/* <span
                    className={'d-inline-block vertical-align-middle bg-color-secondary border-radius-30 color-white font-size-13 font-weight-500 line-height-24 letter-spacing--13 padding-horizontal-7 margin-left-10'.classNames()}
                >
                    12
                </span> */}
            </span>
        )
    }
];

export function Profile({ has_applications }) {
    const { application_id, job_id=0 } = useParams();
    const { session } = useContext(ContextApplicationSession);

    const [state, setState] = useState({
        fetching: true,
        mounted: false,
        application: {},
        active_tab: 'overview',
        error_message: null
    });

    const getApplication = () => {
        setState({
            ...state,
            fetching: true
        });

        request('getApplicationSingle', { job_id, application_id }, (resp) => {
            const {
                success,
                data: { application = {}, message = __('Something went wrong!') }
            } = resp;

            setState({
                ...state,
                mounted: true,
                fetching: false,
                application,
                error_message: success ? null : message
            });
        });
    };

	const getOverview=()=>{
    
		const { overview = [], gender, date_of_birth } = state.application;

		const basics = [];

		// Gender
		if (gender) {
			basics.push({
				id: 'gender',
				label: __('Gender'),
				text: genders[ gender ] || gender
			})
		}

		// DOB
		if (date_of_birth) {
			basics.push({
				id: 'dob',
				label: __('Date of Birth'),
				text: formatDate( date_of_birth )
			})
		}

		return  [
			...basics, 
			...overview
		];
	}

    useEffect(() => {
        if (application_id) {
            getApplication();
        }
    }, [application_id, session]);

	const _overview = getOverview();
    const { application = {} } = state;
	const _current_tab = _overview.length ? state.active_tab : (state.active_tab=='overview' ? 'documents' : state.active_tab);
	const _tabs = _overview.length ? tabs : tabs.filter(t=>t.id!='overview');

    if ((!state.mounted && state.fetching) || state.error_message) {
        return <InitState 
				fetching={state.fetching} 
				error_message={state.error_message} />

    } else if ( ! has_applications ) {
        return (
            <div className={'bg-color-white border-radius-5 padding-vertical-50'.classNames()}>
				<div className={'padding-vertical-30'.classNames()}>
					<div className={'text-align-center margin-bottom-10'.classNames()}>
						<img src={no_app_image} className={'height-auto'.classNames()} style={{width: '100px'}}/>
					</div>
					<div className={'text-align-center font-size-20 font-weight-500 color-text-light'.classNames()}>
						{__('No candidates yet')}
					</div>
				</div>
            </div>
        );
    }

    return ( !application_id ? null :
        <>
            <HeadActions application={application} />
            <div className={'bg-color-white border-radius-5 padding-horizontal-30 padding-bottom-30'.classNames()}>
                {/* Basic Personal Info Heading */}
                <div className={'d-flex align-items-center padding-20'.classNames()}>
                    <CoverImage
                        src={application.avatar_url}
                        width={109}
                        height={124}
                        name={application.first_name + ' ' + application.last_name}
                        className={'border-radius-3'.classNames()}
                    />
                    <div className={'flex-1 margin-left-13'.classNames()}>
                        <span
                            className={'d-block font-size-24 font-weight-600 line-height-24 color-text margin-bottom-2'.classNames()}
                        >
                            {application.first_name} {application.last_name}
                            <span
                                className={'d-inline-block margin-left-4 font-size-15 vertical-align-middle'.classNames()}
                            >
                                {getFlag(application.address?.country_code)}
                            </span>
                        </span>

                        {application.address ? (
                            <span
                                className={'d-block font-size-15 font-weight-400 line-height-24 color-text-light margin-bottom-2'.classNames()}
                            >
                                {getAddress(application.address)}
                            </span>
                        ) : null}

                        <a href={'mailto:'+application.email} target='_blank' className={mail_phone_class}>
                            {application.email}
                        </a>

                        <a href={'tel:'+application.phone} className={mail_phone_class}>
                            {application.phone}
                        </a>
                    </div>
                </div>

                <Line />

                {/* Profile Contents Tab */}
                <Tabs
                    active={_current_tab}
                    tabs={_tabs}
                    onNavigate={(active_tab) => setState({ ...state, active_tab })}
                    theme='transparent'
                    className={'margin-bottom-20'.classNames()}
                />

                {/* Profile contents per selected tab */}
                {_current_tab == 'overview' ? <ErrorBoundary><OverView application={application} overview={_overview}/></ErrorBoundary> : null}
                {_current_tab == 'documents' ? <ErrorBoundary><Documents application={application} /></ErrorBoundary> : null}
                {_current_tab == 'activity' ? <ErrorBoundary><Activity application={application} /></ErrorBoundary> : null}
            </div>
        </>
    );
}
