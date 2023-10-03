import { __ } from 'crewhrm-materials/helpers.jsx';
import moment from 'moment-timezone';

import { attachment_formats, business_types, date_formats, time_formats, timezones_array } from 'crewhrm-materials/data.jsx';

export const settings_fields = {
    general: {
        label: __('General'),
        description: __(
            'Use these settings to define plugin general settings and default settings for your services and appointments'
        ),
        segments: {
            careers: {
                label: __('Careers'),
                icon: 'ch-icon ch-icon-building-4',
                sections: {
					careers_settings:{
						label: __('Careers Settings'),
						description: __('Configure careers page features and application submission'),
						separator: true,
						vertical: false,
						fields: [
							{
								name: 'careers_page_id',
								label: __('Careers Page'),
								type: 'dropdown',
								options: 'pages',
								placeholder: __('Select Page')
							},
							{
								name: 'careers_header',
								label: __('Show Header'),
								type: 'switch'
							},
							{
								name: 'careers_tagline',
								label: __('Tagline'),
								type: 'text',
								when: ['careers_header', true]
							},
							{
								name: 'careers_hero_image',
								label: __('Hero Image'),
								type: 'image',
								when: ['careers_header', true]
							},
							{
								name: 'careers_sidebar',
								label: __('Sidebar Filters'),
								type: 'switch'
							},
							{
								name: 'careers_search',
								label: __('Search Field'),
								type: 'switch'
							}
						]
					}
                }
            },
            attachment: {
                label: __('Files & Attachments'),
                icon: 'ch-icon ch-icon-paperclip-2',
				sections: {
					attachment_settings: {
						label: '',
						description: '',
						separator: true,
						vertical: false,
						fields: [
							{
								name: 'application_attachment_formats',
								label: __('Attachment upload formats'),
								type: 'checkbox',
								direction: 'column',
								options: Object.keys(attachment_formats).map((format) => {
									const {label, disabled} = attachment_formats[format];
									return {
										label,
										disabled,
										id: format, 
									};
								}),
								hint: __(
									'Not specifying any removes restriction. To disable upload, turn off attachment per job post.'
								)
							},
							{
								name: 'application_max_size_mb',
								label: __('Job application size (MB)'),
								type: 'number',
								min: 1,
								max: window.CrewHRM.wp_max_size,
								disabled: true,
								hint: __(
									'Total maximum size of resume, attachments and texts combined in job application'
								)
							}
						]
					}
				}
            }
        }
    },
	company: {
        label: __('Company'),
        description: __(
            'Use these settings to define company informations and and configurations'
        ),
        segments: {
			profile: {
                label: __('Company Info'),
                icon: 'ch-icon ch-icon-building-4',
				sections: {
					basic_info: {
						label: __('Basic Info'),
						description: __('Set your company informations'),
						separator: false,
						vertical: true,
						fields: [
							{
								name: 'company_logo',
								type: 'company_logo'
							},
							{
								name: 'company_name',
								label: __('Company Name'),
								type: 'text',
								required: true,
								placeholder: __('ex. ABC')
							},
							{
								name: 'business_type',
								label: __('Business Type'),
								type: 'dropdown',
								required: true,
								options: Object.keys(business_types).map((type) => {
									return { 
										id: type, 
										label: business_types[type] 
									};
								})
							},
							{
								name: 'about_company',
								label: __('About Company'),
								type: 'textarea_rich'
							},
						]
					},
					address: {
						label: __('Location'),
						description: __('Set your company location informations'),
						vertical: true,
						separator: false,
						fields:[
							{
								name: 'address',
								label: __('Address'),
								type: 'address',
							},
							[
								{
									name: 'phone_number',
									label: __('Phone'),
									type: 'text',
									placeholder: __('123 456 789')
								},
								{
									name: 'mobile_number',
									label: __('Mobile'),
									type: 'text',
									placeholder: __('123 456 789')
								}
							],
							[
								{
									name: 'recruiter_email',
									label: __('Recruiter Email'),
									type: 'email',
									required: true,
									placeholder: __('@company.com')
								},
								{
									name: 'other_email',
									label: __('Other Email'),
									type: 'email',
									placeholder: __('@company.com')
								}
							],
							{
								name: 'website_link',
								label: __('Website'),
								type: 'url',
								placeholder: __('https://')
							}
						]
					},
					date_time: {
						label: __('Date and Time'),
						description: __('Configure date time'),
						separator: false,
						vertical: true,
						fields: [
							{
								name: 'timezone',
								label: __('Time Zone'),
								type: 'dropdown',
								options: timezones_array
							},
							[
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
										return { 
											id: f, 
											label: time_formats[f] 
										}
									})
								}
							]
						]
					}
				}
			},
			departments: {
                label: __('Department'),
                icon: 'ch-icon ch-icon-hierarchy',
                sections: {
					departments: {
						label: __('Departments'),
						description: __('Define company departments for career listing and job application classifications'),
						separator: false,
						vertical: true,
						fields: [
							{
								name: 'departments',
								type: 'list',
								label: __('Departments'),
								add_text: __('Add Department'),
								key_map: {
									id: 'department_id',
									label: 'department_name'
								}
							}
						]
					}
				}
			},
			white_label: {
                label: __('White-Label'),
                icon: 'ch-icon ch-icon-building-4',
                sections: {

				}
			}
		}
	}
};
