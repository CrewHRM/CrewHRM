import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { DropDown, Options } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { ContextApplicationSession } from '../../applicants.jsx';
import { ContextWarning } from 'crewhrm-materials/warning/warning.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import { applyFilters } from 'crewhrm-materials/hooks.jsx';
import { RenderExternal } from 'crewhrm-materials/render-external.jsx';

import style from './head.module.scss';

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
    const { application_id, job_id } = useParams();
    const { ajaxToast } = useContext(ContextToast);
    const navigate = useNavigate();

    const segments = applyFilters( 'applicant_profile_communication_channels', [] );

    const [state, setState] = useState({
        active_segment: null
    });

    const toggleSegment = (index = null) => {
        setState({
            ...state,
            active_segment: state.active_segment === index ? null : index
        });
    };

    const changeStage = (stage_id, message = __('Sure to move?')) => {
        showWarning(
            message,
            () => {
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
            null,
            __('Yes')
        );
    };

    const onActionClick = (action) => {
        switch (action) {
            case 'disqualify':
                changeStage('_disqualified_', __('Sure to disqualify?'));
                break;

            case 'delete':
                showWarning(
                    __("Sure to delete? It can't be undone."),
                    () => {
                        loadingState();

                        request('deleteApplication', { application_id }, (resp) => {
                            const { success } = resp;

                            ajaxToast(resp);

                            if (success) {
                                closeWarning();
                                navigate(`/dashboard/jobs/${job_id}/applications/`, {
                                    replace: true
                                });
                                sessionRefresh();
                            }
                        });
                    },
                    null,
                    __('Yes'),
                    __('No')
                );
                break;
        }
    };
	
    return (
        <div
            data-crew="application"
            className={'head'.classNames(style) + 'margin-bottom-13'.classNames()}
        >
            <div
                data-crew="action"
                className={'d-flex align-items-center box-shadow-thin padding-vertical-15 padding-horizontal-30'.classNames()}
            >
                <div className={'flex-1 d-flex align-items-center'.classNames()}>
                    {segments.map((segment, i) => {
                        let { icon, title } = segment;

                        let classes = 'font-size-20 cursor-pointer margin-right-24 ';
                        classes += state.active_segment === i ? 'color-text' : 'color-text-lighter';

                        return (
                            <i
                                key={i}
                                title={title}
                                className={icon.classNames() + classes.classNames()}
                                onClick={() => toggleSegment(i)}
                            ></i>
                        );
                    })}

                    {application.disqualified ? (
                        <i>{__('Disqualified')}</i>
                    ) : (
                        <i
                            title={__('Disqualify')}
                            className={'ch-icon ch-icon-slash color-error font-size-20 cursor-pointer'.classNames()}
                            onClick={() => onActionClick('disqualify')}
                        ></i>
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

			{segments.map((segment, i)=>{

				const {
					renderer,
					icon: active_icon,
					tagline
				} = segment;

				// Render all together and show using css in favour of showing persistent content between component switch.
				return <div
						key={i}
						className={'content-area'.classNames(style)}
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
						payload={{application, sessionRefresh, onClose:()=>toggleSegment(null)}}/>
				</div>
			})}
        </div>
    );
}
