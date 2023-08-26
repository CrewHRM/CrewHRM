import React from 'react';
import { __, countries_array, timezones_array } from '../../../../utilities/helpers.jsx';
import { CoverImage } from '../../../../materials/image/image.jsx';

import logo from '../../../../images/attachment.png';
import { Form } from '../../../../materials/form.jsx';

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

const date_formats = ['F j, Y', 'Y-m-d', 'm/d/Y', 'd/m/Y'];

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
                    'Enter your job description here; include key areas responsibility and specific qualification needed to perform the role.'
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
                    placeholder: __('Postal/Zip Code')
                },
                {
                    name: 'country_code',
                    type: 'dropdown',
                    options: countries_array
                }
            ],
            null,
            [
                {
                    name: 'phone_number',
                    label: __('Phone'),
                    type: 'text',
                    placeholder: '123 456 789'
                },
                {
                    name: 'mobile_number',
                    label: __('Mobile'),
                    type: 'text',
                    placeholder: '123 456 789'
                }
            ],
            null,
            [
                {
                    name: 'recruiter_email',
                    label: __('Recruiter Email'),
                    type: 'text',
                    placeholder: '@company.com',
                    required: true
                },
                {
                    name: 'other_email',
                    label: __('Other Email'),
                    type: 'text',
                    placeholder: '@company.com'
                }
            ],
            null,
            {
                name: 'website',
                label: __('Website'),
                type: 'text',
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
                        return { id: f, label: f };
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

export function CompanyProfile() {
    return (
        <>
            <div
                className={'d-flex align-items-end column-gap-28 margin-bottom-32'.classNames()}
                style={{ marginTop: '-70px' }}
            >
                <CoverImage
                    src={logo}
                    width={120}
                    className={'border-5 b-color-tertiary border-radius-10'.classNames()}
                />
                <div>
                    <span
                        className={'d-block font-size-15 font-weight-500 color-text-light margin-bottom-10'.classNames()}
                    >
                        {__('Company Logo')}
                    </span>
                    <button
                        className={'button button-primary button-outlined button-small margin-bottom-5'.classNames()}
                    >
                        {__('Upload Logo')}
                    </button>
                </div>
            </div>

            <Form fields={sections} />
        </>
    );
}
