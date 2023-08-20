import React, {useContext} from "react";

import { __, countries_array } from "../../../../../../../utilities/helpers.jsx";
import { ContextJobDetails } from "../job-details.jsx";
import style from '../details.module.scss';
import { DropDown } from "../../../../../../../materials/dropdown/dropdown.jsx";

const location_types = {
	on_site : __( 'On-Site' ),
	remote  : __( 'Fully Remote' ),
	hybrid  : __( 'Hybrid' )
}

export function Location() {

	const {
		input_class, 
		section_title_class, 
		field_label_class,
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
						<label key={type} className={input_class + 'd-flex align-items-center column-gap-8'.classNames()} style={{paddingTop: 0, paddingBottom: 0}}>
							<input type="checkbox"/>
							<span>{location_types[type]}</span>
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
						options={countries_array}
						onChange={v=>setVal('country_code', v)}
						className={input_class}/>
				</div>
			</div>
			<div className={'right-col'.classNames(style)}>
				
			</div>
		</div>
	</>
}