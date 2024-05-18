import React, { useState, useContext } from 'react';
import {Link} from 'react-router-dom';

import { patterns } from 'crewhrm-materials/data.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import imgsrc from 'crewhrm-materials/static/images/addemployee-img-subscribe-5.png';

import employeecss from '../employee.module.scss';

export default function EmployeeInvite() {
	
	const {ajaxToast} = useContext(ContextToast);

	const [state, setState] = useState({
		email: '',
		inviting: false
	});
	
	const inviteEmail=()=>{
		
		setState({
			...state,
			inviting: true
		});

		request('inviteEmployeeViaEmail', {email: state.email}, resp=>{
			setState({
				...state,
				inviting: false,
				email: resp.success ? '' : state.email
			});

			ajaxToast(resp);
		});
	}

	return (
		<>
			<StickyBar title={__('People')} canBack={true}>
				<div className={'d-flex align-items-center column-gap-30'.classNames()}>
					<div className={'d-inline-block'.classNames()}>
						<Link
							to={`/employees/new/`}
							className={'button button-primary'.classNames()}
						>
							{__('Add New Employee')}
						</Link>
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
						{__('Invite team members')}
					</div>
					<div
						className={'font-size-15 font-weight-400 line-height-25 margin-bottom-10 text-align-center color-text-light'.classNames()}
					>
						{__('To invite team members write their email addresses and click on invite.')}
					</div>
				</div>
				<div className={'employee-invitation-area'.classNames(employeecss)}>
					<div className={'employee-invitation-textarea'.classNames(employeecss)}>
						<input
							type="text"
							placeholder={__('Enter email')}
							value={state.email}
							onChange={(e) => setState({...state, email: e.currentTarget.value})}
						/>
					</div>

					<button
						className={'button button-primary button-large margin-top-20 text-align-center'.classNames()}
						onClick={inviteEmail}
						disabled={state.inviting || !state.email || !patterns.email.test(state.email)}
					>
						{__('Invite')} <LoadingIcon show={state.inviting}/>
					</button>
				</div>
			</div>
		</>
	);
}
