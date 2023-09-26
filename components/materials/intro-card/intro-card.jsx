import React from 'react';

import style from './intro.module.scss';

import megaphone from '../../images/megaphone.png';
import designer_working from '../../images/designer-working.png';
import being_creative from '../../images/being-creative.png';

const images = {
    megaphone,
    designer_working,
    being_creative
};

export function IntroCard(props) {
    const { image, className = '', orientation = 'horizontal', style: cssStyle={} } = props;

    const is_horizontal = orientation == 'horizontal';
    const image_url = images[image];

    return (
        <div
            data-crewhrm-selector={'intro-card-' + orientation}
            className={
                `intro orientation-${orientation}`.classNames(style) +
                'bg-color-white border-radius-5'.classNames() +
                className
            }
            style={{ backgroundImage: 'url(' + image_url + ')', ...cssStyle }}
        >
            <div className={'content'.classNames(style)}>{props.children}</div>
            <div className={'image'.classNames(style)}>
                {(!is_horizontal && <img src={image_url} />) || null}
            </div>
        </div>
    );
}
