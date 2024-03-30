import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DropDown } from 'crewhrm-materials/dropdown/dropdown';
import { __, data_pointer, formatDate, getAddress, getFlag, isEmpty, convertOffsetToTimezone } from 'crewhrm-materials/helpers.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { InitState } from 'crewhrm-materials/init-state.jsx';
import { attendance_types, employment_statuses } from 'crewhrm-materials/data';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import { social_fields } from '../add/manually/EmployeeInfoForm.jsx';

import ProfileCss from './profile.module.scss';

export function EmployeeProfileSingle() {
	
	const {user_id} = useParams();
	const {ajaxToast} = useContext(ContextToast);

	const [state, setState] = useState({
		fetching: false,
		employee: {},
		error_message: null,
		changing_status: false,
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

	const changeEmploymentStatus=(status)=>{

		if ( ! window.confirm(__('Sure to change status?')) ) {
			return;
		}

		setState({
			...state,
			changing_status: true
		});

		request('changeEmploymentStatus', {status, user_id}, resp=>{

			ajaxToast(resp);

			const {employee={}} = state;

			setState({
				...state,
				changing_status: false,
				employee: {
					...employee,
					employment_status: resp.success ? status : employee.employment_status
				}
			});
		});
	}

	useEffect(()=>{
		getUser();
	}, [user_id]);

	const {employee={}} = state;
	const meta = [
		(employee.designation ? <span key="a">{employee.designation}</span> : null),
		(employee.department_name ? <span key="b">{employee.department_name}</span> : null),
		(<span key="c">{__('Time:')} {employee.time_now} / UTC{convertOffsetToTimezone(employee.timezone_offset)}</span>)
	].filter(m=>m);

	const socials = Object.keys(social_fields).map(k=>{
		const key = `social_link_${k}`;
		return isEmpty( employee[key] ) ? null : {
			icon: social_fields[k],
			url: employee[key],
			key
		}
	}).filter(s=>s);

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
						<img 
							src={employee.avatar_url} 
							style={{width: '100%', height: 'auto'}}
						/>
					</div>
					<div>
						<div className={'margin-bottom-30'.classNames() + 'employee-nameplate'.classNames(ProfileCss)}>
							<div className={'d-flex align-items-flex-end column-gap-15'.classNames()}>
								<div className={'employee-profile-img-mobile'.classNames(ProfileCss)}>
									<img 
										src={employee.avatar_url} 
										style={{width: '140px', height: 'auto'}}
									/>
								</div>
								<div className={'flex-1'.classNames()}>
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
							</div>
						</div>
						<div
							className={
								'crew-hrm-border padding-30'.classNames() + 'personal-info-area profile-segment'.classNames(ProfileCss)
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
										className={'ch-icon ch-icon-edit color-text-light font-size-20'.classNames() + 'profile-segment-edit-icon'.classNames(ProfileCss)}/>
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
									<a
										className={'color-text font-size-15 line-height-23'.classNames()}
										href={`mailto:${employee.user_email}`}
									>
										{employee.user_email}
									</a>
								</>
								
								{
									!employee.user_phone ? null :
									<>
										<span className={'color-text-light font-size-15'.classNames()}>
											{__('Phone number')}
										</span>
										<a
											className={'color-text font-size-15 line-height-23'.classNames()}
											href={`tel:${employee.user_phone}`}
										>
											{employee.user_phone}
										</a>
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
										{__('Address')}
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

						{
							isEmpty(employee.subordinates) ? null :
							<div
								className={
									'crew-hrm-border padding-30 margin-top-30'.classNames() +
									'report-area profile-segment'.classNames(ProfileCss)
								}
							>
								<div
									className={'d-flex align-items-center column-gap-10 justify-content-space-between margin-bottom-30'.classNames()}
								>
									<div className={'d-flex align-items-center column-gap-10'.classNames()}>
										<i className={'ch-icon ch-icon-users-2 font-size-20'.classNames()} />
										<span className={'color-text font-size-17'.classNames()}>
											{__('Subordinates')}
										</span>
									</div>
								</div>
								<div
									className={
										'd-flex align-items-flex-start column-gap-10 justify-content-space-between'.classNames() +
										'reported-persons-wrapper'.classNames(ProfileCss)
									}
								>
									{
										employee.subordinates.map(user=>{
											return <Link 
												key={user.employee_user_id} 
												to={`/employees/profile/${user.employee_user_id}/`} 
												className={'text-align-center'.classNames()}
											>
												<img src={user.avatar_url}/>
												<div>{user.display_name}</div>
											</Link>
										})
									}
								</div>
							</div>
						}
						

						<div
							className={
								'crew-hrm-border padding-30 margin-top-30'.classNames() + ' profile-segment'.classNames(ProfileCss)
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
									<i className={'ch-icon ch-icon-edit color-text-light font-size-20'.classNames() + 'profile-segment-edit-icon'.classNames(ProfileCss)} />
								</div>
							</div>
							{
								(employee?.employments || []).map((employment, index)=>{

									return <div key={employment.employment_id}>
										<div className={'table-like-div'.classNames(ProfileCss)}>
											<>
												<span className={'color-text-light font-size-15'.classNames()}>
													{__('Job Title')}
												</span>
												<span
													className={'color-text font-size-15 line-height-23'.classNames()}
												>
													{employment.designation}
												</span>
											</>

											<>
												<span className={'color-text-light font-size-15'.classNames()}>
													{__('Hire Date')}
												</span>
												<span
													className={'color-text font-size-15 line-height-23'.classNames()}
												>
													{employment.hire_date}
												</span>
											</>
											
											<>
												<span className={'color-text-light font-size-15'.classNames()}>
													{__('Department')}
												</span>
												<span
													className={'color-text font-size-15 line-height-23'.classNames()}
												>
													{employment.department_name}
												</span>
											</>
											
											{
												! employment.reporting_person ? null :
												<>
													<span className={'color-text-light font-size-15'.classNames()}>
														{__('Reporting to')}
													</span>
													<span
														className={'d-flex align-items-center column-gap-5'.classNames()}
													>
														<img 
															src={employment.reporting_person.avatar_url} 
															style={{width: '24px', height: '24px', borderRadius: '50%'}}
														/>

														<span className={'color-text font-size-15 line-height-23'.classNames()}>
															{employment.reporting_person.display_name}
														</span>
													</span>
												</>
											}
											
											<>
												<span className={'color-text-light font-size-15'.classNames()}>
													{__('Workplace')}
												</span>
												<span
													className={'color-text font-size-15 line-height-23'.classNames()}
												>
													{attendance_types[employment.attendance_type]}
												</span>
											</>
										</div>
										{
											index >= employee.employments.length -1 ? null :
											 <div className={'padding-vertical-20'.classNames()}>
												<hr />
											</div>
										}
									</div>
								})
							}
						</div>
						<div
							className={
								'crew-hrm-border padding-30 margin-top-30'.classNames() + 'profile-segment'.classNames(ProfileCss)
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
										className={'ch-icon ch-icon-edit color-text-light font-size-20'.classNames() + 'profile-segment-edit-icon'.classNames(ProfileCss)} />
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
									<a
										className={'color-text font-size-15 line-height-23'.classNames()}
										href={`mailto:${employee.emergency_email}`}
									>
										{employee.emergency_email}
									</a>
								</>
								
								<>
									<span className={'color-text-light font-size-15'.classNames()}>
										{__('Phone')}
									</span>
									<a
										className={'color-text font-size-15 line-height-23'.classNames()}
										href={`tel:${employee.emergency_phone}`}
									>
										{employee.emergency_phone}
									</a>
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
						<div>
							<div
								className={'color-text-light font-size-13 line-height-24 margin-bottom-10'.classNames()}
							>
								{__('Employment Status')} <LoadingIcon show={state.changing_status}/>
							</div>
							<DropDown
								value={employee.employment_status}
								clearable={false}
								onChange={changeEmploymentStatus}
								disabled={state.changing_status}
								options={Object.keys(employment_statuses).map((status) => {
									return { 
										id: status, 
										label: employment_statuses[status] 
									};
								})}
							/>
						</div>
						{
							!employee.reporting_person ? null :
							<div>
								<div className={'color-text-light font-size-13 line-height-24'.classNames()}>
									{__('Reporting person')}
								</div>
								<div className={'crew-hrm-border padding-20 margin-top-10 '.classNames()}>
									<img 
										src={employee.reporting_person.avatar_url} 
										style={{width: '32px', height: '32px', borderRadius: '50%'}} 
									/>
									<div className={'color-text font-size-17 margin-top-10'.classNames()}>
										{employee.reporting_person.display_name}
									</div>
									<div className={'color-text-light font-size-13'.classNames()}>
										{employee.reporting_person.designation}
									</div>
								</div>
							</div>
						}
						
						{
							!socials.length ? null :
							<div>
								<div className={'color-text-light font-size-13 line-height-24'.classNames()}>Contact</div>
								<div
									className={
										'd-flex align-items-center flex-wrap-wrap flex-direction-row row-gap-15 column-gap-15 margin-top-20'.classNames() +
										'employee-social-profile'.classNames(ProfileCss)
									}
								>
									{
										socials.map(s=>{
											return <a key={s.key} href={s.url} target='_blank'>
												<img src={s.icon}/>
											</a>
										})
									}
								</div>
							</div>
						}
					</div>
				</div>
			</div>
		}
	</>
}
