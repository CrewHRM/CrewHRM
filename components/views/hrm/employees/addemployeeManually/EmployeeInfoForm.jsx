import React, { useContext, useState } from 'react';

import { __, getRandomString } from 'crewhrm-materials/helpers.jsx';
import { genders, marital_statuses, blood_groups } from 'crewhrm-materials/data.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { FileUpload } from 'crewhrm-materials/file-upload/file-upload.jsx';
import { DateField } from 'crewhrm-materials/date-time.jsx';
import ShowMore from 'crewhrm-materials/ShowMore/ShowMore.jsx';
import {AddressFields} from 'crewhrm-materials/address-fields.jsx';

import AddImg from 'crewhrm-materials/static/images/addemployee-add-7.svg';
import LinkedInIcon from 'crewhrm-materials/static/images/social-img/crew-linkedin-icon.svg';
import FacebookIcon from 'crewhrm-materials/static/images/social-img/crew-facebook-icon.svg';
import TwitterIcon from 'crewhrm-materials/static/images/social-img/crew-twitter-icon.svg';
import GithubIcon from 'crewhrm-materials/static/images/social-img/crew-github-icon.svg';
import YoutubeIcon from 'crewhrm-materials/static/images/social-img/crew-youtube-icon-icon.svg';
import WordpresskIcon from 'crewhrm-materials/static/images/social-img/crew-wordpress-icon.svg';
import MediumIcon from 'crewhrm-materials/static/images/social-img/crew-medium-icon.svg';
import DribbleIcon from 'crewhrm-materials/static/images/social-img/crew-dribble-icon.svg';
import BehanceIcon from 'crewhrm-materials/static/images/social-img/crew-behance-icon.svg';
import UploadIcon from 'crewhrm-materials/static/images/camera-plus.svg';

import { ContextAddEmlpoyeeManually } from './index.jsx';
import AddEmployeeCss from './AddManually.module.scss';
import { useEffect } from 'react';
import { isEmpty } from '../../../../../../Materials/helpers.jsx';

const emergency_relationships = {
	parent: __('Parent'),
	sibling: __('Sibling'),
	spouse: __('Spouse'),
	friend: __('Friend'),
	colleague: __('Colleague'),
	other: __('Other')
}

const social_fields = {
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
	const { onChange, values={} } = useContext(ContextAddEmlpoyeeManually);
	const [expand, setExpand] = useState(false);

	const [avatar_preview, setAvatarPreview] = useState(null);

	const setImagePreview=(file)=>{
		const reader = new FileReader();
		reader.onload = e => {
			setAvatarPreview(e.target.result);
		}
		reader.readAsDataURL(file)
	}

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

	const avatar_url = avatar_preview || values.avatar_url;
	const educational_ids = Object.keys(values.educational_info || {});

	return (
		<>
			<div
				className={
					'font-size-24 font-weight-500 color-text'.classNames() +
					'employeeinfo-form'.classNames(AddEmployeeCss)
				}
			>
				<FileUpload 
					accept={['.png', '.jpg']}
					onChange={avatar_image=>{
						onChange('avatar_image', avatar_image);
						setImagePreview(avatar_image);
					}}
					layoutComp={({onCLick})=>{
						return <div onClick={onCLick} className={'profile-img'.classNames(AddEmployeeCss) + 'margin-bottom-20 cursor-pointer'.classNames()}>
							<div 
								className={`image ${avatar_url ? 'has-image' : ''}`.classNames(AddEmployeeCss)} 
								style={{backgroundImage: `url(${avatar_url})`}}
							>
								{
									avatar_url ? null :
									<strong className={'font-weight-700 font-size-16 color-text-light'.classNames()}>
										{__('PHOTO')}
									</strong>
								}
							</div>
							<div
								className={
									'upload-icon'.classNames(AddEmployeeCss) + 'cursor-pointer margin-bottom-20'.classNames()
								}
							>
								<img src={UploadIcon}/>
							</div>
						</div>
					}}
				/>

				<div className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1 margin-right-10'.classNames()}>
						<div
							className={'color-text font-size-15 line-height-18 font-weight-400 margin-bottom-14'.classNames()}
						>
							{__('First name')}
							<span className={'color-error'.classNames()}>*</span>
						</div>
						<TextField 
							placeholder={__('ex. John')} 
							value={values.first_name || ''} 
							onChange={(v) => onChange('first_name', v)} />
					</div>
					<div className={'flex-1 margin-right-10'.classNames()}>
						<div
							className={'color-text font-size-15 line-height-18 font-weight-400 margin-bottom-14'.classNames()}
						>
							{__('Last name')}
							<span className={'color-error'.classNames()}>*</span>
						</div>
						<TextField 
							placeholder={__('ex. Doe')} 
							value={values.last_name || ''} 
							onChange={(v) => onChange( 'last_name', v)} />
					</div>
					<div className={'flex-1'.classNames()}>
						<div
							className={'color-text font-size-15 line-height-18 font-weight-400 margin-bottom-14'.classNames()}
						>
							{__('Preferred name')}
						</div>
						<TextField 
							placeholder={__('ex. John')} 
							value={values.display_name || ''} 
							onChange={(v) => onChange('display_name', v)} />
					</div>
				</div>
				<div className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Email address')}
							<span className={'color-error'.classNames()}>*</span>
						</div>
						<TextField
							placeholder={__('ex. mail@example.com')}
							type="email"
							value={values.user_email || ''}
							onChange={(v) => onChange('user_email', v)}
						/>
					</div>
				</div>
				<div className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1 margin-right-10'.classNames()}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Phone number')}
							<span className={'color-error'.classNames()}>*</span>
						</div>
						<TextField
							placeholder={__('ex 123 456 7890')}
							value={values.user_phone || ''}
							type="tel"
							onChange={(v) => onChange('user_phone', v)}
						/>
					</div>
					<div className={'flex-1'.classNames()}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Date of birth')}
							<span className={'color-error'.classNames()}>*</span>
						</div>
						<DateField value={values.birth_date} onChange={date=>onChange('birth_date', date)}/>
					</div>
				</div>
				<div className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('About')}
						</div>
						<TextField 
							value={values.description || ''} 
							type='textarea'
							placeholder={'Write about..'}
							onChange={v=>onChange('description', v)}/>
					</div>
				</div>
				
				<div className={'color-text font-size-15 line-height-18 margin-top-20 margin-bottom-14'.classNames()}>
					{__('Address')}
					<span className={'color-error'.classNames()}>*</span>
				</div>
				<div className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<AddressFields
							unit_field={true}
							values={values}
							onChange={(name, value)=>onChange(name, value)}/>
					</div>
				</div>

				<div className={'color-text font-size-15 line-height-18 margin-top-20 margin-bottom-14'.classNames()}>
					{__('Time Zone')}
					<span className={'color-error'.classNames()}>*</span>
				</div>
				<div className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<DropDown
							value={values.timezone}
							placeholder={__('Select Timezone')}
							onChange={(v) => onChange('timezone', v)}
							options={Intl.supportedValuesOf("timeZone").map(zone => {
								return { id: zone, label: zone };
							})}
						/>
					</div>
				</div>
			</div>
			<div className={'color-text margin-top-30'.classNames() + 'employeeinfo-form'.classNames(AddEmployeeCss)}>
				<div className={'font-size-20 font-weight-500 color-text margin-bottom-30'.classNames()}>
					{__('Emergency Contact')}
				</div>
				<div className={'d-flex column-gap-15 row-gap-10 margin-top-40'.classNames()}>
					<div style={{ width: 'calc(100% - 230px)' }}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Full name')}
						</div>
						<TextField 
							placeholder={__('ex. John Doe')} 
							value={values.emergency_full_name || ''} 
							onChange={(v) => onChange('emergency_full_name', v)}
						/>
					</div>
					<div style={{ width: '230px' }}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Relationship')}
						</div>
						<DropDown
							value={values.emergency_relationship}
							placeholder="Select"
							onChange={(v) => onChange('emergency_relationship', v)}
							options={Object.keys(emergency_relationships).map((rel) => {
								return { 
									id: rel, 
									label: emergency_relationships[rel]
								};
							})}
						/>
					</div>
				</div>

				<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Phone number')}
						</div>
						<TextField
							placeholder={__('ex 123 456 7890')}
							value={values.emergency_phone || ''}
							type="tel"
							onChange={(v) => onChange('emergency_phone', v)}
						/>
					</div>
					<div className={'flex-2'.classNames()}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Email Address')}
						</div>
						<TextField
							placeholder={__('ex. emergency@email.com')}
							value={values.emergency_email || ''}
							type="email"
							onChange={(v) => onChange('emergency_email', v)}
						/>
					</div>
				</div>

				<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
					<div>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Address')}
							<span className={'color-error'.classNames()}>*</span>
						</div>
					</div>
				</div>
				<div className={''.classNames()}>
					<AddressFields
						unit_field={true}
						values={values}
						name_prefix="emergency_"
						onChange={(name, value)=>onChange(name, value)}/>
				</div>
			</div>

			<div
				className={'d-flex margin-top-30 margin-bottom-30 cursor-pointer'.classNames()}
				onClick={() => {
					setExpand(!expand);
					setSetshowAdditionalInfo(!setshowAdditionalInfo);
				}}
			>
				<ShowMore expand={expand} />
			</div>

			{setshowAdditionalInfo && (
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
												<span className={'color-error'.classNames()}>*</span>
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
												<span className={'color-error'.classNames()}>*</span>
											</div>
											<TextField
												placeholder={__('YYYY')}
												value={passing_year || ''}
												onChange={(v) => updateEducation(id, 'passing_year', v)}
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
								{__('Add another')}
							</span>
						</div>
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
						{
							Object.keys(social_fields).map(social=>{
								return <div key={social} className={'d-flex margin-top-20'.classNames()}>
									<div className={'flex-1'.classNames()}>
										<TextField
											placeholder={__('https://')}
											value={values[`social_link_${social}`] || ''}
											image={social_fields[social]}
											type="url"
											onChange={(v) => onChange(`social_link_${social}`, v)}
										/>
									</div>
								</div>
							})
						}
						{/* <div className={'d-flex margin-top-20 cursor-pointer'.classNames()}>
							<img src={AddImg} alt="" />
							<span className={'font-size-15 font-weight-500 line-height-24 margin-left-5'.classNames()}>
								Show more
							</span>
						</div> */}
					</div>
				</>
			)}
		</>
	);
}
