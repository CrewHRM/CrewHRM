import React from "react";

import { CoverImage } from "../../../materials/image/image.jsx";
import { __ } from "../../../utilities/helpers.jsx";

import hero from '../../../images/hero.png';
import style from './head.module.scss';

export function CareersHeader(props) {
	return <div data-crewhrm-selector="careers-header">
		<CoverImage src={hero} width="100%" className={'padding-vertical'}>
			<span className={'d-block font-size-38 font-weight-500 line-height-24 letter-spacing--38 text-color-white padding-vertical-50 margin-top-25 margin-bottom-25'.classNames()}>
				{__( 'Small teams, global mission' )}
			</span>
		</CoverImage>
	</div>
}
