import React, { useEffect } from 'react';

import style from './style.module.scss';

export function WpDashboardFullPage(props) {
    const { children } = props;

    useEffect(() => {
        const wrapper = document.getElementById('wpcontent');
        wrapper.style.padding = 0;
        wrapper.style.paddingLeft = 0;
        wrapper.style.paddingRight = 0;
        wrapper.style.paddingBottom = 0;
    }, []);

    return (
        <div data-crewhrm-selector="wp-dashboard" className={'wrapper'.classNames(style)}>
            {children}
        </div>
    );
}
