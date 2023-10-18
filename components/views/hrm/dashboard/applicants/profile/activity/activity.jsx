import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CoverImage } from 'crewhrm-materials/image/image.jsx';
import { Line } from 'crewhrm-materials/line/line.jsx';
import { ContextApplicationSession } from '../../applicants.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { applyFilters } from 'crewhrm-materials/hooks.jsx';
import { timeAgoOrAfter } from 'crewhrm-materials/helpers.jsx';
import { RenderExternal } from 'crewhrm-materials/render-external.jsx';

import style from './activity.module.scss';

function LayoutDisqualify(props) {
    let { by, timestamp } = props.activity;
    return (
        <>
            <span
                className={'font-size-17 font-weight-400 line-height-24 letter-spacing--17 color-text'.classNames()}
            >
                Disqualified by
            </span>{' '}
            <span
                className={'font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text'.classNames()}
            >
                {by}
            </span>{' '}
			{timeAgoOrAfter(timestamp)}
        </>
    );
}

function LayoutMove(props) {
    let { by, timestamp, stage_name: to } = props.activity;
    return (
        <>
            <span
                className={'font-size-17 font-weight-400 line-height-24 letter-spacing--17 color-text'.classNames()}
            >
                Moved to {to} by
            </span>{' '}
            <span
                className={'font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text'.classNames()}
            >
                {by}
            </span>{' '}
			{timeAgoOrAfter(timestamp)}
        </>
    );
}

function LayoutApply(props) {
    let { by, timestamp } = props.activity;
    return (
        <>
            <span
                className={'font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text'.classNames()}
            >
                {by}
            </span>{' '}
            <span
                className={'font-size-17 font-weight-400 line-height-24 letter-spacing--17'.classNames()}
            >
                applied
            </span>{' '}
			{timeAgoOrAfter(timestamp)}
        </>
    );
}

const activity_handlers = applyFilters(
	'crewhrm_activity_renderers',
	{
		apply: {
			icon: 'ch-icon ch-icon-user-tick font-size-24 color-text-light'.classNames(),
			renderer: LayoutApply
		},
		move: {
			icon: 'ch-icon ch-icon-trello font-size-24 color-text-light'.classNames(),
			renderer: LayoutMove
		}
	}
);

export function Activity() {
    const { session } = useContext(ContextApplicationSession);
    const { application_id } = useParams();

    const [state, setState] = useState({
        loading: true,
        pipeline: []
    });

    const getPipeline = () => {
        setState({
            ...state,
            loading: true
        });

        request('getApplicationPipeline', { application_id }, (resp) => {
            const {
                data: { pipeline = [] }
            } = resp;
            setState({
                ...state,
                loading: false,
                pipeline
            });
        });
    };

    useEffect(() => {
        getPipeline();
    }, [session, application_id]);

    return (
        <div data-crew="activity" className={'activities'.classNames(style)}>
            {state.pipeline.map((activity, i) => {
                let { avatar_url, type } = activity;
                let { renderer: Comp, icon } = activity_handlers[type] || {};

				if ( ! Comp ) {
					console.warn('Renderer not found for ' + type);
					return null;
				}

                if (activity.type === 'move' && activity.stage_name === '_disqualified_') {
                    icon = 'ch-icon ch-icon-slash color-error'.classNames();
                    Comp = LayoutDisqualify;
                }

                return (
                    <div key={i}>
                        <div className={'d-flex'.classNames()}>
                            <div>
                                <CoverImage
                                    src={avatar_url}
                                    width={26}
                                    circle={true}
                                    name={activity.by}
                                />
                            </div>
                            <div className={'flex-1 margin-left-10 margin-right-25'.classNames()}>
								<RenderExternal component={Comp} payload={{activity}}/>
                            </div>
                            <div className={'align-self-center'.classNames()}>
                                <i className={icon + 'font-size-24'.classNames()}></i>
                            </div>
                        </div>

                        {i < state.pipeline.length - 1 ? (
                            <Line
                                key={i + '_2'}
                                className={'margin-top-20 margin-bottom-20'.classNames()}
                            />
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}
