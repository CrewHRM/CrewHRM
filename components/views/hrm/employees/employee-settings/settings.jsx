
import {addFilter} from 'crewhrm-materials/hooks.jsx';
import {__} from 'crewhrm-materials/helpers.jsx';

addFilter(
	'crewhrm_setting_fields',
	function(fields={}) {
		fields.recruitment.segments.employee = {
			label: __('Employee'),
			icon: 'ch-icon ch-icon-profile-2user',
			sections: {
				s1: {
					label: __('Employee settings'),
					description: __('Configure employee settings'),
					separator: true,
					vertical: false,
					fields: [
						{
							name: 'employee_dashboard_path',
							label: __('Employee Dashboard Path'),
							type: 'text',
						},
					]
				}
			}
		}

		return fields;
	}
);
