import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { DropDown } from 'crewhrm-materials/dropdown/dropdown';
import { __, data_pointer, formatDate, getFlag, isEmpty } from 'crewhrm-materials/helpers.jsx';
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
						<div className={'crew-hrm-border padding-30'.classNames() + 'personal-info'.classNames()}>
							<div
								className={
									'd-flex align-items-center column-gap-10 justify-content-space-between margin-bottom-30'.classNames() +
									''.classNames()
								}
							>
								<div
									className={'d-flex align-items-center column-gap-10'.classNames() + ''.classNames()}
								>
									<i className={'ch-icon ch-icon-user-tick'.classNames()} />
									<span className={'color-text font-size-17'.classNames() + ''.classNames()}>
										Personal Info
									</span>
								</div>
								<div className={''.classNames() + ''.classNames()}>
									<i className={'ch-icon ch-icon-edit'.classNames()} />
								</div>
							</div>
							<div className={''.classNames()}>
								<div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '20px' }}>
									<span className={'color-text-light font-size-15'.classNames()}>First name</span>
									<span
										className={
											'color-text font-size-15 line-height-23'.classNames() + ''.classNames()
										}
									>
										Esther
									</span>
									<span className={'color-text-light font-size-15'.classNames() + ''.classNames()}>
										Last name
									</span>
									<span
										className={
											'color-text font-size-15 line-height-23'.classNames() + ''.classNames()
										}
									>
										Howard
									</span>
									<span className={'color-text-light font-size-15'.classNames() + ''.classNames()}>
										Preferred name
									</span>
									<span
										className={
											'color-text font-size-15 line-height-23'.classNames() + ''.classNames()
										}
									>
										Howard
									</span>
									<span className={'color-text-light font-size-15'.classNames() + ''.classNames()}>
										Email address
									</span>
									<span
										className={
											'color-text font-size-15 line-height-23'.classNames() + ''.classNames()
										}
									>
										jessica.hanson@example.com
									</span>
									<span className={'color-text-light font-size-15'.classNames() + ''.classNames()}>
										Phone number
									</span>
									<span
										className={
											'color-text font-size-15 line-height-23'.classNames() + ''.classNames()
										}
									>
										(205) 555-0100
									</span>
									<span className={'color-text-light font-size-15'.classNames() + ''.classNames()}>
										Date of birth
									</span>
									<span
										className={
											'color-text font-size-15 line-height-23'.classNames() + ''.classNames()
										}
									>
										11/7/1980
									</span>
									<span className={'color-text-light font-size-15'.classNames() + ''.classNames()}>
										Bio
									</span>
									<span
										className={
											'color-text font-size-15 line-height-23'.classNames() + ''.classNames()
										}
									>
										Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
										laboriosam, nisi ut al
									</span>
									<span className={'color-text-light font-size-15'.classNames() + ''.classNames()}>
										Address
									</span>
									<span
										className={
											'color-text font-size-15 line-height-23'.classNames() + ''.classNames()
										}
									>
										4140 Parker Rd. Allentown, New Mexico 31134
									</span>
									<span className={'color-text-light font-size-15'.classNames() + ''.classNames()}>
										Time Zone
									</span>
									<span
										className={
											'color-text font-size-15 line-height-23'.classNames() + ''.classNames()
										}
									>
										UTC-11:00 (11:34 AM)
									</span>
								</div>
							</div>
						</div>
					</div>
					<div
						className={
							'd-flex flex-direction-column row-gap-20'.classNames()
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
							<div className={'d-flex align-items-center column-gap-15 margin-top-20'.classNames()}>
								<i className={'ch-icon ch-icon-linkedin2'.classNames()} />
								<i className={'ch-icon ch-icon-x'.classNames()} />
								<i className={'ch-icon ch-icon-linkedin2'.classNames()} />
							</div>
						</div>
					</div>
				</div>
			</div>
		}
	</>
}
