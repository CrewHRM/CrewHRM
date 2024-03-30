import React, { useContext, useState, useEffect } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import ShowMore from 'crewhrm-materials/ShowMore/ShowMore.jsx';

import LinkedInIcon from 'crewhrm-materials/static/images/social-img/crew-linkedin-icon.svg';
import FacebookIcon from 'crewhrm-materials/static/images/social-img/crew-facebook-icon.svg';
import TwitterIcon from 'crewhrm-materials/static/images/social-img/crew-twitter-icon.svg';
import GithubIcon from 'crewhrm-materials/static/images/social-img/crew-github-icon.svg';
import YoutubeIcon from 'crewhrm-materials/static/images/social-img/crew-youtube-icon-icon.svg';
import WordpresskIcon from 'crewhrm-materials/static/images/social-img/crew-wordpress-icon.svg';
import MediumIcon from 'crewhrm-materials/static/images/social-img/crew-medium-icon.svg';
import DribbleIcon from 'crewhrm-materials/static/images/social-img/crew-dribble-icon.svg';
import BehanceIcon from 'crewhrm-materials/static/images/social-img/crew-behance-icon.svg';

import { ContextAddEmlpoyeeManually } from './index.jsx';
import { BasicUserInfo } from './segments/basic-info/basic-user-info.jsx';

import { EducationInfo } from './segments/education.jsx';
import { OtherInfo } from './segments/other-info.jsx';
import { SocialFields } from './segments/social-fields.jsx';
import { EmergencyContactField } from './segments/emergency-contact.jsx';

import AddEmployeeCss from './AddManually.module.scss';

export const social_fields = {
	linkedin: LinkedInIcon,
	twitter: TwitterIcon,
	facebook: FacebookIcon,
	github: GithubIcon,
	medium: MediumIcon,
	dribble: DribbleIcon,
	behance: BehanceIcon,
	wordpress: WordpresskIcon,
	youtube: YoutubeIcon
}

export default function EmployeeInfoForm() {

	const [setshowAdditionalInfo, setSetshowAdditionalInfo] = useState(false);
	const { onChange, values={}, regex={}, showErrorsAlways, expand_additional_section } = useContext(ContextAddEmlpoyeeManually);
	const [expand, setExpand] = useState(false);

	const comp_payload = {
		onChange, 
		values, 
		regex, 
		showErrorsAlways, 
		expand_additional_section
	}

	return (
		<>
			<div
				className={
					'font-size-24 font-weight-500 color-text'.classNames() +
					'employeeinfo-form'.classNames(AddEmployeeCss)
				}
			>
				<BasicUserInfo style={{marginTop: '-80px'}} {...comp_payload}/>
			</div>
			
			<div className={'color-text margin-top-30'.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
				<div className={'font-size-20 font-weight-500 color-text margin-bottom-30'.classNames()}>
					{__('Emergency Contact')}
				</div>
				<EmergencyContactField {...comp_payload}/>
			</div>

			<div
				className={'d-flex margin-top-30 margin-bottom-30 cursor-pointer'.classNames()}
				onClick={() => {
					setExpand(!expand);
					setSetshowAdditionalInfo(!setshowAdditionalInfo);
				}}
			>
				<ShowMore expand={expand} text={__('Show additional options')}/>
			</div>

			{
				!(setshowAdditionalInfo || expand_additional_section) ? null :
				<>
					<div
						className={
							'font-size-24 font-weight-500 color-text margin-top-30'.classNames() +
							'employeeinfo-form'.classNames(AddEmployeeCss)
						}
					>
						<div className={'font-size-20 font-weight-500 color-text margin-bottom-30'.classNames()}>
							{__('Educational Info')}
						</div>
						<EducationInfo {...comp_payload}/>
					</div>

					<div
						className={
							'font-size-24 font-weight-500 color-text margin-top-30'.classNames() +
							'employeeinfo-form'.classNames(AddEmployeeCss)
						}
					>
						<div className={'font-size-20 font-weight-500 color-text margin-bottom-30'.classNames()}>
							{__('Other information')}
						</div>
						<OtherInfo {...comp_payload}/>
					</div>

					<div
						className={
							'font-size-24 font-weight-500 color-text margin-top-30'.classNames() +
							'employeeinfo-form'.classNames(AddEmployeeCss)
						}
					>
						<div className={'font-size-20 font-weight-500 color-text margin-bottom-30'.classNames()}>
							{__('Social Media')}
						</div>
						<SocialFields {...comp_payload}/>
					</div>
				</>
			}
		</>
	);
}
