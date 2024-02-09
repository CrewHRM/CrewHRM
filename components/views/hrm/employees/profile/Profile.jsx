import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DropDown } from 'crewhrm-materials/dropdown/dropdown';
import { __, data_pointer, formatDate, getAddress, getFlag, isEmpty } from 'crewhrm-materials/helpers.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { InitState } from 'crewhrm-materials/init-state.jsx';

import ProfileCss from './profile.module.scss';

export function EmployeeProfileSingle() {
	const {user_id} = useParams();
	const [status, setStatus] = useState(['Active', 'Inactive']);
	const [selectedStatus] = useState('Active');

	const [state, setState] = useState({
		fetching: false,
		employee: {},
		error_message: null
	});

	const getUser=()=>{
		setState({
			...state,
			fetching: true
		});

		request('fetchEmployee', {user_id}, resp=>{
			const {
				success,
				data: {
					employee={},
					message = __('Something went wrong!')
				}
			} = resp;

			setState({
				...state,
				employee,
				fetching: false,
				error_message: success ? null : message
			})
		});
	}

	useEffect(()=>{
		getUser();
	}, [user_id]);

	const {employee={}} = state;
	const meta = [
		(employee.designation ? <span key="a">{employee.designation}</span> : null),
		(employee.department_name ? <span key="b">{employee.department_name}</span> : null),
		(employee.unix_timestamp ? <span key="c">{__('Time:')} {formatDate(employee.unix_timestamp, window[data_pointer].time_format)} / UTC {employee.timezone_offset}</span> : null )
	].filter(m=>m);

	return <>
		<StickyBar title={__('People')} canBack={true}>
			<div className={'d-flex align-items-center column-gap-30'.classNames()}>
				<div className={'d-inline-block'.classNames()}>
					<a
						href={`${window[data_pointer].admin_url}=crewhrm-employee#/employee/invite/`}
						className={'button button-primary'.classNames()}
					>
						{__('Add New Employee')}
					</a>
				</div>
			</div>
		</StickyBar>

		{
			(state.fetching || state.error_message) ? 
			<InitState 
				error_message={state.error_message} 
				fetching={state.fetching}
			/> 
			: 
			<div className={'container'.classNames()}>
				<div className={'employee-profile'.classNames(ProfileCss)}>
					<div className={'employee-profile-img'.classNames(ProfileCss)}>
						<img src={employee.avatar_url} style={{width: '100%', height: 'auto'}}/>
					</div>
					<div className={'employee-main-info'.classNames()}>
						<div className={'margin-bottom-30'.classNames() + 'employee-nameplate'.classNames(ProfileCss)}>
							<div className={'color-text font-size-28 font-weight-600 margin-bottom-10'.classNames()}>
								{employee.display_name} {employee.country_code ? <span>{getFlag(employee.country_code)}</span> : null}
							</div>
							{
								isEmpty(meta) ? null :
								<div
									className={
										'd-flex column-gap-15 color-text-light font-size-13 line-height-24 margin-bottom-10'.classNames() +
										'basic-info'.classNames(ProfileCss)
									}
								>
									{meta}
								</div>
							}
						</div>
						<div
							className={
								'crew-hrm-border padding-30'.classNames() + 'personal-info-area'.classNames(ProfileCss)
							}
						>
							<div
								className={'d-flex align-items-center column-gap-10 justify-content-space-between margin-bottom-30'.classNames()}
							>
								<div className={'d-flex align-items-center column-gap-10'.classNames()}>
									<i className={'ch-icon ch-icon-user font-size-20'.classNames()} />
									<span className={'color-text font-size-17'.classNames()}>
										{__('Personal Info')}
									</span>
								</div>
								<div>
									<Link 
										to={`/employees/profile/${employee.user_id}/edit/`} 
										className={'ch-icon ch-icon-edit color-text-light font-size-20'.classNames()}/>
								</div>
							</div>
							<div className={'table-like-div'.classNames(ProfileCss)}>
								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										{__('First name')}
									</span>
									<span
										className={'color-text font-size-15 line-height-23'.classNames()}
									>
										{employee.first_name}
									</span>
								</>
								
								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										{__('Last name')}
									</span>
									<span
										className={'color-text font-size-15 line-height-23'.classNames()}
									>
										{employee.last_name}
									</span>
								</>
								
								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										{__('Preferred name')}
									</span>
									<span
										className={'color-text font-size-15 line-height-23'.classNames()}
									>
										{__(employee.display_name)}
									</span>
								</>

								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										{__('Email address')}
									</span>
									<span
										className={'color-text font-size-15 line-height-23'.classNames()}
									>
										{employee.user_email}
									</span>
								</>
								
								{
									!employee.user_phone ? null :
									<>
										<span className={'color-text-light font-size-15'.classNames()}>
											{__('Phone number')}
										</span>
										<span
											className={'color-text font-size-15 line-height-23'.classNames()}
										>
											{__(employee.user_phone)}
										</span>
									</>
								}
								
								{
									!employee.birth_date ? null :
									<>
										<span className={'color-text-light font-size-15'.classNames()}>
											{__('Date of birth')}
										</span>
										<span
											className={'color-text font-size-15 line-height-23'.classNames()}
										>
											{formatDate(employee.birth_date)}
										</span>
									</>
								}
								
								{
									!employee.description ? null :
									<>
										<span className={'color-text-light font-size-15'.classNames()}>
											{__('Bio')}
										</span>
										<span
											className={'color-text font-size-15 line-height-23'.classNames()}
										>
											{employee.description}
										</span>
									</>
								}
								
								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										Address
									</span>
									<span
										className={'color-text font-size-15 line-height-23'.classNames()}
									>
										{getAddress(employee)}
									</span>
								</>
								
								{
									!employee.timezone ? null :
									<>
										<span className={'color-text-light font-size-15'.classNames()}>
											{__('Time Zone')}
										</span>
										<span
											className={'color-text font-size-15 line-height-23'.classNames()}
										>
											{employee.timezone}
										</span>
									</>
								}
							</div>
						</div>

						<div
							className={
								'crew-hrm-border padding-30 margin-top-30'.classNames() +
								'report-area'.classNames(ProfileCss)
							}
						>
							<div
								className={'d-flex align-items-center column-gap-10 justify-content-space-between margin-bottom-30'.classNames()}
							>
								<div className={'d-flex align-items-center column-gap-10'.classNames()}>
									<i className={'ch-icon ch-icon-users-2 font-size-20'.classNames()} />
									<span className={'color-text font-size-17'.classNames()}>Direct report to you</span>
								</div>
								<div>
									<i className={'ch-icon ch-icon-edit color-text-light font-size-20'.classNames()} />
								</div>
							</div>
							<div
								className={
									'd-flex align-items-center column-gap-10 justify-content-space-between'.classNames() +
									'reported-persons-wrapper'.classNames(ProfileCss)
								}
							>
								<div className={'text-align-center'.classNames()}>
									<img src="https://picsum.photos/108/150" alt="" />
									<div>Jane Cooper</div>
								</div>
								<div className={'text-align-center'.classNames()}>
									<img src="https://picsum.photos/108/150" alt="" />
									<div>Jane Cooper</div>
								</div>
								<div className={'text-align-center'.classNames()}>
									<img src="https://picsum.photos/108/150" alt="" />
									<div>Jane Cooper</div>
								</div>
								<div className={'text-align-center'.classNames()}>
									<img src="https://picsum.photos/108/150" alt="" />
									<div>Jane Cooper</div>
								</div>
								<div className={'text-align-center'.classNames()}>
									<img src="https://picsum.photos/108/150" alt="" />
									<div>Jane Cooper</div>
								</div>
								<div className={'text-align-center'.classNames()}>
									<img src="https://picsum.photos/108/150" alt="" />
									<div>Jane Cooper</div>
								</div>
								<div className={'text-align-center'.classNames()}>
									<img src="https://picsum.photos/108/150" alt="" />
									<div>Jane Cooper</div>
								</div>
								<div className={'text-align-center'.classNames()}>
									<img src="https://picsum.photos/108/150" alt="" />
									<div>Jane Cooper</div>
								</div>
							</div>
						</div>

						<div
							className={
								'crew-hrm-border padding-30 margin-top-30'.classNames() + ''.classNames(ProfileCss)
							}
						>
							<div
								className={'d-flex align-items-center column-gap-10 justify-content-space-between margin-bottom-30'.classNames()}
							>
								<div className={'d-flex align-items-center column-gap-10'.classNames()}>
									<i className={'ch-icon ch-icon-clock-fast-forward font-size-20'.classNames()} />
									<span className={'color-text font-size-17'.classNames()}>
										{__('Employment History')}
									</span>
								</div>
								<div>
									<i className={'ch-icon ch-icon-edit color-text-light font-size-20'.classNames()} />
								</div>
							</div>
							<div className={'table-like-div'.classNames(ProfileCss)}>
								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										{__('Job Title')}
									</span>
									<span
										className={'color-text font-size-15 line-height-23'.classNames()}
									>
										Esther
									</span>
								</>
								
								<span className={'color-text-light font-size-15'.classNames()}>
									Last name
								</span>
								<span
									className={'color-text font-size-15 line-height-23'.classNames()}
								>
									Howard
								</span>
								<span className={'color-text-light font-size-15'.classNames()}>
									Preferred name
								</span>
								<span
									className={'color-text font-size-15 line-height-23'.classNames()}
								>
									Howard
								</span>
								<span className={'color-text-light font-size-15'.classNames()}>
									Email address
								</span>
								<span
									className={'color-text font-size-15 line-height-23'.classNames()}
								>
									jessica.hanson@example.com
								</span>
							</div>
							<div className={'padding-vertical-20'.classNames()}>
								<hr />
							</div>
							<div className={'table-like-div'.classNames(ProfileCss)}>
								<span className={'color-text-light font-size-15'.classNames()}>
									Phone number
								</span>
								<span
									className={'color-text font-size-15 line-height-23'.classNames()}
								>
									(205) 555-0100
								</span>
								<span className={'color-text-light font-size-15'.classNames()}>
									Date of birth
								</span>
								<span
									className={'color-text font-size-15 line-height-23'.classNames()}
								>
									11/7/1980
								</span>
								<span className={'color-text-light font-size-15'.classNames()}>
									Bio
								</span>
								<span
									className={'color-text font-size-15 line-height-23'.classNames()}
								>
									Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
									laboriosam, nisi ut al
								</span>
								<span className={'color-text-light font-size-15'.classNames()}>
									Address
								</span>
								<span
									className={'color-text font-size-15 line-height-23'.classNames()}
								>
									4140 Parker Rd. Allentown, New Mexico 31134
								</span>
								<span className={'color-text-light font-size-15'.classNames()}>
									Time Zone
								</span>
								<span
									className={'color-text font-size-15 line-height-23'.classNames()}
								>
									UTC-11:00 (11:34 AM)
								</span>
							</div>
						</div>
						<div
							className={
								'crew-hrm-border padding-30 margin-top-30'.classNames() + ''.classNames(ProfileCss)
							}
						>
							<div
								className={'d-flex align-items-center column-gap-10 justify-content-space-between margin-bottom-30'.classNames()}
							>
								<div className={'d-flex align-items-center column-gap-10'.classNames()}>
									<i className={'ch-icon ch-icon-user-tick-check-2 font-size-20'.classNames()} />
									<span className={'color-text font-size-17'.classNames()}>
										{__('Emergency Contact')}
									</span>
								</div>
								<div>
									<Link 
										to={`/employees/profile/${employee.user_id}/edit/`} 
										className={'ch-icon ch-icon-edit color-text-light font-size-20'.classNames()} />
								</div>
							</div>
							<div className={'table-like-div'.classNames(ProfileCss)}>
								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										{__('Full name')}
									</span>
									<span
										className={'color-text font-size-15 line-height-23'.classNames()}
									>
										{employee.emergency_full_name}
									</span>
								</>
								
								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										{__('Relationship')}
									</span>
									<span
										className={'color-text font-size-15 line-height-23'.classNames()}
									>
										{employee.emergency_relationship}
									</span>
								</>
								
								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										{__('Email')}
									</span>
									<span
										className={'color-text font-size-15 line-height-23'.classNames()}
									>
										{employee.emergency_email}
									</span>
								</>
								
								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										{__('Phone')}
									</span>
									<span
										className={'color-text font-size-15 line-height-23'.classNames()}
									>
										{employee.emergency_phone}
									</span>
								</>

								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										{__('Address')}
									</span>
									<span
										className={'color-text font-size-15 line-height-23'.classNames()}
									>
										{getAddress(employee, 'emergency_')}
									</span>
								</>
							</div>
						</div>
					</div>
					<div
						className={
							'd-flex flex-direction-column row-gap-20'.classNames() +
							'employee-status'.classNames(ProfileCss)
						}
					>
						<div className={''.classNames()}>
							<div
								className={'color-text-light font-size-13 line-height-24 margin-bottom-10'.classNames()}
							>
								Employment Status
							</div>
							<DropDown
								value={selectedStatus}
								placeholder="Select"
								onChange={(v) => {
									setStatus(v);
								}}
								options={status.map((email) => {
									return { id: email, label: email };
								})}
							/>
						</div>
						<div className={''.classNames()}>
							<div className={'color-text-light font-size-13 line-height-24'.classNames()}>
								Reporting person
							</div>
							<div className={'crew-hrm-border padding-20 margin-top-10 '.classNames()}>
								<img src="https://picsum.photos/32/32" alt="" />
								<div className={'color-text font-size-17 margin-top-10'.classNames()}>Floyd Miles</div>
								<div className={'color-text-light font-size-13'.classNames()}>Head of design</div>
							</div>
						</div>
						<div className={''.classNames()}>
							<div className={'color-text-light font-size-13 line-height-24'.classNames()}>Contact</div>
							<div
								className={
									'd-flex align-items-center column-gap-15 margin-top-20'.classNames() +
									'employee-social-profile'.classNames(ProfileCss)
								}
							>
								<i className={'ch-icon ch-icon-linkedin2 color-text-light font-size-15'.classNames()} />
								<i className={'ch-icon ch-icon-x color-text-light font-size-15'.classNames()} />
								<i className={'ch-icon ch-icon-linkedin2 color-text-light font-size-15'.classNames()} />
							</div>
						</div>
					</div>
				</div>
			</div>
		}
	</>
}
