import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { __, data_pointer } from 'crewhrm-materials/helpers.jsx';
import { DropDown, Options } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { ContextApplicationSession } from '../../applicants.jsx';
import { ContextWarning } from 'crewhrm-materials/warning/warning.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import { applyFilters } from 'crewhrm-materials/hooks.jsx';
import { RenderExternal } from 'crewhrm-materials/render-external.jsx';

import { Promote } from '../../../../../../promote/promote.jsx';
import style from './head.module.scss';
import { ToolTip } from 'crewhrm-materials/tooltip.jsx';
import { useEffect } from 'react';

const application_actions = [
    {
        id: 'disqualify',
        label: __('Disqualify'),
        icon: 'ch-icon ch-icon-slash font-size-16 color-text'.classNames()
    },
    {
        id: 'delete',
        label: __('Delete'),
        icon: 'ch-icon ch-icon-trash font-size-16 color-text'.classNames()
    }
];

export function HeadActions({ application }) {
    const { stages = [], sessionRefresh } = useContext(ContextApplicationSession);
    const { showWarning, closeWarning, loadingState } = useContext(ContextWarning);
    const { application_id, job_id, stage_id=0 } = useParams();
    const { ajaxToast } = useContext(ContextToast);
    const navigate = useNavigate();
	const {has_pro} = window[data_pointer];

    const segments = applyFilters( 'applicant_profile_communication_channels', has_pro ? [] : [
		{
            icon: 'ch-icon ch-icon-note-favorite',
            title: __('Event'),
            renderer: ()=><Promote content="event_editor"/>,
            tagline: (
                <span className={'font-size-15 font-weight-500 color-text'.classNames()}>
                    {__('Email')}
                </span>
            )
        },
		{
            icon: 'ch-icon ch-icon-message',
            title: __('Internal Comment'),
            renderer: ()=><Promote content="comment" style={{minHeight: '600px'}}/>,
            tagline: (
                <span className={'font-size-15 font-weight-500 color-text'.classNames()}>
                    {__('Internal Comment')}
                </span>
            )
        }
	] );

    const [state, setState] = useState({
        active_segment: null
    });

    const toggleSegment = (index = null) => {
        setState({
            ...state,
            active_segment: state.active_segment === index ? null : index
        });
    };

	// Close comment, schedule form, email form on profile change
	useEffect(()=>{
		toggleSegment(null);
	}, [application_id]);

    const changeStage = (stage_id, message = __('Sure to move?')) => {
        showWarning({
            message,
            onConfirm: () => {
                loadingState();
                request('moveApplicationStage', { job_id, stage_id, application_id }, (resp) => {
                    const { success } = resp;

                    ajaxToast(resp);

                    if (success) {
                        closeWarning();
                        sessionRefresh();
                    }
                });
            },
            confirmText: __('Yes'),
			mode: 'normal'
        });
    };

    const onActionClick = (action) => {
        switch (action) {
            case 'disqualify':
                changeStage(0, __('Sure to disqualify?'));
                break;

            case 'delete':
                showWarning({
                    message: __("Sure to delete? It can't be undone."),
                    onConfirm: () => {
                        loadingState();

                        request('deleteApplication', { application_id }, (resp) => {
                            const { success } = resp;

                            ajaxToast(resp);

                            if (success) {
                                closeWarning();
                                navigate(`/dashboard/jobs/${job_id}/${stage_id}/`, {
                                    replace: true
                                });
                                sessionRefresh();
                            }
                        });
                    },
                    confirmText: __('Yes'),
                    closeText: __('No'),
					mode: 'danger'
                });
                break;
        }
    };
	
    return (
        <div
            data-crew="application"
            className={'head'.classNames(style) + 'border-radius-6 margin-bottom-13'.classNames()}
        >
            <div
                data-crew="action"
                className={'d-flex align-items-center box-shadow-thin padding-vertical-15 padding-horizontal-30'.classNames()}
            >
                <div className={'flex-1 d-flex align-items-center column-gap-24'.classNames()}>
                    {segments.map((segment, i) => {
                        let { icon, title } = segment;

                        let classes = 'font-size-20 cursor-pointer ';
                        classes += state.active_segment === i ? 'color-text' : 'color-text-lighter';

                        return <ToolTip key={i} tooltip={title} position='bottom center'>
							<i
                                className={icon.classNames() + classes.classNames()}
                                onClick={() => toggleSegment(i)}
                            ></i>
						</ToolTip>
                    })}

                    {application.disqualified ? (
                        <i>{__('Disqualified')}</i>
                    ) : (
                        <ToolTip tooltip={__('Disqualify Candidate')} position='bottom center'>
							<i
								title={__('Disqualify')}
								className={'ch-icon ch-icon-slash color-error font-size-20 cursor-pointer'.classNames()}
								onClick={() => onActionClick('disqualify')}
							></i>
						</ToolTip>
                    )}
                </div>
                <div className={'d-flex align-items-center column-gap-10'.classNames()}>
                    <span className={'font-size-15 font-weight-400 color-text'.classNames()}>
                        {__('Move to')}
                    </span>

                    <DropDown
                        className={'padding-vertical-5 padding-horizontal-12 border-1 b-color-text border-radius-5'.classNames()}
                        value={application.disqualified ? 0 : application.stage_id}
                        onChange={changeStage}
						clearable={false}
                        options={stages.map((s) => {
                            return {
                                id: s.stage_id,
                                label: s.stage_name === '_hired_' ? __('Hired') : s.stage_name
                            };
                        })}
                        variant='primary'
                        size='sm'
						iconSizeClass={'font-size-20'.classNames()}
                    />

                    <Options
                        options={application_actions}
                        onClick={(action) => onActionClick(action)}
                    >
                        <i
                            className={'ch-icon ch-icon-more color-text-light font-size-20 cursor-pointer d-inline-block'.classNames()}
                        ></i>
                    </Options>
                </div>
            </div>

			{state.active_segment===null ? null : segments.map((segment, i)=>{

				const {
					renderer,
					icon: active_icon,
					tagline
				} = segment;

				// Render all together and show using css in favour of showing persistent content between component switch.
				return <div
						key={i}
						className={'position-relative'.classNames() + 'content-area'.classNames(style)}
						style={{display: state.active_segment===i ? '' : 'none'}}
					>
					<div className={'d-flex align-items-center margin-bottom-15'.classNames()}>
						<div className={'flex-1'.classNames()}>
							<span
								className={`d-inline-block ch-icon ${active_icon} font-size-20 color-text margin-right-10 vertical-align-middle`.classNames()}
							></span>{' '}
							{tagline}
						</div>

						<div>
							<i
								className={'ch-icon ch-icon-times font-size-24 color-text-light margin-left-10 cursor-pointer'.classNames()}
								onClick={() => toggleSegment()}
							></i>
						</div>
					</div>
					<RenderExternal 
						component={renderer} 
						payload={{
							application, 
							sessionRefresh, 
							onClose:()=>toggleSegment(null)
						}}
					/>
				</div>
			})}
        </div>
    );
}
