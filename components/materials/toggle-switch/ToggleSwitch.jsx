import React from "react";
import { getRandomString } from "../../utilities/helpers.jsx";

import style from './switch.module.scss';

export function ToggleSwitch(props) {
	const {className='', disabled=false} = props;
	const id = getRandomString();
	return <div className={`d-inline-block ${disabled ? 'disabled' : ''}`.classNames() + `switch ${disabled ? 'disabled' : ''}`.classNames(style) + className}>
		<input type="checkbox" id={id} data-checkbox-type="toggle"/>
		<label htmlFor={id}></label>
	</div>
}