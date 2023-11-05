import React, { useContext } from 'react';
import { ContextBackendDashboard } from '../../hrm.jsx';

import style from './notice.module.scss';

export function NoticeBar() {
    const { notices = [], deleteNotice } = useContext(ContextBackendDashboard);

    return (
        (!notices.length && null) || (
            <>
                {notices.map((notice) => {
                    let { id, content, type } = notice;

                    return (
                        <div
                            data-crew="notice"
                            key={id}
                            className={
                                'd-flex align-items-center justify-content-center padding-vertical-8 padding-horizontal-20 width-p-100 margin-bottom-2'.classNames() +
                                `notice ${type}`.classNames(style)
                            }
                        >
                            <div>{content}</div>
                            <i
                                className={'ch-icon ch-icon-times font-size-24 color-white cursor-pointer position-absolute right-18'.classNames()}
                                onClick={() => deleteNotice(id)}
                            ></i>
                        </div>
                    );
                })}
            </>
        )
    );
}
