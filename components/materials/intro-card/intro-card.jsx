import React from "react";

import style from './intro.module.scss';

import megaphone from '../../images/megaphone.png';
import designer_working from '../../images/designer-working.png';
import being_creative from '../../images/being-creative.png';

const images = {
	megaphone,
	designer_working,
	being_creative,
}

export function IntroCard(props) {
	const {image, className=''} = props;

	return <div className={'intro'.classNames(style) + 'background-color-white border-radius-5'.classNames() + className} style={{backgroundImage: 'url('+images[image]+')'}}>
		<div>
			{props.children}
		</div>
		<div></div>
	</div>
}