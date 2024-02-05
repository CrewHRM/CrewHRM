import React, {useEffect} from "react";

import { __, isEmpty, filterObject, getRandomString } from 'crewhrm-materials/helpers.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { ToggleSwitch } from 'crewhrm-materials/toggle-switch/ToggleSwitch.jsx';

import leave_style from './leave.module.scss';

const leave_fields = {
	public_holiday: {
		label: __('Public Holiday'),
		type: 'switch',
		value: true,
		removable: false
	},
	annual_leave: {
		label: __('Annual Leave'),
	},
	sick_leave: {
		label: __('Sick leave'),
	},
	casual_leave: {
		label: __('Casual leave'),
	},
	religious_leave: {
		label: __('Religious holidays'),
	},
	parental_leave: {
		label: __('Parental leave'),
	},
}

export function LeaveBuilder({leaves={}, onChange}) {

	const addLeave=()=>{
		onChange({
			...leaves, 
			[getRandomString()]: {
				label: __('Untitled')
			}
		})
	}

	const updateLeave=(name, field_name, value)=>{

		if ( value === undefined ) {
			value = field_name;
			field_name = 'value';
		}

		onChange({
			...leaves,
			[name]: {
				...leaves[name],
				[field_name]: value
			}
		});
	}

	const deleteLeave=(id)=>{
		onChange( filterObject( leaves, (value, key) => key!==id ) );
	}

	// Set default leaves if the saved one is empty
	useEffect(()=>{
		if ( isEmpty( leaves ) ) {
			onChange( leave_fields );
		}
	}, []);

	return <>
		{
			Object.keys(leaves).map(key=>{
				
				const {
					label, 
					type='number', 
					value, 
					placeholder=__('ex. . 20'),
					removable=true
				} = leaves[key];

				return <div
					key={key}
					className={
						'd-flex align-items-center justify-content-space-between padding-15 margin-top-20'.classNames() +
						'leave-borders'.classNames(leave_style)
					}
				>
					<div className={'flex-1'.classNames()}>
						<input 
							className={'text-field-flat width-p-100 font-size-17 font-weight-500 color-text'.classNames()}
							value={label}
							onChange={e=>updateLeave(key, 'label', e.currentTarget.value)}
						/>
					</div>
					<div className={'flex-1 d-flex align-items-center column-gap-20'.classNames()}>
						<div className={'flex-1'.classNames()}>
							{
								type !== 'switch' ? null :
								<div className={'text-align-right'.classNames()}>
									<ToggleSwitch 
										checked={leaves[key]?.value ? true : false} 
										onChange={checked => updateLeave(key, checked)} />
								</div>
							}

							{
								type !== 'number' ? null :
								<TextField
									placeholder={placeholder}
									value={leaves[key]?.value ?? value ?? ''}
									onChange={(v) => updateLeave(key, (v || '').replace(/\D/g, ''))}
								/>
							}
						</div>
						{
							!removable ? null :
							<div>
								<i 
									className={'ch-icon ch-icon-trash font-size-20 color-text-light cursor-pointer'.classNames()}
									onClick={()=>deleteLeave(key)}
								></i>
							</div>
						}
					</div>
				</div>
			})
		}
		
		<div
			className={'d-flex cursor-pointer align-items-center justify-content-space-between padding-vertical-15 padding-horizontal-15 margin-top-20'.classNames()}
			style={{ borderRadius: '10px', border: '1px solid #236BFE', padding: '10px 15px' }}
		>
			<div className={'flex-1 d-flex align-items-center column-gap-10'.classNames()}>
				<i
					className={'ch-icon ch-icon-add-circle cursor-pointer font-size-30 color-text-light'.classNames()}
					style={{ color: '#236BFE' }}
				></i>
				<span
					className={'font-size-15 font-weight-500 color-text'.classNames()}
					style={{ color: '#236BFE' }}
					onClick={addLeave}
				>
					{__('Add Leave')}
				</span>
			</div>
		</div>
	</>
}
