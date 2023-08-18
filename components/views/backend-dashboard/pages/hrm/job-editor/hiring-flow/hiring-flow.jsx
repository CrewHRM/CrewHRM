import React, { useState } from "react";
import { __, getRandomString } from "../../../../../../utilities/helpers.jsx";

import style from './hiring.module.scss';
import { SortableList } from "../../../../../../materials/dnd/sortable-list.jsx";
import { ActionButtons } from "../index.jsx";
import { DeletionConfirm } from "./modal-confirm/model-to-confirm.jsx";

export const sequences = [
	__( 'Screening' ),
	__( 'Assesment' ),
	__( 'Interview' ),
	__( 'Make an Offer' ),
	__( 'Hired' )
].map(s=>{
	return {
		id: getRandomString(),
		label: s
	}
});

export function HiringFlow(props) {
	const {navigateTab} = props;

	const [state, setState] = useState({
		confirm_modal_for : null,
		sequences         : sequences
	});

	const addStage=()=>{
		setState({
			...state,
			sequences: [
				...state.sequences,
				{
					id: getRandomString(),
					label: __( 'Untitled' )
				}
			]
		})
	}

	const deleteStage=(id)=>{
		const index = state.sequences.findIndex(stage=>stage.id===id);
		const {sequences} = state;
		sequences.splice( index, 1 );
		
		setState({
			...state,
			sequences
		});
	}

	const renameStage=(id, label)=>{
		const {sequences} = state;
		const index = sequences.findIndex(s=>s.id==id);
		sequences[index].label = label;

		setState({
			...state,
			sequences
		});
	}

	const closeModals=()=>{
		setState({
			...state,
			confirm_modal_for : null
		})
	}

	return <div className={'hiring'.classNames(style)}>
		{state.confirm_modal_for && <DeletionConfirm onClose={closeModals}/> || null}
		<span className={'d-block font-size-20 font-weight-600 text-color-primary margin-bottom-40'.classNames()}>
			{__( 'Hiring stage' )}
		</span>
		<SortableList
			onReorder={sequences=>setState({...state, sequences})}
			items={
				state.sequences.map(sequence=>{
				return {
					...sequence,
					rendered: <div className={'d-flex align-items-center border-radius-10 border-1-5 border-color-tertiary padding-15 margin-bottom-15'.classNames() + 'single'.classNames(style)}>
						<div>
							<i className={'ch-icon ch-icon-drag font-size-26 text-color-light'.classNames()}></i>
						</div>
						<div className={'flex-1'.classNames()}>
							<input 
								type="text" 
								value={sequence.label} 
								onChange={e=>renameStage(sequence.id, e.currentTarget.value)}
								className={'text-field-flat margin-left-5'.classNames()}/>
						</div>
						<div>
							<i 
								className={'ch-icon ch-icon-trash font-size-24 text-color-danger margin-left-20 cursor-pointer'.classNames() + 'trash'.classNames(style)}
								onClick={()=>setState({...state, confirm_modal_for: sequence.id})}></i>
						</div>
					</div>
				}
			})}/>

		<div className={'d-flex align-items-center margin-bottom-50'.classNames() + 'add-stage'.classNames(style)} onClick={addStage}>
			<div>
				<i className={'ch-icon ch-icon-add-circle font-size-24'.classNames()}></i>
			</div>
			<div className={'flex-1 font-size-15 font-weight-500 margin-left-10'.classNames()}>
				{__( 'Add stage' )}
			</div>
		</div>

		<ActionButtons onBack={()=>navigateTab(-1)} onNext={()=>navigateTab(1)}/>
	</div>
}