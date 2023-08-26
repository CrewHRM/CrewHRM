import React from 'react';

import style from './status.module.scss';

export function StatusDot(props) {
    const { size = 9, color, className = '' } = props;

    const css = {
        width: size + 'px',
        height: size + 'px',
        backgroundColor: color
    };

    return (
        <div
            data-crewhrm-selector="status-dot"
            className={'d-inline-block'.classNames() + 'square'.classNames(style) + className}
            style={css}
        ></div>
    );
}
