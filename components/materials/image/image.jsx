import React from 'react';

import style from './image.module.scss';
import { generateBackgroundColor, getInitials } from '../../utilities/helpers.jsx';

// To Do: Add a mode to to determine height based on ratio automatically.
export function CoverImage(props) {
    const { src, children, backgroundColor, height, width, circle, className = '', name } = props;

    const _height = height || width;
    const css = {
        backgroundColor: backgroundColor || (name ? generateBackgroundColor(name) : null),
        backgroundImage: src ? 'url(' + src + ')' : null,
        width: width ? width + (!isNaN(width) ? 'px' : '') : 'auto',
        height: _height ? _height + (!isNaN(_height) ? 'px' : '') : 'auto'
    };

    return (
        <div
            data-crewhrm-selector="image"
            className={
                `cover-image ${circle ? 'circle' : ''}`.classNames(style) +
                'd-flex align-items-center justify-content-center'.classNames() +
                className
            }
            style={css}
        >
            {children ? (
                children
            ) : !src && name ? (
                <span
                    className={'font-weight-500 text-transform-uppercase'.classNames()}
                    style={{ fontSize: (width / 3) * 1.1 + 'px', color: 'inherit' }}
                >
                    {getInitials(name)}
                </span>
            ) : null}
        </div>
    );
}
