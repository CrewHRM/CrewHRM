import React from 'react';
import { Link } from 'react-router-dom';

import { __, data_pointer } from 'crewhrm-materials/helpers.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import imgsrc from 'crewhrm-materials/static/images/addemployee-img-1.png';
import addemployeeMailImg from 'crewhrm-materials/static/images/addemployee-mail-img-3.svg';
import addemployeeUserPlusImg from 'crewhrm-materials/static/images/addemployee-user-plus-img-4.svg';

import employeecss from './employee.module.scss';

const {has_pro} = window[data_pointer];

const channels = [
	{
		route: '/employee/invite/',
		label: __('Invite via email'),
		description: __('Invite one or more new staff members to create their account'),
		icon: addemployeeMailImg,
		render: has_pro
	},
	{
		route: '/employees/profile/new/edit/',
		label: __('Add manually'),
		description: __('Add info about the new staff member manually'),
		icon: addemployeeUserPlusImg
	},
	/* {
		route: '/employee/invite/hirelist/',
		label: __('Select from the hire list'),
		description: __('Add info about the new member manually'),
		icon: addemployeeBriefcaseImg
	} */
];

export default function AddEmployee() {
	return (
		<>
			<StickyBar title={__('People')}>
				<div className={'d-flex align-items-center column-gap-30'.classNames()}>
					<div className={'d-inline-block'.classNames()}>
						<Link
							to={`/employees/profile/new/edit/`}
							className={'button button-primary'.classNames()}
						>
							{__('Add New Employee')}
						</Link>
					</div>
				</div>
			</StickyBar>
			<div
				className={
					'employee-invitation-wrapper'.classNames(employeecss) +
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
				<div className={'employee-invitation-links'.classNames(employeecss) + 'd-flex flex-direction-column row-gap-20'.classNames()}>
					{
						channels.map((channel, index)=>{
							
							const {render=true} = channel;

							return !render ? null : <Link 
								key={index} 
								to={channel.route} 
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
							</Link>
						})
					}
				</div>
			</div>
		</>
	);
}
