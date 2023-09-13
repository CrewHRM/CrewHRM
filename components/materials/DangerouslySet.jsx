import React from 'react';

export function DangerouslySet(props) {
    let { style = {}, className, children } = props;
    return (
        <div
            className={'word-break-break-word'.classNames() + className}
            style={style}
            dangerouslySetInnerHTML={{ __html: children }}
        ></div>
    );
}
