import React from 'react';

import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { countries_array } from 'crewhrm-materials/data.jsx';

export function AddressFields({values:{street_address='', city, zip_code, province, country_code}, className, onChange}) {
	return <div>
		<TextField
			value={street_address}
			className={className + 'margin-bottom-10'.classNames()}
			onChange={(v) => onChange('street_address', v)}
			placeholder={__('Street Address')}
		/>

		<div className={'d-flex align-items-center column-gap-10 margin-bottom-10'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<TextField
					value={city}
					className={className}
					onChange={(v) => onChange('city', v)}
					placeholder={__('City')}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<TextField
					value={province}
					className={className}
					onChange={(v) => onChange('province', v)}
					placeholder={__('Province')}
				/>
			</div>
		</div>

		<div className={'d-flex align-items-center column-gap-10'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<TextField
					value={zip_code}
					className={className}
					onChange={(v) => onChange('zip_code', v)}
					placeholder={__('Postal/Zip Code')}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<DropDown
					value={country_code}
					className={className}
					onChange={(v) => onChange('country_code', v)}
					options={countries_array}/>
			</div>
		</div>
	</div>
}
