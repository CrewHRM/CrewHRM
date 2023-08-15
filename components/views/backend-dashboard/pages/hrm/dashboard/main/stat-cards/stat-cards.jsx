import React from "react";

import curtains from '../../../../../../../images/curtains.svg';
import style from './cards.module.scss';
import { __ } from "../../../../../../../utilities/helpers.jsx";

const card_stats = [
	{
		label: __( 'Total Job Posts' ),
		count: 12,
		icon: curtains
	},
	{
		label: __( 'Total Applicants' ),
		count: 1232,
		icon: curtains
	},
	{
		label: __( 'Total Hired' ),
		count: 32,
		icon: curtains
	},
	{
		label: __( 'Total Pending' ),
		count: 233,
		icon: curtains
	},
];

export function StatCards() {
	return <div className={'card-wrapper'.classNames(style)}>
		{card_stats.map(stat=>{
			let {label, count, icon} = stat;

			return <div key={label} className={'card'.classNames(style) + 'box-shadow-thin border-radius-5 padding-25 margin-bottom-20'.classNames()}>
				<img src={icon}/>
				<span className={'strong'.classNames(style) + 'text-color-primary'.classNames()}>
					{count}
				</span>
				<span className={'text-color-secondary'.classNames()}>
					{label}
				</span>
			</div>
		})}
	</div>
}
