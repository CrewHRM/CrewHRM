import React from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { relationships } from 'crewhrm-materials/data.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import {AddressFields} from 'crewhrm-materials/address-fields.jsx';

export function EmergencyContactField(props) {

	const {
		onChange, 
		values={},
	} = props;

	return <>
		<div className={'d-flex column-gap-15 row-gap-10 margin-top-40'.classNames()}>
			<div style={{ width: 'calc(100% - 230px)' }}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Full name')}
				</div>
				<TextField 
					placeholder={__('ex. John Doe')} 
					value={values.emergency_full_name || ''} 
					onChange={(v) => onChange('emergency_full_name', v)}
				/>
			</div>
			<div style={{ width: '230px' }}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Relationship')}
				</div>
				<DropDown
					value={values.emergency_relationship}
					placeholder="Select"
					onChange={(v) => onChange('emergency_relationship', v)}
					options={Object.keys(relationships).map((rel) => {
						return { 
							id: rel, 
							label: relationships[rel]
						};
					})}
				/>
			</div>
		</div>

		<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Phone number')}
				</div>
				<TextField
					placeholder={__('ex 123 456 7890')}
					value={values.emergency_phone || ''}
					type="tel"
					onChange={(v) => onChange('emergency_phone', v)}
				/>
			</div>
			<div className={'flex-2'.classNames()}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Email Address')}
				</div>
				<TextField
					placeholder={__('ex. emergency@email.com')}
					value={values.emergency_email || ''}
					type="email"
					onChange={(v) => onChange('emergency_email', v)}
				/>
			</div>
		</div>

		<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
			<div>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Address')}
				</div>
			</div>
		</div>
		<div className={''.classNames()}>
			<AddressFields
				unit_field={true}
				values={values}
				name_prefix="emergency_"
				onChange={(name, value)=>onChange(name, value)}/>
		</div>
	</>
}