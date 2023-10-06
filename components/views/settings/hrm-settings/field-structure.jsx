import moment from 'moment-timezone';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { applyFilters } from 'crewhrm-materials/hooks.jsx';

import { attachment_formats, business_types, date_formats, time_formats, timezones_array } from 'crewhrm-materials/data.jsx';

export const settings_fields = applyFilters(
	'crewhrm_setting_fields',
	{
		general: {
			label: __('Recruitment'),
			description: __(
				'These settings will work for to show the job posts and control the allowed attachment types and maximum size.'
			),
			segments: {
				careers: {
					label: __('Job Listing Page'),
					icon: 'ch-icon ch-icon-building-4',
					sections: {
						careers_settings:{
							label: __('Job Listing Page'),
							description: __('Configure careers page features and application submission'),
							separator: true,
							vertical: false,
							fields: [
								{
									name: 'careers_page_id',
									label: __('Job Listing Page'),
									type: 'dropdown',
									options: 'pages',
									placeholder: __('Select Page')
								},
								{
									name: 'careers_header',
									label: __('Show Banner'),
									type: 'switch'
								},
								{
									name: 'careers_tagline',
									label: __('Banner Text'),
									type: 'text',
									when: ['careers_header', true]
								},
								{
									name: 'careers_hero_image',
									label: __('Banner Image'),
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
									label: __('Allowed file types'),
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
										'Please specify which file types you want to accept'
									)
								},
								{
									name: 'application_max_size_mb',
									label: __('Attachment Size (MB)'),
									type: 'number',
									min: 1,
									max: window.CrewHRM.wp_max_size,
									disabled: true,
									hint: __(
										'The combined total of allowed file size per applicant'
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
				'Share your company identity and information here. These information will be used on the applicable places.'
			),
			segments: {
				profile: {
					label: __('Basic information'),
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
							description: __('Set your company location information'),
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
										label: __('HR Email'),
										description: __('This email address will be used to communicate with the candidates and employees.'),
										type: 'email',
										required: true,
										placeholder: __('hr@company.com')
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
					label: __('Departments'),
					icon: 'ch-icon ch-icon-hierarchy',
					sections: {
						departments: {
							label: __('Departments'),
							description: __('Add your company departments to use for job posts and employee profiles.'),
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
		},
		integrations: {
			label: __('Integrations'),
			description: __(
				'Manage External API integrations'
			),
			segments: {}
		}
	}
);
