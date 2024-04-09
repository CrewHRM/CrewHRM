import React, { useContext, useState } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import ShowMore from 'crewhrm-materials/ShowMore/ShowMore.jsx';

import { BasicUserInfo } from 'crewhrm-materials/onboarding-modules/basic-info/basic-user-info.jsx';
import { EducationInfo } from 'crewhrm-materials/onboarding-modules/education.jsx';
import { OtherInfo } from 'crewhrm-materials/onboarding-modules/other-info.jsx';
import { SocialFields } from 'crewhrm-materials/onboarding-modules/social-fields.jsx';
import { EmergencyContactField } from 'crewhrm-materials/onboarding-modules/emergency-contact.jsx';

import { ContextAddEmlpoyeeManually } from './index.jsx';

import AddEmployeeCss from './AddManually.module.scss';

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
