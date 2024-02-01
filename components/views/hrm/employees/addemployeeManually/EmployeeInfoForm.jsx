import React, { useContext, useState } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { DateField } from 'crewhrm-materials/date-time.jsx';
import ShowMore from 'crewhrm-materials/ShowMore/ShowMore.jsx';

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
import Profileimg from 'crewhrm-materials/static/images/profile-img.jpg';
import UploadIcon from 'crewhrm-materials/static/images/camera-plus.svg';

import { ContextAddEmlpoyeeManually } from './AddEmployeeManually.jsx';
import AddEmployeeCss from './AddManually.module.scss';

export default function EmployeeInfoForm() {

	const [setshowAdditionalInfo, setSetshowAdditionalInfo] = useState(false);
	const { onChange, values={} } = useContext(ContextAddEmlpoyeeManually);
	const [departments] = useState(['Development', 'Design']);
	const [selectedDept, setSelectedDept] = useState('');
	const [textValue, setTextValue] = useState('');
	const [expand, setExpand] = useState(false);

	return (
		<>
			<div
				className={
					'font-size-24 font-weight-500 color-text'.classNames() +
					'employeeinfo-form'.classNames(AddEmployeeCss)
				}
			>
				<div className={'profile-img'.classNames(AddEmployeeCss) + 'margin-bottom-20'.classNames()}>
					<img src={Profileimg} alt="profile img" />
					<div
						className={
							'upload-icon'.classNames(AddEmployeeCss) + 'cursor-pointer margin-bottom-20'.classNames()
						}
					>
						<img src={UploadIcon} alt="upload icon" />
					</div>
				</div>

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
							value={values.first_name} 
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
							value={values.last_name} 
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
							value={values.display_name} 
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
							value={values.user_email}
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
							value={values.user_phone}
							onChange={(v) => onChange('user_phone', v)}
						/>
					</div>
					<div className={'flex-1'.classNames()}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Date of birth')}
							<span className={'color-error'.classNames()}>*</span>
						</div>
						<DateField onChange={date=>onChange('user_birth_date', date)}/>
					</div>
				</div>
				<div className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('About')}
						</div>
						<TextField 
							value={values.description} 
							type='textarea'
							placeholder={'Write about..'}
							onChange={v=>onChange('description', v)}/>
					</div>
				</div>
				{/* <div className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<DropDown
							value={selectedDept}
							placeholder="Select"
							onChange={(v) => {
								setSelectedDept(v);
							}}
							options={departments.map((email) => {
								return { id: email, label: email };
							})}
						/>
					</div>
				</div> */}
				<div className={'color-text font-size-15 line-height-18 margin-top-20 margin-bottom-14'.classNames()}>
					{__('Address')}
					<span className={'color-error'.classNames()}>*</span>
				</div>
				<div className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1 margin-right-10'.classNames()}>
						<TextField placeholder={__('Unit/Flat')} value={textValue} onChange={(v) => setTextValue(v)} />
					</div>
					<div className={'flex-1'.classNames()}>
						<TextField
							placeholder={__('Province/State')}
							value={textValue}
							onChange={(v) => setTextValue(v)}
						/>
					</div>
				</div>
				<div className={'d-flex margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<DropDown
							value={selectedDept}
							placeholder="UTC-11:00"
							onChange={(v) => {
								setSelectedDept(v);
							}}
							options={departments.map((email) => {
								return { id: email, label: email };
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
							{__('First name')}
						</div>
						<TextField placeholder={__('ex. John')} value={textValue} onChange={(v) => setTextValue(v)} />
					</div>
					<div style={{ width: '230px' }}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Relationship')}
						</div>
						<DropDown
							value={selectedDept}
							placeholder="Select"
							onChange={(v) => {
								setSelectedDept(v);
							}}
							options={departments.map((email) => {
								return { id: email, label: email };
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
							value={textValue}
							onChange={(v) => setTextValue(v)}
						/>
					</div>
					<div className={'flex-2'.classNames()}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Email Address')}
						</div>
						<TextField
							placeholder={__('ex. emergency@email.com')}
							value={textValue}
							onChange={(v) => setTextValue(v)}
						/>
					</div>
				</div>

				<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
					<div className={'flex-3'.classNames()}>
						<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
							{__('Address')}
							<span className={'color-error'.classNames()}>*</span>
						</div>
					</div>
				</div>
				<div className={'d-flex column-gap-15 row-gap-10'.classNames()}>
					<div style={{ width: '120px' }}>
						<div className={'flex-1'.classNames()}>
							<TextField
								placeholder={__('Unit/Flat')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
						</div>
					</div>
					<div style={{ width: 'calc(100% - 120px)' }}>
						<div className={'flex-1'.classNames()}>
							<TextField
								placeholder={__('Street Address')}
								value={textValue}
								onChange={(v) => setTextValue(v)}
							/>
						</div>
					</div>
				</div>

				<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<TextField placeholder={__('City')} value={textValue} onChange={(v) => setTextValue(v)} />
					</div>
					<div className={'flex-1'.classNames()}>
						<TextField
							placeholder={__('Province/State')}
							value={textValue}
							onChange={(v) => setTextValue(v)}
						/>
					</div>
				</div>

				<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
					<div className={'flex-1'.classNames()}>
						<TextField
							placeholder={__('Postal/Zip Code')}
							value={textValue}
							onChange={(v) => setTextValue(v)}
						/>
					</div>
					<div className={'flex-1'.classNames()}>
						<DropDown
							value={selectedDept}
							placeholder="Select"
							onChange={(v) => {
								setSelectedDept(v);
							}}
							options={departments.map((email) => {
								return { id: email, label: email };
							})}
						/>
					</div>
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
						<div className={'d-flex margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
									{__('Institute name')}
								</div>
								<TextField
									placeholder={__('ex. mail@example.com')}
									value={textValue}
									onChange={(v) => setTextValue(v)}
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
									placeholder={__('ex. mail@example.com')}
									value={textValue}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
							<div className={'flex-1'.classNames()}>
								<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
									{__('Passing Year')}
									<span className={'color-error'.classNames()}>*</span>
								</div>
								<TextField
									placeholder={__('YYYY')}
									value={textValue}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex margin-top-20'.classNames()}>
							<img src={AddImg} alt="" />
							<span className={'font-size-15 font-weight-500 line-height-24 margin-left-5'.classNames()}>
								Show additional option
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
									{__('Father’s Name')}
								</div>
								<TextField
									placeholder={__('ex. mail@example.com')}
									value={textValue}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
							<div className={'flex-1'.classNames()}>
								<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
									{__('Mother’s Name')}
								</div>
								<TextField
									placeholder={__('ex. mail@example.com')}
									value={textValue}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
									{__('Gender')}
								</div>
								<DropDown
									value={selectedDept}
									placeholder="Select"
									onChange={(v) => {
										setSelectedDept(v);
									}}
									options={departments.map((email) => {
										return { id: email, label: email };
									})}
								/>
							</div>
							<div className={'flex-1'.classNames()}>
								<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
									{__('Marital Status')}
								</div>
								<DropDown
									value={selectedDept}
									placeholder="Select"
									onChange={(v) => {
										setSelectedDept(v);
									}}
									options={departments.map((email) => {
										return { id: email, label: email };
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
									value={textValue}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
							<div className={'flex-1'.classNames()}>
								<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
									{__('National Identity Number')}
								</div>
								<TextField
									placeholder={__('ex. 423443534')}
									value={textValue}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex column-gap-15 margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
									{__('Blood Group')}
								</div>
								<DropDown
									value={selectedDept}
									placeholder="Select"
									onChange={(v) => {
										setSelectedDept(v);
									}}
									options={departments.map((email) => {
										return { id: email, label: email };
									})}
								/>
							</div>
							<div className={'flex-1'.classNames()}>
								<div className={'color-text font-size-15 line-height-18 margin-bottom-14'.classNames()}>
									{__('National Identity Number')}
								</div>
								<TextField
									placeholder={__('ex. 423443534')}
									value={textValue}
									onChange={(v) => setTextValue(v)}
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
						<div className={'d-flex margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<TextField
									placeholder={__('https://')}
									value={textValue}
									image={LinkedInIcon}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<TextField
									placeholder={__('https://')}
									value={textValue}
									image={TwitterIcon}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<TextField
									placeholder={__('https://')}
									value={textValue}
									image={FacebookIcon}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<TextField
									placeholder={__('https://')}
									value={textValue}
									image={GithubIcon}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<TextField
									placeholder={__('https://')}
									value={textValue}
									image={MediumIcon}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<TextField
									placeholder={__('https://')}
									value={textValue}
									image={DribbleIcon}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<TextField
									placeholder={__('https://')}
									value={textValue}
									image={BehanceIcon}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<TextField
									placeholder={__('https://')}
									value={textValue}
									image={WordpresskIcon}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex margin-top-20'.classNames()}>
							<div className={'flex-1'.classNames()}>
								<TextField
									placeholder={__('https://')}
									value={textValue}
									image={YoutubeIcon}
									onChange={(v) => setTextValue(v)}
								/>
							</div>
						</div>
						<div className={'d-flex margin-top-20 cursor-pointer'.classNames()}>
							<img src={AddImg} alt="" />
							<span className={'font-size-15 font-weight-500 line-height-24 margin-left-5'.classNames()}>
								Show more
							</span>
						</div>
					</div>
				</>
			)}
		</>
	);
}
