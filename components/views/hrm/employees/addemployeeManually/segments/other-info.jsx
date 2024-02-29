import React from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { genders, marital_statuses, blood_groups } from 'crewhrm-materials/data.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';

export function OtherInfo(props) {

	const {
		onChange, 
		values={}, 
	} = props;

	return <>
		<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Father\'s Name')}
				</div>
				<TextField
					placeholder={__('ex. John Doe')}
					value={values.fathers_name || ''}
					onChange={(v) => onChange('fathers_name', v)}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Mother\'s Name')}
				</div>
				<TextField
					placeholder={__('ex. ')}
					value={values.mothers_name || ''}
					onChange={(v) => onChange('mothers_name', v)}
				/>
			</div>
		</div>
		<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Gender')}
				</div>
				<DropDown
					value={values.gender}
					placeholder="Select"
					onChange={(v) => onChange('gender', v)}
					options={Object.keys(genders).map((gender) => {
						return {
							id: gender, 
							label: genders[gender]
						};
					})}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Marital Status')}
				</div>
				<DropDown
					value={values.marital_status}
					placeholder="Select"
					onChange={(v) => onChange('marital_status', v)}
					options={Object.keys(marital_statuses).map((status) => {
						return { 
							id: status, 
							label: marital_statuses[status] 
						};
					})}
				/>
			</div>
		</div>
		<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Driving License')}
				</div>
				<TextField
					placeholder={__('ex. 423443534')}
					value={values.driving_license_number || ''}
					onChange={(v) => onChange('driving_license_number', v)}
				/>
			</div>
			<div className={'flex-1'.classNames()}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('National Identity Number')}
				</div>
				<TextField
					placeholder={__('ex. 423443534')}
					value={values.nid_number || ''}
					onChange={(v) => onChange('nid_number', v)}
				/>
			</div>
		</div>
		<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Blood Group')}
				</div>
				<DropDown
					value={values.blood_group}
					placeholder="Select"
					onChange={(v) => onChange('blood_group', v)}
					options={blood_groups.map((group) => {
						return {
							id: group, 
							label: group 
						};
					})}
				/>
			</div>
		</div>
	</>
}