import React from "react";
import { getRandomString } from "../../utilities/helpers.jsx";

import style from './switch.module.scss';

export function ToggleSwitch(props) {
	const {className=''} = props;
	const id = getRandomString();
	return <div className={'d-inline-block'.classNames() + 'switch'.classNames(style) + className}>
		<input type="checkbox" id={id} data-checkbox-type="toggle"/>
		<label for={id}></label>
	</div>
}