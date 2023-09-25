import React, { useEffect } from 'react';
import moment from 'moment-timezone';

import { __, countries_array, flattenArray, timezones_array, validateValues } from '../../../../utilities/helpers.jsx';
import { CoverImage } from '../../../../materials/image/image.jsx';

import logo_placeholder from '../../../../images/logo-placeholder.svg';
import { ContextForm, FormFields } from '../../../../materials/form.jsx';
import { FileUpload } from '../../../../materials/file-ipload/file-upload.jsx';

// Do not edit or delete keys. Only can add more.
const business_types = {
    agriculture_naturalresources: __('Agriculture & Natural Resources'),
    extraction_mining: __('Extraction & Mining'),
    energy_utilities: __('Energy & Utilities'),
    construction_infrastructure: __('Construction & Infrastructure'),
    manufacturing_production: __('Manufacturing & Production'),
    wholesale_distribution: __('Wholesale & Distribution'),
    retail_consumergoods: __('Retail & Consumer Goods'),
    transportation_logistics: __('Transportation & Logistics'),
    technology_communication: __('Technology & Communication'),
    finance_insurance: __('Finance & Insurance'),
    realestate_property: __('Real Estate & Property'),
    professionalservices: __('Professional Services'),
    healthcare_wellness: __('Healthcare & Wellness'),
    entertainment_media: __('Entertainment & Media'),
    hospitality_tourism: __('Hospitality & Tourism'),
    education_training: __('Education & Training'),
    nonprofit_socialservices: __('Non-Profit & Social Services'),
    government_publicservices: __('Government & Public Services')
};

const date_formats = ['DD MMM, YYYY', 'Y-MM-D', 'MM/D/Y', 'D/MM/Y'];

const time_formats = {
    _12: __('12 Hours'),
    _24: __('24 Hours')
};

const sections = {
    basic_info: {
        section_label: __('Basic Info'),
        fields: [
            [
                {
                    name: 'company_name',
                    label: __('Company Name'),
                    type: 'text',
                    required: true,
                    flex: 3,
                    placeholder: __('ex. ABC')
                },
                {
                    name: 'business_type',
                    label: __('Business Type'),
                    type: 'dropdown',
                    required: true,
                    flex: 2,
                    options: Object.keys(business_types).map((type) => {
                        return { id: type, label: business_types[type] };
                    })
                }
            ],
            null,
            {
                name: 'about_company',
                label: __('About Company'),
                type: 'textarea_rich',
                placeholder: __(
                    "Describe your company's mission, values, size, and industry. Highlight unique selling points to give candidates insight into your culture and work environment."
                )
            }
        ]
    },
    contact: {
        section_label: __('Contact'),
        fields: [
            {
                name: 'street_address',
                label: __('Address'),
                type: 'text',
                placeholder: __('Street Address')
            },
            [
                {
                    name: 'city',
                    type: 'text',
                    placeholder: __('City')
                },
                {
                    name: 'province',
                    type: 'text',
                    placeholder: __('Province/State')
                }
            ],
            [
                {
                    name: 'zip_code',
                    type: 'text',
					validate: 'zip_code',
                    placeholder: __('Postal/Zip Code')
                },
                {
                    name: 'country_code',
                    type: 'dropdown',
                    placeholder: __('Select Country'),
                    options: countries_array
                }
            ],
            null,
            [
                {
                    name: 'phone_number',
                    label: __('Phone'),
                    type: 'text',
					validate: 'phone',
                    placeholder: '123 456 789'
                },
                {
                    name: 'mobile_number',
                    label: __('Mobile'),
                    type: 'text',
					validate: 'phone',
                    placeholder: '123 456 789'
                }
            ],
            null,
            [
                {
                    name: 'recruiter_email',
                    label: __('Recruiter Email'),
                    type: 'email',
					validate: 'email',
                    placeholder: '@company.com',
                    required: true
                },
                {
                    name: 'other_email',
                    label: __('Other Email'),
                    type: 'email',
					validate: 'email',
                    placeholder: '@company.com'
                }
            ],
            null,
            {
                name: 'website',
                label: __('Website'),
                type: 'url',
				validate: 'url',
                placeholder: 'https://'
            }
        ]
    },
    date_time: {
        section_label: __('Date and Time'),
        fields: [
            [
                {
                    name: 'timezone',
                    label: __('Time Zone'),
                    type: 'dropdown',
                    options: timezones_array
                },
                {
                    name: 'date_format',
                    label: __('Date Format'),
                    type: 'dropdown',
                    options: date_formats.map((f) => {
                        return {
                            id: f,
                            label: moment(new Date().getTime()).format(f)
                        };
                    })
                },
                {
                    name: 'time_format',
                    label: __('Time Format'),
                    type: 'dropdown',
                    options: Object.keys(time_formats).map((f) => {
                        return { id: f, label: time_formats[f] };
                    })
                }
            ]
        ]
    }
};

// Prepare rules for validation
let field_rules = [];
for( let section_name in sections ) {
	const fields = sections[section_name].fields.filter(f=>f);
	
	for( let i=0; i<fields.length; i++ ) {		
		const field = Array.isArray(fields[i]) ? flattenArray(fields[i]).filter(a=>a) : [fields[i]];
		field_rules = [...field_rules, ...field];
	}
}

export function CompanyProfile({ onChange, values, canSave }) {

	useEffect(()=>{
		canSave('profile', validateValues( values, field_rules ));
	}, [values]);

    return (
        <>
            <div
                className={'d-flex align-items-end column-gap-28 margin-bottom-32'.classNames()}
                style={{ marginTop: '-70px' }}
            >
                <CoverImage
                    src={values?.company_logo?.file_url || logo_placeholder}
                    width={120}
                    backgroundColor="white"
                    className={'border-5 b-color-tertiary border-radius-10'.classNames()}
                />
                <div>
                    <span
                        className={'d-block font-size-15 font-weight-500 color-text-light margin-bottom-10'.classNames()}
                    >
                        {__('Company Logo')}
                    </span>

                    <FileUpload
                        WpMedia={{ width: 200, height: 200 }}
                        accept="image/*"
                        onChange={(company_logo) => onChange({ company_logo })}
                        layoutComp={({ onCLick }) => {
                            return (
                                <button
                                    className={'button button-primary button-outlined button-small margin-bottom-5'.classNames()}
                                    onClick={onCLick}
                                >
                                    {__('Upload Logo')}
                                </button>
                            );
                        }}
                    />
                </div>
            </div>

			<ContextForm.Provider value={{ values, onChange }}>
				{Object.keys(sections).map((section_key) => {
					const { section_label, fields = [] } = sections[section_key];
					return (
						<div
							data-crewhrm-selector="form-section"
							key={section_key}
							className={'margin-bottom-30'.classNames()}
						>
							<span className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text-light text-transform-uppercase margin-bottom-20'.classNames()}>
								{section_label}
							</span>

							<FormFields {...{ fields }} />
						</div>
					);
				})}
			</ContextForm.Provider>
        </>
    );
}
