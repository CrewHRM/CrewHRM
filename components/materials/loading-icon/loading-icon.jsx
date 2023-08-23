import React from "react";
import { CircularProgress } from "../progress/circular.jsx";

import style from './loading.module.scss';

export function LoadingIcon({size}) {
	return <div className={'d-inline-block'.classNames()}>
		<CircularProgress size={size} percentage={75} className={'rotate'.classNames(style)}/>
	</div>
}