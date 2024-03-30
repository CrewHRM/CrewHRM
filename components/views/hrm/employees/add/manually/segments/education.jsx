import React from 'react';
import { useEffect } from 'react';

import { __, getRandomString } from 'crewhrm-materials/helpers.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { isEmpty } from 'crewhrm-materials/helpers.jsx';

import AddImg from 'crewhrm-materials/static/images/addemployee-add-7.svg';

export function EducationInfo(props) {

	const {
		onChange, 
		values={}, 
	} = props;

	const addEducation=()=>{

		let {educational_info} = values;
		const id = getRandomString();

		if ( isEmpty( educational_info ) ) {
			educational_info = {};
		}

		onChange(
			'educational_info',
			{
				...educational_info,
				[id]: {
					institute_name: '',
					program: '',
					passing_year: ''
				}
			}
		)
	}

	const updateEducation=(id, name, value)=>{
		const {educational_info={}} = values;
		educational_info[id][name] = value;
		onChange('educational_info', educational_info)
	}

	// Add first empty educational info placeholder
	useEffect(()=>{
		if ( isEmpty( values.educational_info ) ) {
			addEducation();
		}
	}, []);

	const educational_ids = Object.keys(values.educational_info || {});

	return <>
		{
			educational_ids.map((id, index)=>{
				const {institute_name, program, passing_year} = values.educational_info[id];
				const show_line = educational_ids.length>1 && index < (educational_ids.length - 1);

				return <div key={id}>
					<div className={'d-flex margin-top-20'.classNames()}>
						<div className={'flex-1'.classNames()}>
							<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
								{__('Institute name')}
							</div>
							<TextField
								placeholder={__('ex. Harvard University')}
								value={institute_name || ''}
								onChange={(v) => updateEducation(id, 'institute_name', v)}
							/>
						</div>
					</div>
					<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
						<div className={'flex-1'.classNames()}>
							<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
								{__('Program')}
							</div>
							<TextField
								placeholder={__('ex. Software Engineering')}
								value={program || ''}
								onChange={(v) => updateEducation(id, 'program', v)}
							/>
						</div>
						<div className={'flex-1'.classNames()}>
							<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
								{__('Passing Year')}
							</div>
							<TextField
								placeholder={__('YYYY')}
								value={passing_year || ''}
								onChange={(v) => updateEducation(id, 'passing_year', (v || '').replace(/\D/g, ''))}
							/>
						</div>
					</div>

					{
						!show_line ? null :
						<div 
							className={'padding-vertical-20 margin-auto'.classNames()} 
							style={{width: '223px', padding: '20px 0 0'}}
						>
							<hr/>
						</div>
					}
				</div>
			})
		}

		<div className={'d-flex margin-top-20 cursor-pointer'.classNames()} onClick={addEducation}>
			<img src={AddImg} alt="" />
			<span className={'font-size-15 font-weight-500 line-height-24 margin-left-5'.classNames()}>
				{__('Add more')}
			</span>
		</div>
	</> 
}