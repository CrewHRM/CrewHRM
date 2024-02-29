import React from "react";

import {MountPoint} from 'crewhrm-materials/mountpoint.jsx';
import {addAction} from 'crewhrm-materials/hooks.jsx';
import {mountExternal} from 'crewhrm-materials/render-external.jsx';

import { BasicUserInfo } from "../hrm/employees/addemployeeManually/segments/basic-info/basic-user-info.jsx";
import { EducationInfo } from "../hrm/employees/addemployeeManually/segments/education.jsx";
import { OtherInfo } from "../hrm/employees/addemployeeManually/segments/other-info.jsx";
import { SocialFields } from "../hrm/employees/addemployeeManually/segments/social-fields.jsx";
import { EmergencyContactField } from "../hrm/employees/addemployeeManually/segments/emergency-contact.jsx";

addAction(
	'employee_onboarding_basic_info',
	function(el, data) {
		mountExternal(
			'employee_basic_info',
			el,
			data.session,
			<MountPoint>
				<BasicUserInfo {...data.payload}/>
			</MountPoint>
		);
	}
);

addAction(
	'employee_onboarding_education_info',
	function(el, data) {
		mountExternal(
			'employee_education_info',
			el,
			data.session,
			<MountPoint>
				<EducationInfo {...data.payload}/>
			</MountPoint>
		);
	}
);

addAction(
	'employee_onboarding_other_info',
	function(el, data) {
		mountExternal(
			'employee_other_info',
			el,
			data.session,
			<MountPoint>
				<OtherInfo {...data.payload}/>
			</MountPoint>
		);
	}
);

addAction(
	'employee_onboarding_social_info',
	function(el, data) {
		mountExternal(
			'employee_social_info',
			el,
			data.session,
			<MountPoint>
				<SocialFields {...data.payload}/>
			</MountPoint>
		);
	}
);

addAction(
	'employee_onboarding_emergency_contact_info',
	function(el, data) {
		mountExternal(
			'employee_emergency_info',
			el,
			data.session,
			<MountPoint>
				<EmergencyContactField {...data.payload}/>
			</MountPoint>
		);
	}
);
