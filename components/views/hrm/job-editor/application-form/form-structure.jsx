import React from "react";
import { __, countries_array } from "../../../../utilities/helpers.jsx";

const genders = {
	male   : __( 'Male' ),
	female : __( 'Female' ),
	other  : __( 'Other' ),
	decline: __( 'Decline to self Identity' )
}

const ethnicities = {
	american : __( 'American Indian or Alaskan Netive' ),
	asian    : __( 'Asian' ),
	afrikan  : __( 'Black or African American ' ),
	hispanic : __( 'Hispanic or Latino' ),
	white    : __( 'White' ),
	hawaiian : __( 'Native Hawaiian or Other Pacific Islander' ),
	multiple : __( 'Two or More Races' ),
	decline  : __( 'Decline to self Identity' )
}

const marital_statuses = {
	single               : __( 'Single' ),
	married              : __( 'Married' ),
	divorced             : __( 'Divorced' ),
	widowed              : __( 'Widowed' ),
	separated            : __( 'Separated' ),
	common_law           : __( 'Common-law Marriage' ),
	domestic_partnership : __( 'Domestic Partnership / Civil Union' ),
	decline              : __( 'Prefer Not to Say' )
}

const disability_statuses = {
	yes     : __( 'Yes, I have a disability (or previously had a disability)' ),
	no      : __( 'No, I don\'t have a disability' ),
	decline : __( 'I don\'t wish to answer' )
}

const veteran_statuses = {
	no      : __( 'I am not a protected veteran' ),
	yes     : __( 'I identify as one or more of the classifications of a protected veteran' ),
	decline : __( 'I don\'t wish to answer' )
}

const gender_disclaimer = <>
	{__( 'We are required by the law to collect certain race & ethnicity information. The categories are:' )}
	<ul>
		<li>{__( 'Hispanic or Latino/Latinx - A person of Cuban, Mexican, Puerto Rican, South or Central American, or other Spanish culture or origin regardless of race.' )}</li>
		<li>{__( 'White (Not Hispanic or Latino/Latinx) - A person having origins in any of the original peoples of Europe, the Middle East, or North Africa.' )}</li>
		<li>{__( 'Black or African American (Not Hispanic or Latino/Latinx) - A person having origins in any of the black racial groups of Africa.' )}</li>
		<li>{__( 'Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino) - A person having origins in any of the peoples of Hawaii, Guam, Samoa, or other Pacific Islands.' )}</li>
		<li>{__( 'Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino/Latinx) - A person having origins in any of the peoples of Hawaii, Guam, Samoa or other Pacific Islands.' )}</li>
		<li>{__( 'Asian (Not Hispanic or Latino/Latinx) - A person having origins in any of the original peoples of the Far East, Southeast Asia, or the Indian Subcontinent, including, for example, Cambodia, China, India, Japan, Korea, Malaysia, Pakistan, the Philippine Islands, Thailand.' )}</li>
	</ul>
</> 

const veteran_status = __( `Veteran Status
We request certain information in order to measure the effectiveness of the outreach and positive recruitment efforts we undertake to comply with this law. If you believe you belong to any of the categories of protected veterans listed below, please indicate by making the appropriate selection.
A "disabled veteran" is one of the following: a veteran of the U.S. military, ground, naval or air service who is entitled to compensation (or who but for the receipt of military retired pay would be entitled to compensation) under laws administered by the Secretary of Veterans Affairs; or a person who was discharged or released from active duty because of a service-connected disability.
A "recently separated veteran" means any veteran during the three-year period beginning on the date of such veteran's discharge or release from active duty in the U.S. military, ground, naval, or air service.
An "active duty wartime or campaign badge veteran" means a veteran who served on active duty in the U.S. military, ground, naval or air service during a war, or in a campaign or expedition for which a campaign badge has been authorized under the laws administered by the Department of Defense.
An "Armed forces service medal veteran" means a veteran who, while serving on active duty in the U.S. military, ground, naval or air service, participated in a United States military operation for which an Armed Forces service medal was awarded pursuant to Executive Order 12985.` );

const disability_status = __( `Disability Status
We are also required to measure our progress toward having at least 7% of our workforce be individuals with disabilities. To do this, we must ask applicants and employees if they have a disability or have ever had a disability. Because a person may become disabled at any time, we ask all of our employees to update their information at least every five years.Identifying yourself as an individual with a disability is voluntary, and we hope that you will choose to do so. Your answer will be maintained confidentially and not be seen by selecting officials or anyone else involved in making personnel decisions. Completing the form will not negatively impact you in any way, regardless of whether you have self-identified in the past. For more information about this request to self-identify or the equal employment obligations of federal contractors under Section 503 of the Rehabilitation Act, visit the U.S. Department of Labor\'s Office of Federal Contract Compliance Programs (OFCCP) website at www.dol.gov/ofccp.` );

export const sections_fields = {
	personal_info: {
		label: __( 'Personal information' ),
		fields: [
			{
				id        : 'name',
				label     :  __( 'Name' ),
				read_only : true,
				form      : [
					[
						{
							name     : 'first_name',
							label    : __( 'First Name' ),
							type     : 'text',
						},
						{
							name     : 'last_name',
							label    : __( 'Last Name' ),
							type     : 'text',
						}
					],
					null // null is used to set vertical gap based on
				]
			},
			{
				id        : 'address',
				label     :  __( 'Address' ),
				read_only : true,
				form      : [
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
							placeholder : __( 'City' ),
						},
						{
							name        : 'province',
							type        : 'text',
							placeholder : __( 'Province/State' ),
						}
					],
					[
						{
							name        : 'zip_code',
							type        : 'text',
							placeholder : __( 'Postal/Zip Code' ),
						},
						{
							name        : 'country_code',
							type        : 'dropdown',
							options     : countries_array
						}
					],
					null
				]
			},
			{
				id        : 'mobile_number',
				label     :  __( 'Mobile Number' ),
				read_only : true,
				form      : [
					{
						name        : 'phone',
						label       : __( 'Phone' ),
						type        : 'text',
						required    : true,
						placeholder : __( '123 456 789' )
					},
					null
				]
			},
			{
				id        : 'email',
				label     :  __( 'Email' ),
				read_only : true,
				form      : [
					{
						name        : 'email',
						label       : __( 'Email' ),
						type        : 'text',
						required    : true,
						placeholder : __( '@company.com' )
					}
				]
			}
		]
	},
	documents: {
		label: __( 'Documents' ),
		fields: [
			{
				id        : 'resume',
				label     :  __( 'Resume' ),
				read_only : true,
				form      : [
					{
						name        : 'resume',
						label       : __( 'Resume' ),
						type        : 'file',
						placeholder : __( 'Browse resume' ),
						required    : true,
					},
					null
				]
			},
			{
				id        : 'cover_letter',
				label     :  __( 'Cover Letter' ),
				form      : [
					{
						name        : 'cover_letter',
						label       : __( 'Cover Letter' ),
						type        : 'textarea',
					},
					null
				]
			},
			{
				id        : 'file_attachment',
				label     :  __( 'File Attachment' ),
				form      : [
					{
						name        : 'file_attachment',
						label       : __( 'Upload your best 3 sample projects' ),
						type        : 'file',
						placeholder : __( 'Browse Files' ),
						fileCount   : 3
					}
				]
			}
		]
	},
	profile: {
		label: __( 'Profile' ),
		fields: [
			{
				id        : 'date_of_birth',
				label     :  __( 'Date of Birth' ),
				form      : [
					{
						name        : 'date_of_birth',
						label       : __( 'Date of Birth' ),
						type        : 'date',
					},
					null
				]
			},
			{
				id        : 'gender',
				label     :  __( 'Gender' ),
				form      : [
					{
						name        : 'gender',
						label       : __( 'What gender are you?' ),
						placeholder : __( 'Select Gender' ),
						type        : 'dropdown',
						options     : Object.keys(genders).map(g=>{return {id: g, label: genders[g]}}),
						disclaimer  : {
							heading : __( 'Gender and Race/Ethnicity' ),
							description : gender_disclaimer
						}
					},
					null,
					{
						name        : 'ethnicity',
						label       : __( 'What race/ethnicity are you?' ),
						placeholder : __( 'Select Ethnicity' ),
						type        : 'dropdown',
						options     : Object.keys(ethnicities).map(e=>{return {id: e, label: ethnicities[e]}}),
					},
					null
				]
			},
			{
				id        : 'education',
				label     :  __( 'Education' ),
				form      : [
					{
						name        : 'education',
						label       : __( 'Education' ),
						type        : 'textarea',
					},
					null
				]
			},
			{
				id        : 'experience',
				label     :  __( 'Experience' ),
				form      : [
					{
						name        : 'experience',
						label       : __( 'Experience' ),
						type        : 'textarea',
					},
					null
				]
			},
			{
				id        : 'nationality',
				label     :  __( 'Nationality' ),
				form      : [
					{
						name        : 'nationaloty',
						label       : __( 'Nationaloty' ),
						type        : 'text',
					},
					null
				]
			},
			{
				id        : 'marital_status',
				label     :  __( 'Martial Status' ),
				form      : [
					{
						name        : 'marital_status',
						label       : __( 'Marital Status' ),
						placeholder : __( 'Select Status' ),
						type        : 'dropdown',
						options     : Object.keys(marital_statuses).map(m=>{return {id: m, label: marital_statuses[m]}})
					},
					null
				]
			},
			{
				id        : 'hobbies',
				label     :  __( 'Hobbies' ),
				form      : [
					{
						name        : 'hobbies',
						label       : __( 'Hobbies' ),
						type        : 'text',
					},
					null
				],
			},
			{
				id        : 'driving_license',
				label     :  __( 'Driving License' ),
			},
			{
				id        : 'social_link',
				label     :  __( 'Social Link' ),
				form      : [
					{
						name        : 'social_link',
						label       : __( 'Social Link (One per line)' ),
						type        : 'textarea',
					},
					null
				],
			}
		]
	},
	other_information: {
		label: __( 'Other Information' ),
		fields: [
			{
				id        : 'us_eeo',
				label     :  __( 'U.S. Equal Employment Opportunity' ),
			},
			{
				id        : 'veteran_status',
				label     :  __( 'Veteran Status' ),
				form      : [
					{
						name        : 'veteran_status',
						label       : __( 'Veteran Status' ),
						placeholder : __( '-Select-' ),
						type        : 'dropdown',
						options     : Object.keys(veteran_statuses).map(v=>{return {id: v, label: veteran_statuses[v]}}),
						disclaimer  : {
							heading : __( 'Veteran Status' ),
							description : veteran_status
						}
					},
					null,
				]
			},
			{
				id        : 'disability',
				label     :  __( 'Identification of Disability' ),
				form      : [
					{
						name        : 'disability',
						label       : __( 'Disability Status*' ),
						placeholder : __( '-Select-' ),
						type        : 'dropdown',
						options     : Object.keys(disability_statuses).map(d=>{return {id: d, label: disability_statuses[d]}}),
						disclaimer  : {
							heading : __( 'Disability Status*' ),
							description : disability_status
						}
					},
					null,
				]
			}
		]
	},
	questions: {
		label    : __( 'Add Questions' ),
		sortable : true,
		addLabel : __( 'Add a question' ),
		options  : {
			edit: {
				label: __( 'Edit' ),
				icon: 'ch-icon ch-icon-edit-2'
			},
			duplicate: {
				label: __( 'Duplicate' ),
				icon: 'ch-icon ch-icon-copy'
			},
			delete: {
				label: __( 'Delete' ),
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
}
