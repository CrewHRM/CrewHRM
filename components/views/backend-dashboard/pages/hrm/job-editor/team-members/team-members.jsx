import React, { useRef, useState } from "react";

import { TextField } from "../../../../../../materials/text-field/text-field.jsx";
import { __ } from "../../../../../../utilities/helpers.jsx";
import avatar from '../../../../../../images/avatar.svg';
import { CoverImage } from "../../../../../../materials/image/image.jsx";
import { ActionButtons } from "../index.jsx";
import { DropDownUnanaged } from "../../../../../../materials/dropdown/dropdown.jsx";
import { SortableList } from "../../../../../../materials/dnd/sortable-list.jsx";

import style from './team.module.scss';

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
		user_id : m.user_id+i,
		is_self : i===0,
		role    : i===0 ? m.role : null
	}
});

export function TeamMembers(props) {
	const {navigateTab} = props;
	const search_ref = useRef();
	const [state, setState] = useState({
		members: member_list,
		users: []
	});

	const searchUsers=(keyword)=>{
		setState({
			...state,
			members: member_list,
			users: !keyword ? [] : member_list.slice(keyword.length)
		});
	}

	const renderSuggestion=()=>{
		if ( !state.users.length ) {
			return null;
		}

		return <div className={'margin-top-6 box-shadow-thick padding-vertical-5 padding-horizontal-20 border-radius-10'.classNames()} style={search_ref.current ? {width: search_ref.current.clientWidth+'px'} : {}}>
			{state.users.map((user, index)=>{
				const {avatar_url, name, email} = user;
				return <div className={`d-flex align-items-center padding-vertical-10 ${index<state.users.length-1 ? 'border-bottom-1 border-color-tertiary' : ''}`.classNames()}>
					<div className={'margin-right-10'.classNames()}>
						<CoverImage src={avatar_url} circle={true} width={32}/>
					</div>
					<div className={'flex-1'}>
						<span className={'d-block font-size-15 font-weight-500 line-height-24 letter-spacing--15 text-color-primary margin-bottom-2'.classNames()}>
							{name}
						</span>
						<span className={'d-block font-size-13 font-weight-400 line-height-24 letter-spacing--13 text-color-secondary'.classNames()}>
							{email}
						</span>
					</div>
				</div>
			})}
		</div>
	}

	const handlerSubmIssion=()=>{
		
	}

	return  <div className={'team'.classNames(style)}>
		<span className={'d-block font-size-20 font-weight-600 text-color-primary margin-bottom-40'.classNames()}>
			{__( 'Team Memebers' )}
		</span>
		
		<div className={'margin-bottom-15'.classNames()} ref={search_ref}>
			<DropDownUnanaged content={renderSuggestion()}>
				<TextField 
					placeholder={__( 'Search a team member' )}
					icon="ch-icon ch-icon-search-normal-1"
					icon_position="right"
					className={'border-1-5 border-radius-10 border-color-tertiary padding-vertical-12 padding-horizontal-20'.classNames()}
					inputClassName={'font-size-15 font-weight-400 line-height-25 text-color-secondary'.classNames()}
					onChange={searchUsers}/>
			</DropDownUnanaged>
		</div>
		
		<div className={'border-1 border-color-tertiary border-radius-10 margin-bottom-40'.classNames()}>
			<SortableList
				onReorder={members=>setState({...state, members})}
				items={
					state.members.map((member, index)=>{
						const {avatar_url, name, email, role, user_id} = member;
						return { 
							...member,
							id: 'id_'+user_id,
							rendered: <div className={`d-flex align-items-center padding-15 ${index<(state.members.length-1) ? 'border-bottom-1' : ''} border-color-tertiary`.classNames()}>
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
						}
					})
				}/>
		</div>

		<ActionButtons onBack={navigateTab} onNext={handlerSubmIssion}/>
	</div>
}