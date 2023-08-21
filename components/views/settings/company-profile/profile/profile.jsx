import React from "react";
import { __, countries_array, timezones_array } from "../../../../utilities/helpers.jsx";
import { DropDown } from "../../../../materials/dropdown/dropdown.jsx";
import { CoverImage } from "../../../../materials/image/image.jsx";

import logo from '../../../../images/attachment.png';

const section_label_class = 'd-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 text-color-light text-transform-uppercase margin-bottom-20'.classNames();
const label_class = 'd-block font-size-15 font-weight-500 margin-bottom-10 text-color-primary'.classNames();
const input_text_class = 'd-block w-full height-48 padding-15 border-1-5 border-radius-10 border-color-tertiary border-focus-color-primary font-size-15 font-weight-400 line-height-24 letter-spacing--15 text-color-primary'.classNames();
const text_area_class = 'd-block w-full padding-vertical-15 padding-horizontal-20 border-1-5 border-radius-10 border-color-tertiary border-focus-color-primary font-size-15 font-weight-400 line-height-25 text-color-primary'.classNames();

// Do not edit or delete keys. Only can add more. 
const business_types = {
	agriculture_naturalresources : __( 'Agriculture & Natural Resources' ),
	extraction_mining            : __( 'Extraction & Mining' ),
	energy_utilities             : __( 'Energy & Utilities' ),
	construction_infrastructure  : __( 'Construction & Infrastructure' ),
	manufacturing_production     : __( 'Manufacturing & Production' ),
	wholesale_distribution       : __( 'Wholesale & Distribution' ),
	retail_consumergoods         : __( 'Retail & Consumer Goods' ),
	transportation_logistics     : __( 'Transportation & Logistics' ),
	technology_communication     : __( 'Technology & Communication' ),
	finance_insurance            : __( 'Finance & Insurance' ),
	realestate_property          : __( 'Real Estate & Property' ),
	professionalservices         : __( 'Professional Services' ),
	healthcare_wellness          : __( 'Healthcare & Wellness' ),
	entertainment_media          : __( 'Entertainment & Media' ),
	hospitality_tourism          : __( 'Hospitality & Tourism' ),
	education_training           : __( 'Education & Training' ),
	nonprofit_socialservices     : __( 'Non-Profit & Social Services' ),
	government_publicservices    : __( 'Government & Public Services' )
}

const date_formats = [
	'F j, Y',
	'Y-m-d',
	'm/d/Y',
	'd/m/Y'
];

const time_formats = {
	_12 : __( '12 Hours' ),
	_24 : __( '24 Hours' ),
}

const sections = {
	basic_info: {
		section_label: __( 'Basic Info' ),
		fields: [
			[
				{
					name        : 'company_name',
					label       : __( 'Company Name' ),
					type        : 'text',
					required    : true,
					flex        : 3,
					placeholder : __( 'ex. ABC' )
				},
				{
					name      : 'business_type',
					label     : __( 'Business Type' ),
					type      : 'dropdown',
					required  : true,
					flex      : 2,
					options   : Object.keys(business_types).map(type=>{return {id: type, label: business_types[type]}})
				}
			]
		]
	},
	about_comp: {
		fields: [
			{
				name        : 'about_company',
				label       : __( 'About Company' ),
				type        : 'textarea',
				placeholder : __( 'Enter your job description here; include key areas responsibility and specific qualification needed to perform the role.' )
			}
		]
	},
	contact: {
		section_label: __( 'Contact' ),
		fields: [
			{
				name        : 'street_address',
				label       : __( 'Address' ),
				type        : 'text',
				placeholder : __( 'Street Address' )
			},
			[
				{
					name        : 'city',
					type        : 'text',
					placeholder : __( 'City' )
				},
				{
					name        : 'province',
					type        : 'text',
					placeholder : __( 'Province/State' )
				}
			],
			[
				{
					name        : 'zip_code',
					type        : 'text',
					placeholder : __( 'Postal/Zip Code' )
				},
				{
					name        : 'country_code',
					type        : 'dropdown',
					options     : countries_array
				}
			]
		]
	},
	phone: {
		fields: [
			[
				{
					name        : 'phone_number',
					label       : __( 'Phone' ),
					type        : 'text',
					placeholder : '123 456 789'
				},
				{
					name        : 'mobile_number',
					label       : __( 'Mobile' ),
					type        : 'text',
					placeholder : '123 456 789'
				}
			]
		]
	},
	email: {
		fields: [
			[
				{
					name        : 'recruiter_email',
					label       : __( 'Recruiter Email' ),
					type        : 'text',
					placeholder : '@company.com',
					required    : true
				},
				{
					name        : 'other_email',
					label       : __( 'Other Email' ),
					type        : 'text',
					placeholder : '@company.com'
				}
			]
		]
	},
	website: {
		fields: [
			{
				name        : 'website',
				label       : __( 'Website' ),
				type        : 'text',
				placeholder : 'https://',
			}
		]
	},
	date_time: {
		section_label: __( 'Date and Time' ),
		fields: [
			[
				{
					name     : 'timezone',
					label    : __( 'Time Zone' ),
					type     : 'dropdown',
					options : timezones_array
				},
				{
					name     : 'date_format',
					label    : __( 'Date Format' ),
					type     : 'dropdown',
					options : date_formats.map(f=>{return {id: f, label: f}})
				},
				{
					name     : 'time_format',
					label    : __( 'Time Format' ),
					type     : 'dropdown',
					options : Object.keys(time_formats).map(f=>{return {id: f, label: time_formats[f]}})
				}
			]
		]
	}
}

export function CompanyProfile() {

	function RenderField({field}) {
		const {name, label, type, placeholder, flex=1, options} = field;

		return <div className={('flex-'+flex).classNames()}>
			
			<span className={label_class}>{label}</span>
			
			{type=='text' && <input type="text" className={input_text_class} placeholder={placeholder}/> || null}
			
			{type=='textarea' && <textarea className={text_area_class} placeholder={placeholder}></textarea> || null}

			{type=='dropdown' && <DropDown options={options} className={input_text_class}/> || null}
		</div>
	}

	return <>

		<div className={'d-flex align-items-end column-gap-28 margin-bottom-32'.classNames()} style={{marginTop: '-70px'}}>
			<CoverImage 
				src={logo}
				width={120}
				className={'border-5 border-color-tertiary border-radius-10'.classNames()}/>
			<div>
				<span className={'d-block font-size-15 font-weight-500 text-color-light margin-bottom-10'.classNames()}>
					{__( 'Company Logo' )}
				</span>
				<button className={'button button-primary button-outlined button-small margin-bottom-5'.classNames()}>
					{__( 'Upload Logo' )}
				</button>
			</div>
		</div>

		{Object.keys(sections).map(section_key=>{
			const {section_label, fields=[]} = sections[section_key];
			return <div key={section_key} className={'profile'.classNames() + 'margin-bottom-30'.classNames()}>

				<span className={section_label_class}>
					{section_label}
				</span>

				{fields.map((field, index)=>{
					if ( !Array.isArray(field) ) {
						return <RenderField key={index} field={field}/>
					}
					return <div key={index} className={'d-flex column-gap-20'.classNames()}>
						{field.map((f, i)=><RenderField key={i} field={f}/>)}
					</div>		
				})}
			</div>
		})}
	</>
}