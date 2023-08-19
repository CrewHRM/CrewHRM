import React, { useContext, useState } from "react";
import { ContextModal, Modal } from "../../../../../../../materials/modal/modal.jsx";
import { __ } from "../../../../../../../utilities/helpers.jsx";

import avatar from '../../../../../../../images/avatar.svg';
import style from './confirm.module.scss';
import { CoverImage } from "../../../../../../../materials/image/image.jsx";
import { DropDown } from "../../../../../../../materials/dropdown/dropdown.jsx";
import { sequences } from "../hiring-flow.jsx";

function Content({stage_id, openMoveDiloague}) {
	const {close}    = useContext(ContextModal);
	const btn_class  = 'font-size-15 font-weight-400 letter-spacing--3 padding-vertical-10 padding-horizontal-15 border-radius-5 border-1-5 border-color-tertiary cursor-pointer'.classNames();

	return <div className={'confirm'.classNames(style) + 'background-color-white border-radius-10 text-align-center'.classNames()}>
		<span className={'d-block font-size-24 font-weight-500 line-height-32 letter-spacing--3 text-color-primary margin-bottom-30'.classNames()}>
			{__( 'Are you sure, you want to delete this item. We won\'t be able to recover it.' )}
		</span>
		<button className={'cancel-button'.classNames(style) + btn_class + 'margin-right-20'.classNames()} onClick={()=>close()}>
			{__( 'Cancel' )}
		</button>
		<button className={'delete-button'.classNames(style) + btn_class} onClick={openMoveDiloague}>
			{__( 'Delete' )}
		</button>
	</div>
}

function MoveContent({total, users=[]}) {
	const {close}  = useContext(ContextModal);
	const more = total-users.length;
	
	return <div className={'move'.classNames(style) + 'background-color-white border-radius-10 text-align-center position-relative'.classNames()}>
		<i className={'ch-icon ch-icon-times font-size-24 text-color-light position-absolute right-22 top-22 cursor-pointer'.classNames()} onClick={()=>close()}></i>
		
		<div className={'d-inline-flex align-items-center'.classNames()}>
			{users.map(({user_id, avatar_url}, index)=>{
				return <div key={user_id} className={'d-inline-block'.classNames()} style={index ? {marginLeft: '-12px'} : {}}>
					<CoverImage src={avatar_url} circle={true} width={42}/>
				</div>
			})}
			
			{more && <div className={'d-inline-block'.classNames()} style={{marginLeft: '-12px'}}>
				<CoverImage circle={true} width={42} backgroundColor="#236BFE">
					<span className={'font-size-15 font-weight-700 line-height-32 letter-spacing--3 text-color-white'.classNames()}>
						{more}+
					</span>
				</CoverImage>
			</div> || null}
		</div>
		
		<div className={'margin-top-20 margin-bottom-20'.classNames()}>
			<span className={'d-block font-size-15 font-weight-400 letter-spacing--3 text-color-light margin-bottom-5'.classNames()}>
				{__( 'About 51 candidates are in the interview stage. ' )}
			</span>

			<span className={'d-block font-size-24 font-weight-500 line-height-32 letter-spacing--3 text-color-primary'.classNames()}>
				{__( 'To remove this stage, candidates must be moved to another stage.' )}
			</span>
		</div>

		<div>
			<span className={"d-block font-size-15 font-weight-400 letter-spacing--3 text-color-light margin-bottom-10".classNames()}>
				{__( 'Move to' )}
			</span>

			<div className={'d-flex align-items-center column-gap-10'.classNames()} style={{width: '400px'}}>
				<div className={'flex-1'.classNames()}>
					<DropDown 
						className={'w-full padding-vertical-5 padding-horizontal-12 border-1 border-color-primary'.classNames()}
						value="assessment" 
						options={sequences.map(s=>{return {value: s.id, label: s.label}})}/> 
				</div>
				<div style={{width: '110px'}}>
					<button className={'button button-primary'.classNames()}>
						{__( 'Move' )}
					</button>
				</div>
			</div>
		</div>
	</div>
}

export function DeletionConfirm(props) {
	const [state, setState] = useState({
		show_move_modal: false,
		total_users: 34,
		peak_users: [
			{
				user_id: 1,
				avatar_url: avatar
			},
			{
				user_id: 2,
				avatar_url: avatar
			},
			{
				user_id: 3,
				avatar_url: avatar
			},
		]
	});

	return <>
		{/* Confirm Modal */}
		{!state.show_move_modal && <Modal onClose={props.onClose}>
			<Content {...props} openMoveDiloague={()=>setState({...state, show_move_modal: true})}/>
		</Modal> || null}

		{/* Move Modal */}
		{state.show_move_modal && <Modal onClose={props.onClose}>
			<MoveContent 
				{...props} 
				total={state.total_users} 
				users={state.peak_users}/>
		</Modal> || null}
	</> 
}