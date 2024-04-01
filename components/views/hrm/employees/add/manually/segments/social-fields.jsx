import React from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { patterns, social_icons as social_fields } from 'crewhrm-materials/data.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';

export function SocialFields(props) {

	const {
		onChange, 
		values={}, 
		showErrorsAlways=false, 
	} = props;

	return <>
		{
			Object.keys(social_fields).map(social=>{
				return <div key={social} className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<TextField
							placeholder={__('https://')}
							value={values[`social_link_${social}`] || ''}
							image={social_fields[social]}
							type="url"
							required={false}
							regex={patterns.url}
							showErrorsAlways={showErrorsAlways}
							onChange={(v) => onChange(`social_link_${social}`, v)}
						/>
					</div>
				</div>
			})
		}
	</>
}
