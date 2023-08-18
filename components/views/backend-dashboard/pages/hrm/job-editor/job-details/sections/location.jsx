import React, {useContext} from "react";

import { __, getCountries } from "../../../../../../../utilities/helpers.jsx";
import { ContextJobDetails } from "../job-details.jsx";
import { NumberField } from "../../../../../../../materials/number-field/number-field.jsx";
import { DateField } from "../../../../../../../materials/date-time/date-time.jsx";
import style from '../details.module.scss';
import { DropDown } from "../../../../../../../materials/dropdown/dropdown.jsx";

const location_types = {
	on_site : __( 'On-Site' ),
	remote  : __( 'Fully Remote' ),
	hybrid  : __( 'Hybrid' )
}

const countries = getCountries();
const country_options = Object.keys(countries).map(code=>{
	return {
		value: code,
		label: countries[code]
	}
});

export function Location() {

	const {
		textarea_class, 
		input_class, 
		section_title_class, 
		field_label_class,
		departments,
		values,
		setVal} = useContext(ContextJobDetails);

	return <>
		{/* Salary details */}
		<div className={'d-flex margin-bottom-30'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<span className={section_title_class}>
					{__( 'Location' )}
				</span>
			</div>
		</div>

		{/* Salary type */}
		<div className={'d-flex margin-bottom-30'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<span className={field_label_class}>
					{__( 'Job Location type' )}
				</span>
				{Object.keys(location_types).map(type=>{
					return <div key={type} className={'d-inline-block margin-right-20'.classNames()}>
						<label key={type} className={input_class}>
							<input type="checkbox"/> {location_types[type]}
						</label>
					</div>
				})}
			</div>
			<div className={'right-col'.classNames(style)}>
			</div>
		</div>

		{/* Job Title */}
		<div className={'d-flex margin-bottom-30'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<span className={field_label_class}>
					{__( 'Street Address' )}
				</span>
				<div>
					<input 
						type="text" 
						placeholder={__( 'ex. New York, NY 00010, USA' )} 
						className={input_class}/>
				</div>
			</div>
			<div className={'right-col'.classNames(style)}>
				<span className={field_label_class}>
					&nbsp;
				</span>
				<span className={'font-size-13 font-weight-400 text-color-light'.classNames()}>
					{__( 'Use a location to attract the most appropriate candidates' )}
				</span>
			</div>
		</div>

		{/* Job Title */}
		<div className={'d-flex margin-bottom-30'.classNames()}>
			<div className={'flex-1 d-flex'.classNames()}>
				<div className={'flex-1 margin-right-10'.classNames()}>
					<span className={field_label_class + 'white-space-nowrap'.classNames()}>
						{__( 'Zip/Postal Code' )}
					</span>
					<input type="text" className={input_class} placeholder={__( 'ex. NY 00010' )}/>
				</div>
				<div className={'flex-1 margin-left-10'.classNames()}>
					<span className={field_label_class}>
						{__( 'Country' )}
					</span>
					<DropDown
						value={values.country_code}
						options={country_options}
						onChange={v=>setVal('country_code', v)}
						className={input_class}/>
				</div>
			</div>
			<div className={'right-col'.classNames(style)}>
				
			</div>
		</div>
	</>
}