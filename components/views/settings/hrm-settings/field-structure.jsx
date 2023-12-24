import React from 'react';
import { __, data_pointer } from 'crewhrm-materials/helpers.jsx';
import { applyFilters } from 'crewhrm-materials/hooks.jsx';

import { business_types } from 'crewhrm-materials/data.jsx';
import { Promote } from '../../../promote/promote';

import zoom_svg from 'crewhrm-materials/static/images/brands/zoom.svg';
import meet_svg from 'crewhrm-materials/static/images/brands/meet.svg';

export const settings_fields = applyFilters(
	'crewhrm_setting_fields',
	{
		recruitment: {
			label: __('Recruitment'),
			description: __(
				'These settings will work for to show the job posts and control the allowed attachment types and maximum size.'
			),
			segments: {
				careers: {
					label: __('Job Listing Page'),
					icon: 'ch-icon ch-icon-bill',
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
									WpMedia: { width: 1200, height: 300 },
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
								},
								{
									name: 'job_post_per_page',
									label: __('Job Post Per Page'),
									type: 'number'
								},
								{
									name: 'application_form_layout',
									label: __('Application form layout'),
									type: 'dropdown',
									options: [
										{
											id: 'segmented_form',
											label: __('Segmented Form')
										},
										{
											id: 'single_form',
											label: __('Single Form')
										}
									]
								}
							]
						}
					}
				},
				'outgoing-email': {
					label: __('Outgoing Email'),
					icon: 'ch-icon ch-icon-sms',
					sections: {
						email_settings:{
							label: __('Outgoing Email'),
							description: __('Configure outgoing emails'),
							separator: false,
							vertical: true,
							fields: [
								{
									name: 'outgoing_email_events',
									label: __('Email Notifications'),
									hint: __('Crew HRM sends updates by email to admins and applicants. Turn them on as needed.'),
									type: 'checkbox',
									options: 'email_events',
								}
							]
						}
					}
				},
				attachment: {
					label: __('Files & Attachments'),
					icon: 'ch-icon ch-icon-paperclip-2',
					overflow: false,
					component: ()=>window[data_pointer].has_pro ? <i>{__('Please enable Attachment addon first')}</i> : <Promote content="attachment_settings"/>
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
					label: __('Company Info'),
					icon: 'ch-icon ch-icon-building-4',
					sections: {
						basic_info: {
							label: __('Company Info'),
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
										placeholder: '123456789'
									},
									{
										name: 'mobile_number',
										label: __('Mobile'),
										type: 'text',
										placeholder: '123456789'
									}
								],
								[
									{
										name: 'recruiter_email',
										label: __('Primary Email'),
										description: __('This email address will be used to communicate with the candidates and employees.'),
										type: 'email',
										required: true,
										placeholder: 'hr@company.com'
									},
									{
										name: 'other_email',
										label: __('Secondary Email'),
										type: 'email',
										placeholder: '@company.com'
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
					}
				},
				departments: {
					label: __('Departments'),
					icon: 'ch-icon ch-icon-programming-arrow',
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
			}
		},
		integrations: {
			label: __('Integrations'),
			description: __(
				'Manage External API integrations'
			),
			segments: {
				'google-meet': {
					label: __('Google Meet'),
					icon: meet_svg,
					overflow: false,
					component: ()=>window[data_pointer].has_pro ? <i>{__('You need to enable Google Meet addon first')}</i> : <div style={{minHeight: '600px'}}><Promote content='meet_settings'/></div>
				},
				zoom: {
					label: __('Zoom'),
					icon: zoom_svg,
					overflow: false,
					component: ()=>window[data_pointer].has_pro ? <i>{__('You need to enable Zoom addon first')}</i> : <div style={{minHeight: '600px'}}><Promote content='zoom_settings'/></div>
				}
			}
		}
	}
);
