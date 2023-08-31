import React from 'react';
import { __, countries_array } from '../../../../utilities/helpers.jsx';

const genders = {
    male: __('Male'),
    female: __('Female'),
    other: __('Other'),
    decline: __('Decline to self Identity')
};

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
                read_only: true,
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
                read_only: true,
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
                read_only: true,
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
                read_only: true,
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
                read_only: true,
                form: [
                    {
                        name: 'resume',
                        label: __('Resume'),
                        type: 'file',
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
                        label: __('Upload your best 3 sample projects'),
                        type: 'file',
                        placeholder: __('Browse Files'),
                        fileCount: 3
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
            },
            {
                id: 'education',
                label: __('Education'),
                form: [
                    {
                        name: 'education',
                        label: __('Education'),
                        type: 'textarea'
                    },
                    null
                ]
            },
            {
                id: 'experience',
                label: __('Experience'),
                form: [
                    {
                        name: 'experience',
                        label: __('Experience'),
                        type: 'textarea'
                    },
                    null
                ]
            }
        ]
    },
    questions: {
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
        fields: [
            {
                type: 'text',
                label: 'What is your work hour?',
                enabled: true,
                id: '_1692827589125dsfv8sq6gl6d'
            },
            {
                type: 'textarea',
                label: 'Explain your role in existing job',
                enabled: true,
                id: '_169d282758912g5dsfv8sq6gl6d'
            },
            {
                type: 'date',
                label: 'What is your expected joining date?',
                enabled: true,
                id: '_169d2s827589125dsfv8fsq6gl6d'
            },
            {
                type: 'dropdown',
                label: 'Which one is a programming language?',
                field_options: [
                    {
                        id: '_1692827585767lgbioqonws',
                        label: 'English'
                    },
                    {
                        id: '_1692827587691uo7pprq48qe',
                        label: 'Python'
                    },
                    {
                        id: '_16928275883081t2uvcysddf',
                        label: 'Spanish'
                    }
                ],
                enabled: true,
                id: '_169h2827589125dsfv8sq6gl6'
            },
            {
                type: 'radio',
                label: 'Which role you like most?',
                field_options: [
                    {
                        id: '_1692827585767lgbioqonw3s',
                        label: 'Deisgning'
                    },
                    {
                        id: '_1692827587691uoa7pprq48qe',
                        label: 'Development'
                    },
                    {
                        id: '_16928a275883081t2uvcysddf',
                        label: 'Both'
                    }
                ],
                enabled: true,
                id: '_16928275891a25dsfv8sq6gl6'
            },
            {
                type: 'checkbox',
                label: 'Which techs are necessary for web development?',
                field_options: [
                    {
                        id: '_16928275fs85767lgbioqonw3s',
                        label: 'Code editor'
                    },
                    {
                        id: '_1692827587691uoa7pprq48qe',
                        label: 'Illustrator'
                    },
                    {
                        id: '_16928a275883081t2uvcysddf',
                        label: 'Browser'
                    }
                ],
                enabled: true,
                id: '_169282sf75891a25dsfv8sq6gl6'
            },
            {
                type: 'file',
                label: 'Uplod a sample project.',
                enabled: true,
                id: '_16928275891a25dsfvsssf8sq6gl6'
            }
        ]
    }
};

