import React from 'react';
import { CircularProgress } from '../circular.jsx';

import style from './loading.module.scss';

export function LoadingIcon({ size, center=false }) {
    return (
        <div data-crewhrm-selector="loading-icon" className={`${center ? 'd-block text-align-center' : 'd-inline-block'}`.classNames()}>
            <CircularProgress size={size} percentage={75} className={'rotate'.classNames(style)} />
        </div>
    );
}
