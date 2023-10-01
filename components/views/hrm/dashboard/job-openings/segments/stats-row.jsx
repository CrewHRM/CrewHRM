import React from 'react';
import { Line } from 'crewhrm-materials/line/line.jsx';

export function StatsRow({ stats }) {
    return stats.map(({ key, label, content }, index) => {
        let is_last = index == stats.length - 1;

        return [
            <div key={key} style={!is_last ? {} : { paddingRight: '5%' }}>
                <div>
                    <span
                        className={'d-block color-text-light font-size-14 font-weight-400 margin-bottom-7'.classNames()}
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
    });
}
