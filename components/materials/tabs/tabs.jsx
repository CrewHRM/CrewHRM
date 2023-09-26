import React, { useEffect, useRef, useState } from 'react';

import { Conditional } from '../conditional.jsx';
import style from './tabs.module.scss';

export function Tabs(props) {
    const { onNavigate, active, tabs = [], theme, className = '', style: cssStyle = {}, scrollIntoViewOnChange=false } = props;
    const active_index = tabs.findIndex((tab) => tab.id == active);

	const ref = useRef();

	const [state, setState] = useState({
		mounted: false
	});

	useEffect(()=>{
		if ( ! scrollIntoViewOnChange ) {
			return;
		}
		
		if ( !state.mounted ) {
			setState({...state, mounted: true});
			return;
		}

		// Brig the tab at the top
		if ( ref && ref.current ) {
			ref.current.scrollIntoView(true);
		}

	}, [active]);

    return (
        <div
            data-crewhrm-selector={'tabs-' + theme}
            className={`tabs theme-${theme}`.classNames(style) + className}
            style={cssStyle}
			ref={ref}
        >
            {tabs.map((tab, index) => {
                let { id, label } = tab;

                let fill_class = '';
                fill_class += index <= active_index ? 'fill-left ' : '';
                fill_class += index < active_index ? 'fill-right' : '';
                fill_class += index == active_index ? 'fill-right-gradient' : '';

                return (
                    <div
                        key={id}
                        className={
                            `single-step ${id === active ? 'active' : ''}`.classNames(style) +
                            `${onNavigate ? 'cursor-pointer' : ''}`.classNames()
                        }
                        onClick={() => (onNavigate ? onNavigate(id) : null)}
                    >
                        {label}
						<Conditional show={theme == 'sequence'}>
							<div
                                className={`sequence-line-wrapper ${fill_class}`.classNames(style)}
                            >
                                <div>
									<Conditional show={index > 0}>
										<div className={'hr hr-1'.classNames(style)}></div>
									</Conditional>
                                </div>
                                <div className={'circle'.classNames(style)}></div>
                                <div>
									<Conditional show={index < tabs.length - 1}>
										<div className={'hr hr-2'.classNames(style)}></div>
									</Conditional>
                                </div>
                            </div>
						</Conditional>
                    </div>
                );
            })}
        </div>
    );
}
