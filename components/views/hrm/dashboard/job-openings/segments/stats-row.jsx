import React from 'react';
import { Line } from 'crewhrm-materials/line/line.jsx';
import { HorizontalOverflow } from 'crewhrm-materials/horizontal-overflow.jsx';

export function StatsRow({ stats }) {

    return <HorizontalOverflow>
		<div 
			className={'d-flex align-items-center column-gap-27 justify-content-space-between padding-vertical-15 padding-horizontal-20'.classNames()}
		>
			{stats.map(({ key, label, content }, index) => {
				let is_last = index == stats.length - 1;
				return [
					<div key={key} style={!is_last ? {} : { paddingRight: '20px' }}>
						<div>
							<span
								className={'d-block color-text-light font-size-14 font-weight-400 margin-bottom-7 white-space-nowrap'.classNames()}
							>
								{label}
							</span>
							<span className={'d-block color-text font-size-17 font-weight-600'}>
								{content}
							</span>
						</div>
					</div>,
					!is_last ? <Line key={key + '_separator'} orientation="vertical" /> : null
				];
			})}
		</div>
	</HorizontalOverflow> 
}
