import React, { useContext, useEffect, useState } from 'react';
import TimeAgo from 'javascript-time-ago';
import { useParams } from 'react-router-dom';
import en from 'javascript-time-ago/locale/en';

import { CoverImage } from 'crewhrm-materials/image/image.jsx';
import { Line } from 'crewhrm-materials/line/line.jsx';
import { ContextApplicationSession } from '../../applicants.jsx';
import { request } from 'crewhrm-materials/request.jsx';

import style from './activity.module.scss';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo();

function Ago({ timestamp }) {
    return (
        <span
            className={'d-inline-block font-size-15 font-weight-400 line-height-24 letter-spacing--15 color-text-light'.classNames()}
        >
            &middot; {timeAgo.format(new Date(timestamp * 1000))}
        </span>
    );
}

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
            <Ago timestamp={timestamp} />
        </>
    );
}

function LayoutComment(props) {
    let { by, timestamp, comment, attachments = [] } = props.activity;
    return (
        <>
            <div className={'margin-bottom-5'.classNames()}>
                <span
                    className={'font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text'.classNames()}
                >
                    {by}
                </span>{' '}
                <span
                    className={'font-size-17 font-weight-400 line-height-24 letter-spacing--17 color-text'.classNames()}
                >
                    added a comment
                </span>{' '}
                <Ago timestamp={timestamp} />
            </div>
            <div
                className={'font-size-15 font-weight-400 line-height-24 letter-spacing--15 color-text'.classNames()}
            >
                {comment}
            </div>

            {attachments.length ? (
                <div className={'comment-attachments'.classNames(style)}>
                    {attachments.map((attachment) => {
                        return (
                            <CoverImage
                                src={attachment.url}
                                height={50}
                                className={'border-radius-5'.classNames()}
                            />
                        );
                    })}
                </div>
            ) : null}
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
            <Ago timestamp={timestamp} />
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
            <Ago timestamp={timestamp} />
        </>
    );
}

const activity_handlers = {
    apply: {
        icon: 'ch-icon ch-icon-user-tick font-size-24 color-text-light',
        renderer: LayoutApply
    },
    comment: {
        icon: 'ch-icon ch-icon-message-text-1 font-size-24 color-text-light',
        renderer: LayoutComment
    },
    move: {
        icon: 'ch-icon ch-icon-trello font-size-24 color-text-light',
        renderer: LayoutMove
    }
};

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

        request('get_application_pipeline', { application_id }, (resp) => {
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
        <div data-crewhrm-selector="activity" className={'activities'.classNames(style)}>
            {state.pipeline.map((activity, i) => {
                let { avatar_url, type } = activity;
                let { renderer: Comp, icon } = activity_handlers[type];

                if (activity.type === 'move' && activity.stage_name === '_disqualified_') {
                    icon = 'ch-icon ch-icon-slash color-error font-size-24';
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
                                <Comp activity={activity} />
                            </div>
                            <div className={'align-self-center'.classNames()}>
                                <i className={icon.classNames()}></i>
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
