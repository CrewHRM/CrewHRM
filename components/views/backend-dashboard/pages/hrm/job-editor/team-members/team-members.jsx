import React, { useState } from "react";

import { TextField } from "../../../../../../materials/text-field/text-field.jsx";
import { __ } from "../../../../../../utilities/helpers.jsx";

import avatar from '../../../../../../images/avatar.svg';
import style from './team.module.scss';
import { CoverImage } from "../../../../../../materials/image/image.jsx";
import { ActionButtons } from "../index.jsx";

const members = {
	user_id    : 1,
	name       : 'Esther Howard',
	email      : 'alma.lawson@example.com',
	avatar_url : avatar,
	role       : 'Super Admin',
	is_self    : true,
}

const member_list = Array(5).fill(members).map((m, i)=>{
	return {
		...m, 
		is_self : i===0,
		role    : i===0 ? m.role : null
	}
});

export function TeamMembers(props) {
	const {navigateTab} = props;
	const [state, setState] = useState({
		search: ''
	})

	const handlerSubmIssion=()=>{

	}

	return  <div className={'team'.classNames(style)}>
		<span className={'d-block font-size-20 font-weight-600 text-color-primary margin-bottom-40'.classNames()}>
			{__( 'Team Memebers' )}
		</span>
		
		<div className={'margin-bottom-15'.classNames()}>
			<TextField 
				placeholder={__( 'Search a team member' )}
				icon="ch-icon ch-icon-search-normal-1"
				icon_position="right"
				className={'border-1-5 border-radius-10 border-color-tertiary padding-vertical-12 padding-horizontal-20'.classNames()}
				inputClassName={'font-size-15 font-weight-400 line-height-25 text-color-secondary'.classNames()}
				/>
		</div>
		
		<div className={'border-1 border-color-tertiary border-radius-10 margin-bottom-40'.classNames()}>
			{member_list.map((member, index)=>{
				const {avatar_url, name, email, role} = member;
				return <div className={`d-flex align-items-center padding-15 ${index<(member_list.length-1) ? 'border-bottom-1' : ''} border-color-tertiary`.classNames()}>
					<div>
						<CoverImage 
							src={avatar_url} 
							circle={true}
							width={32}/>
					</div>
					<div className={'flex-1 margin-left-10 margin-right-20'.classNames()}>
						<span className={'d-block font-size-15 font-weight-500 line-height-24 letter-spacing--15 text-color-primary margin-bottom-2'.classNames()}>
							{name}
						</span>
						<span className={'d-block font-size-13 font-weight-400 line-height-24 letter-spacing--13 text-color-secondary'.classNames()}>
							{email}
						</span>
					</div>
					<div className={'d-flex align-items-center'.classNames()}>
						{role && <span className={'d-block font-size-14 font-weight-400 line-height-24 letter-spacing--14 text-color-secondary'.classNames()}>
							{role}
						</span> || null}

						<i className={`ch-icon ch-icon-trash font-size-20 text-color-secondary margin-left-20 cursor-pointer`.classNames()}></i>
					</div>
				</div>
			})}
		</div>

		<ActionButtons onBack={navigateTab} onNext={handlerSubmIssion}/>
	</div>
}