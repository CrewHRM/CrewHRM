import React, { useState } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { FileUpload } from 'crewhrm-materials/file-upload/file-upload.jsx';
import { DateField } from 'crewhrm-materials/date-time.jsx';
import {AddressFields} from 'crewhrm-materials/address-fields.jsx';
import UploadIcon from 'crewhrm-materials/static/images/camera-plus.svg';

import style from './basic.module.scss';

export function BasicUserInfo(props) {

	const {
		style: cssStyle={},
		onChange, 
		values={}, 
		regex={}, 
		showErrorsAlways=false, 
	} = props;

	const [avatar_preview, setAvatarPreview] = useState(null);

	const setImagePreview=(file)=>{
		const reader = new FileReader();
		reader.onload = e => {
			setAvatarPreview(e.target.result);
		}
		reader.readAsDataURL(file)
	}

	const avatar_url = avatar_preview || values.avatar_url;
	
	return <div style={cssStyle}>
		<FileUpload 
			accept={['.png', '.jpg']}
			onChange={avatar_image=>{
				onChange('avatar_image', avatar_image);
				setImagePreview(avatar_image);
			}}
			layoutComp={({onClick})=>{
				return <div onClick={onClick} className={'profile-img'.classNames(style) + 'margin-bottom-20 cursor-pointer'.classNames()}>
					<div 
						className={`image ${avatar_url ? 'has-image' : ''}`.classNames(style)} 
						style={{backgroundImage: avatar_url ? `url(${avatar_url})` : ''}}
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
							'upload-icon'.classNames(style) + 'cursor-pointer margin-bottom-20'.classNames()
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
					regex={regex.first_name} 
					showErrorsAlways={showErrorsAlways}
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
					regex={regex.last_name}
					showErrorsAlways={showErrorsAlways}
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
					regex={regex.user_email}
					showErrorsAlways={showErrorsAlways}
					onChange={(v) => onChange('user_email', v)}
				/>
			</div>
		</div>
		<div className={'d-flex margin-top-20'.classNames()}>
			<div className={'flex-1 margin-right-10'.classNames()}>
				<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
					{__('Phone number')}
					<span className={'color-error'.classNames()}></span>
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
				</div>
				<DateField 
					value={values.birth_date} 
					onChange={date=>onChange('birth_date', date)}/>
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
					onChange={(name, value)=>onChange(name, value)}
					required={true}
					showErrorsAlways={showErrorsAlways}/>
			</div>
		</div>

		<div className={'color-text font-size-15 line-height-18 margin-top-20 margin-bottom-14'.classNames()}>
			{__('Time Zone')}
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
}
