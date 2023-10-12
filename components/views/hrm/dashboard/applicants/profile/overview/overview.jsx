import React from 'react';

import { __, formatDate, replaceUrlsWithAnchors } from 'crewhrm-materials/helpers.jsx';
import { Line } from 'crewhrm-materials/line/line.jsx';
import { DangerouslySet } from 'crewhrm-materials/dangerously-set.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import { genders } from 'crewhrm-materials/data.jsx';

import style from './overview.module.scss';

export function OverView({ application = {} }) {
    const { overview = [], gender, date_of_birth } = application;

	const basics = [];

	// Gender
	if (gender) {
		basics.push({
			id: 'gender',
			label: __('Gender'),
			text: genders[ gender ] || gender
		})
	}

	// DOB
	if (date_of_birth) {
		basics.push({
			id: 'dob',
			label: __('Date of Birth'),
			text: formatDate( date_of_birth )
		})
	}

	const data_list = [
		...basics, 
		...overview
	];

    return (
        <div data-crewhrm-selector="overview" className={'overview'.classNames(style)}>
            {data_list.map((q, i) => {
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
								data-crewhrm-selector="skills"
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
                            show={i < data_list.length - 1}
                            className={'margin-top-20 margin-bottom-20'.classNames()}
                        />
                    </div>
                );
            })}

			<Conditional show={!data_list.length}>
				<div className={'color-warning'.classNames()}>{__('No data!')}</div>
			</Conditional>
        </div>
    );
}
