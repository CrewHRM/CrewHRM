import React from 'react';
import { __, countries_array } from '../../../../utilities/helpers.jsx';
import { genders } from '../../../../utilities/data.jsx';

const gender_disclaimer = (
    <>
        {__(
            'We are required by the law to collect certain race & ethnicity information. The categories are:'
        )}
        <ul>
            <li>
                {__(
                    'Hispanic or Latino/Latinx - A person of Cuban, Mexican, Puerto Rican, South or Central American, or other Spanish culture or origin regardless of race.'
                )}
            </li>
            <li>
                {__(
                    'White (Not Hispanic or Latino/Latinx) - A person having origins in any of the original peoples of Europe, the Middle East, or North Africa.'
                )}
            </li>
            <li>
                {__(
                    'Black or African American (Not Hispanic or Latino/Latinx) - A person having origins in any of the black racial groups of Africa.'
                )}
            </li>
            <li>
                {__(
                    'Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino) - A person having origins in any of the peoples of Hawaii, Guam, Samoa, or other Pacific Islands.'
                )}
            </li>
            <li>
                {__(
                    'Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino/Latinx) - A person having origins in any of the peoples of Hawaii, Guam, Samoa or other Pacific Islands.'
                )}
            </li>
            <li>
                {__(
                    'Asian (Not Hispanic or Latino/Latinx) - A person having origins in any of the original peoples of the Far East, Southeast Asia, or the Indian Subcontinent, including, for example, Cambodia, China, India, Japan, Korea, Malaysia, Pakistan, the Philippine Islands, Thailand.'
                )}
            </li>
        </ul>
    </>
);

export const sections_fields = {
    personal_info: {
        label: __('Personal information'),
        fields: [
            {
                id: 'name',
                label: __('Name'),
                readonly: true,
                form: [
                    [
                        {
                            name: 'first_name',
                            label: __('First Name'),
                            type: 'text'
                        },
                        {
                            name: 'last_name',
                            label: __('Last Name'),
                            type: 'text'
                        }
                    ],
                    null // null is used to set vertical gap based on
                ]
            },
            {
                id: 'address',
                label: __('Address'),
                readonly: true,
                form: [
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
                    null
                ]
            },
            {
                id: 'mobile_number',
                label: __('Mobile Number'),
                readonly: true,
                form: [
                    {
                        name: 'phone',
                        label: __('Phone'),
                        type: 'text',
                        required: true,
                        placeholder: __('123 456 789')
                    },
                    null
                ]
            },
            {
                id: 'email',
                label: __('Email'),
                readonly: true,
                form: [
                    {
                        name: 'email',
                        label: __('Email'),
                        type: 'text',
                        required: true,
                        placeholder: __('@company.com')
                    },
                    null
                ]
            }
        ]
    },
    documents: {
        label: __('Documents'),
        fields: [
            {
                id: 'resume',
                label: __('Resume'),
                readonly: true,
                form: [
                    {
                        name: 'resume',
                        label: __('Resume (PDF)'),
                        type: 'file',
                        accept: 'application/pdf',
                        placeholder: __('Browse resume'),
                        required: true
                    },
                    null
                ]
            },
            {
                id: 'cover_letter',
                label: __('Cover Letter'),
                form: [
                    {
                        name: 'cover_letter',
                        label: __('Cover Letter'),
                        type: 'textarea_rich',
                        placeholder: __('Write your cover letter here')
                    },
                    null
                ]
            },
            {
                id: 'file_attachment',
                label: __('File Attachment'),
                form: [
                    {
                        name: 'file_attachment',
                        label: __('Upload attachments. Max 3.'),
                        type: 'file',
                        placeholder: __('Browse Files'),
                        maxlenth: 3
                    },
                    null
                ]
            }
        ]
    },
    profile: {
        label: __('Profile'),
        fields: [
            {
                id: 'date_of_birth',
                label: __('Date of Birth'),
                form: [
                    {
                        name: 'date_of_birth',
                        label: __('Date of Birth'),
                        type: 'date'
                    },
                    null
                ]
            },
            {
                id: 'gender',
                label: __('Gender'),
                form: [
                    {
                        name: 'gender',
                        label: __('What gender are you?'),
                        placeholder: __('Select Gender'),
                        type: 'dropdown',
                        options: Object.keys(genders).map((g) => {
                            return { id: g, label: genders[g] };
                        }),
                        disclaimer: {
                            heading: __('Gender and Race/Ethnicity'),
                            description: gender_disclaimer
                        }
                    },
                    null
                ]
            }
        ]
    },
    /* questions: {
        label: __('Add Questions'),
        sortable: true,
        addLabel: __('Add a question'),
        options: {
            edit: {
                label: __('Edit'),
                icon: 'ch-icon ch-icon-edit-2'
            },
            duplicate: {
                label: __('Duplicate'),
                icon: 'ch-icon ch-icon-copy'
            },
            delete: {
                label: __('Delete'),
                icon: 'ch-icon ch-icon-trash'
            }
        },
        fields: []
    } */
};
