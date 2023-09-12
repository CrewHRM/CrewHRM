import React from 'react';
import { CircularProgress } from '../circular.jsx';

import style from './loading.module.scss';

export function LoadingIcon({ size, center = false, color, colorSecondary = 'transparent' }) {
    return (
        <div
            data-crewhrm-selector="loading-icon"
            className={`${center ? 'd-block text-align-center' : 'd-inline-block'}`.classNames()}
        >
            <CircularProgress
                size={size}
                percentage={75}
                color={color}
                colorSecondary={colorSecondary}
                className={'rotate'.classNames(style)}
            />
        </div>
    );
}
