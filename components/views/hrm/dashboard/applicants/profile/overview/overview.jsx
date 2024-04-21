import React from 'react';

import { __, replaceUrlsWithAnchors } from 'crewhrm-materials/helpers.jsx';
import { Line } from 'crewhrm-materials/line/line.jsx';
import { DangerouslySet } from 'crewhrm-materials/dangerously-set.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';

import style from './overview.module.scss';

export function OverView({ overview=[] }) {
    
    return (
        <div data-cylector="overview" className={'overview'.classNames(style)}>
            {overview.map((q, i) => {
                const { id, label, text, text_options = [] } = q;

                return (
                    <div key={id}>
                        <span
                            className={'d-block font-size-17 font-weight-500 line-height-24 letter-spacing--17 color-text margin-bottom-1'.classNames()}
                        >
                            {label}
                        </span>

						<Conditional show={text}>
							<DangerouslySet
								className={'d-block font-size-15 font-weight-400 line-height-22 letter-spacing--15 color-text'.classNames()}
							>
								{replaceUrlsWithAnchors(text || '')}
							</DangerouslySet>
						</Conditional>
						
						<Conditional show={text_options}>
							<div
								data-cylector="skills"
								className={'d-flex flex-wrap-wrap flex-direction-row row-gap-15 column-gap-15'.classNames()}
							>
								{(text_options || []).map((o) => {
									let { id, label } = o;
									return (
										<div
											key={id}
											className={
												'single-skill'.classNames(style) +
												'd-inline-block padding-vertical-5 padding-horizontal-20 font-size-15 font-weight-500 line-height-24 letter-spacing--15 color-text'.classNames()
											}
										>
											{label}
										</div>
									);
								})}
							</div>
						</Conditional>
						
                        <Line
                            show={i < overview.length - 1}
                            className={'margin-top-20 margin-bottom-20'.classNames()}
                        />
                    </div>
                );
            })}
        </div>
    );
}
