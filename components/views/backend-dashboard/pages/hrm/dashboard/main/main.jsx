import React from "react";
import { __ } from "../../../../../../utilities/helpers.jsx";

import { StatCards } from "./stat-cards/stat-cards.jsx";
import { Calendar } from "./calendar/calendar.jsx";

import style from './main.module.scss';

export function DahboardMain() {
	return <div className={'h-full'.classNames() + 'wrapper'.classNames(style)}>
		<div className={'sidebar'.classNames(style)}>
			<StatCards/>
			<Calendar/>
		</div>
		<div className={'content-area'.classNames(style)}>
			Here you go
		</div>
	</div>
}