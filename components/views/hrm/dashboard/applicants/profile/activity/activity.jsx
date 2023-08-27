import React from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import avatar from '../../../../../../images/avatar.svg';
import attachment from '../../../../../../images/attachment.png';
import { CoverImage } from '../../../../../../materials/image/image.jsx';
import { Line } from '../../../../../../materials/line/line.jsx';
import style from './activity.module.scss';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo();

function Ago(props) {
    return (
        <span
            className={'d-inline-block font-size-15 font-weight-400 line-height-24 letter-spacing--15 color-text-light'.classNames()}
        >
            &middot; {timeAgo.format(new Date(props.date))}
        </span>
    );
}

function LayoutDisqualify(props) {
    let { by, date_time } = props.activity;
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
            <Ago date={date_time} />
        </>
    );
}

function LayoutComment(props) {
    let { by, date_time, comment, attachments = [] } = props.activity;
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
                <Ago date={date_time} />
            </div>
            <div
                className={'font-size-15 font-weight-400 line-height-24 letter-spacing--15 color-text'.classNames()}
            >
                {comment}
            </div>

            {(attachments.length && (
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
            )) ||
                null}
        </>
    );
}

function LayoutMove(props) {
    let { by, date_time, to } = props.activity;
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
            <Ago date={date_time} />
        </>
    );
}

function LayoutApply(props) {
    let { by, date_time } = props.activity;
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
            <Ago date={date_time} />
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
    },
    disqualify: {
        icon: 'ch-icon ch-icon-slash color-danger font-size-24',
        renderer: LayoutDisqualify
    }
};

const acitivities = [
    {
        type: 'disqualify',
        by: 'Darlene Robertson',
        avatar_url: avatar,
        date_time: '2023-05-11 05:34'
    },
    {
        type: 'move',
        by: 'Jerome Bell',
        avatar_url: avatar,
        to: 'Assesment',
        date_time: '2023-04-24 05:34'
    },
    {
        type: 'comment',
        by: 'Brooklyn Simmons',
        avatar_url: avatar,
        comment: "OK, I'll get in touch and arrange the call",
        date_time: '2023-03-24 05:34'
    },
    {
        type: 'comment',
        by: 'Jacob Jones',
        avatar_url: avatar,
        comment: 'Looks like a good candidate. should we arrange a call?',
        attachments: [
            {
                attachment_id: 12,
                url: attachment,
                mime_type: 'image/png'
            },
            {
                attachment_id: 13,
                url: attachment,
                mime_type: 'image/png'
            },
            {
                attachment_id: 14,
                url: attachment,
                mime_type: 'image/png'
            },
            {
                attachment_id: 15,
                url: attachment,
                mime_type: 'image/png'
            }
        ],
        date_time: '2023-03-14 05:34'
    },
    {
        type: 'apply',
        by: 'Bessie Cooper',
        avatar_url: avatar,
        date_time: '2023-03-12 15:34'
    }
];

export function Activity() {
    return (
        <div data-crewhrm-selector="activity" className={'activities'.classNames(style)}>
            {acitivities.map((activity, i) => {
                let { avatar_url, type } = activity;
                let { renderer: Comp, icon } = activity_handlers[type];

                return [
                    <div key={i} className={'d-flex'.classNames()}>
                        <div>
                            <CoverImage src={avatar_url} width={26} circle={true} />
                        </div>
                        <div className={'flex-1 margin-left-10 margin-right-25'.classNames()}>
                            <Comp activity={activity} />
                        </div>
                        <div className={'align-self-center'.classNames()}>
                            <i className={icon.classNames()}></i>
                        </div>
                    </div>,
                    <Line
                        key={i + '_2'}
                        show={i < acitivities.length - 1}
                        className={'margin-top-20 margin-bottom-20'.classNames()}
                    />
                ];
            })}
        </div>
    );
}
