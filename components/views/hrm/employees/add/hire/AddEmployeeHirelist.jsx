import React, { useState } from 'react';

import { __, data_pointer } from 'crewhrm-materials/helpers.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import imgsrc from 'crewhrm-materials/static/images/addemployee-img-subscribe-5.png';
import propic from 'crewhrm-materials/static/images/addemployee-user-profile-demo.svg';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown';

import EmployeeIndexCss from '../../index.module.scss';
import employeecss from './../employee.module.scss';

export default function AddEmployeeHirelist() {
	// eslint-disable-next-line no-unused-vars
	const [emailList, setEmailList] = useState(['nuralam862@gmail.com', 'yo@gmail.com']);
	const [selectedPost, setSelectedPost] = useState('');
	const [buttonIsdisable, setbuttonIsdisable] = useState(true);

	return (
		<>
			<StickyBar title={__('People Hirelist')} canBack={true}>
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
					'employee-invitation-wrapper'.classNames(employeecss) + 'padding-horizontal-50'.classNames()
				}
			>
				<div
					className={
						'd-flex flex-direction-column align-items-center margin-bottom-30'.classNames()
					}
				>
					<img className={'margin-bottom-15'.classNames()} src={imgsrc} />
					<div className={'font-size-24 font-weight-600 line-height-32 color-text'.classNames()}>
						{__('Select from the hire list')}
					</div>
					<div
						className={'font-size-15 font-weight-400 line-height-25 margin-bottom-10 text-align-center color-text-light'.classNames()}
					>
						{__('Pick a job post and a newly hired member.')}
					</div>
				</div>
				<div className={'employee-invitation-area'.classNames(employeecss)}>
					<div className={'employee-invitationlist-dropdown'}>
						<DropDown
							value={selectedPost}
							placeholder="Select job post"
							onChange={(v) => {
								setSelectedPost(v);
								setbuttonIsdisable(false);
							}}
							options={emailList.map((email) => {
								return { id: email, label: email };
							})}
						/>
					</div>

					{!buttonIsdisable && (
						<div
							className={
								'employee-invitation-employeelist'.classNames(employeecss) +
								'margin-top-20'.classNames()
							}
						>
							<div
								className={
									'each-employee'.classNames(employeecss) +
									'crew-hrm-border'.classNames(EmployeeIndexCss)
								}
							>
								<div className={'each-employee-info'.classNames(employeecss)}>
									<div className={'each-employee-propic'.classNames(employeecss)}>
										<img src={propic} alt="profile image" />
									</div>
									<div className={'each-employee-info-details'.classNames(employeecss)}>
										<div
											className={
												'each-employee-info-name'.classNames(employeecss) +
												'font-size-15 font-weight-500 line-height-20 color-text'.classNames()
											}
										>
											Floyd Miles
										</div>
										<div
											className={
												'each-employee-info-email'.classNames(employeecss) +
												'color-text-light font-size-13 font-weight-400 line-height-20'.classNames()
											}
										>
											jessica.hanson@example.com
										</div>
									</div>
								</div>
								<div className={'each-employee-action-icon'.classNames(employeecss)}>
									<span></span>
									<span></span>
								</div>
								<div
									className={
										'each-employee-action-icon'.classNames(employeecss) +
										'each-employee-action-icon-minus'.classNames(employeecss)
									}
								>
									<span></span>
									<span></span>
								</div>
							</div>
						</div>
					)}

					<button
						disabled={buttonIsdisable}
						href={''}
						className={'button button-primary button-large margin-top-20 text-align-center'.classNames()}
					>
						{__('Add Employee list')}
					</button>
				</div>
			</div>
		</>
	);
}
