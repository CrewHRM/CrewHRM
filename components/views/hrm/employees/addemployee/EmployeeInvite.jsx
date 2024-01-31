import React, { useState } from 'react';
import { __, data_pointer } from 'crewhrm-materials/helpers.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import imgsrc from 'crewhrm-materials/static/images/addemployee-img-subscribe-5.png';
import closeSvg from 'crewhrm-materials/static/images/teaminvite-img-6.svg';
import EmployeeIndexCss from './../index.module.scss';
import employeecss from './employee.module.scss';

export default function EmployeeInvite() {
	const [emailList, setEmailList] = useState(['nuralam862@gmail.com']);
	const [inputEmail, setInputEmail] = useState('');

	function handleKeydown(event) {
		if (event.key == 'Enter') {
			setEmailList((prevEmaillist) => [...prevEmaillist, inputEmail]);
			setInputEmail('');
		}
	}

	function detachEmail(emailToremove) {
		setEmailList(emailList.filter((email) => email !== emailToremove));
	}

	return (
		<>
			<StickyBar title={__('People')} canBack={true}>
				<div className={'d-flex align-items-center column-gap-30'.classNames()}>
					<div className={'d-inline-block'.classNames()}>
						<a
							href={`${window[data_pointer].admin_url}=${window[data_pointer].app_name}#/dashboard/jobs/editor/new/`}
							className={'button button-primary'.classNames()}
						>
							{__('Update')}
						</a>
					</div>
				</div>
			</StickyBar>
			<div
				className={
					'employee-invitation-wrapper'.classNames(EmployeeIndexCss) + 'padding-horizontal-50'.classNames()
				}
			>
				<div
					className={
						'd-flex flex-direction-column align-items-center margin-bottom-30'.classNames() +
						''.classNames()
					}
				>
					<img className={'margin-bottom-15'.classNames()} src={imgsrc} />
					<div className={'font-size-24 font-weight-600 line-height-32 color-text'.classNames()}>
						{__('Invite team members')}
					</div>
					<div
						className={'font-size-15 font-weight-400 line-height-25 margin-bottom-10 text-align-center color-text-light'.classNames()}
					>
						{__('To invite team members write their email addresses and click on invite.')}
					</div>
				</div>
				<div className={'employee-invitation-area'.classNames(EmployeeIndexCss)}>
					<div className={'employee-invitation-textarea'.classNames(employeecss)}>
						{emailList.map((email, index) => (
							<div
								className={'invited-email'.classNames(employeecss) + 'd-flex column-gap-5'.classNames()}
								key={index}
							>
								<span className={'font-size-15 font-weight-500 color-text'.classNames()}>{email}</span>
								<span onClick={() => detachEmail(email)}>
									<img src={closeSvg} alt="" />
								</span>
							</div>
						))}
						<input
							type="text"
							value={inputEmail}
							onChange={(e) => setInputEmail(e.target.value)}
							onKeyDown={handleKeydown}
						/>
					</div>

					<button
						href={''}
						className={
							'button button-primary button-large margin-top-20 text-align-center'.classNames() +
							''.classNames(employeecss)
						}
					>
						{__('Invite')}
					</button>
				</div>
			</div>
		</>
	);
}
