import React from 'react';
import { CircularProgress } from '../circular.jsx';

import style from './loading.module.scss';
import { Conditional } from '../conditional.jsx';

export function LoadingIcon({
    show = true,
    size,
    center = false,
    color,
    colorSecondary = 'transparent',
    className
}) {
    return (
        <Conditional show={show}>
            <div
                data-crewhrm-selector="loading-icon"
                className={
                    `${center ? 'd-block text-align-center' : 'd-inline-block'}`.classNames() +
                    className
                }
            >
                <CircularProgress
                    size={size}
                    percentage={75}
                    color={color}
                    colorSecondary={colorSecondary}
                    className={'rotate'.classNames(style)}
                />
            </div>
        </Conditional>
    );
}
