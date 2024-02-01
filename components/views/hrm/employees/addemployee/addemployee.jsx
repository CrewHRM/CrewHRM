import React from 'react';
import { Link } from 'react-router-dom';
import { __, data_pointer } from 'crewhrm-materials/helpers.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import imgsrc from 'crewhrm-materials/static/images/addemployee-img-1.png';
import addemployeeBriefcaseImg from 'crewhrm-materials/static/images/addemployee-briefcase-img-2.svg';
import addemployeeMailImg from 'crewhrm-materials/static/images/addemployee-mail-img-3.svg';
import addemployeeUserPlusImg from 'crewhrm-materials/static/images/addemployee-user-plus-img-4.svg';
import EmployeeIndexCss from '../index.module.scss';
import employeecss from './employee.module.scss';

const channels = [
	{
		route: '/employee/invite/viaemail/',
		label: __('Invite via email'),
		description: __('Invite one or more new staff members to create their account'),
		icon: addemployeeMailImg
	},
	{
		route: '/employees/profile/new/edit/',
		label: __('Add manually'),
		description: __('Add info about the new staff member manually'),
		icon: addemployeeUserPlusImg
	},
	{
		route: '/employee/invite/hirelist/',
		label: __('Select from the hire list'),
		description: __('Add info about the new member manually'),
		icon: addemployeeBriefcaseImg
	}
];

export default function AddEmployee() {
	return (
		<>
			<StickyBar title={__('People')}>
				<div className={'d-flex align-items-center column-gap-30'.classNames()}>
					<div className={'d-inline-block'.classNames()}>
						<a
							href={`${window[data_pointer].admin_url}=${window[data_pointer].app_name}#/dashboard/jobs/editor/new/`}
							className={'button button-primary'.classNames()}
						>
							{__('Create A New Job')}
						</a>
					</div>
				</div>
			</StickyBar>
			<div
				className={
					'employee-invitation-wrapper employee-invitation-link-wrapper'.classNames(EmployeeIndexCss) +
					'padding-horizontal-50'.classNames()
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
						{__('Add your first hire to your company')}
					</div>
					<div
						className={'font-size-15 font-weight-400 line-height-25 text-align-center color-text-light'.classNames()}
					>
						{__('New team members show up here after completing onboarding. Ready to begin')}
					</div>
				</div>
				<div className={'employee-invitation-links'.classNames(employeecss)}>
					{
						channels.map((channel, index)=>{
							return <Link key={index} to={channel.route}>
								<div
									className={
										'single-employee-invitation-link'.classNames(employeecss) +
										'bg-color-white border-radius-5'.classNames()
									}
								>
									<div>
										<div
											className={
												'font-size-17 font-weight-600 color-text'.classNames() +
												'employee-invitation-link-item-title'
											}
										>
											{channel.label}
										</div>
										<div
											className={
												'font-size-13 font-weight-400 color-text-light'.classNames() +
												'employee-invitation-link-item-text'.classNames(employeecss)
											}
										>
											{channel.description}
										</div>
									</div>
									<div>
										<img src={channel.icon} alt="" />
									</div>
								</div>
							</Link>
						})
					}
				</div>
			</div>
		</>
	);
}
