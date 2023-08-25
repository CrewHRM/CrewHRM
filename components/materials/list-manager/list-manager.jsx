import React, { useEffect, useState } from "react";

import {SortableList} from '../sortable-list.jsx';
import { __, getRandomString } from "../../utilities/helpers.jsx";

import style from './list.module.scss';

export function ListManager(props) {
	const {list, mode, className='', onChange, deleteItem, addText=__( 'Add New' )} = props;
	const is_queue = mode==='queue';

	const [state, setState] = useState({
		last_id       : null,
		exclude_focus : list.map(s=>s.id),
	});

	const addStage=()=>{
		const id = getRandomString();

		// Keep track of last id to focus
		setState({
			...state,
			last_id: id
		});

		// Build array
		let item = {id, label: __( 'Untitled' )}
		let new_array = is_queue ? [...list, item] : [item, ...list];

		// Send the changes to parent component
		onChange(new_array);
	}

	const renameStage=(id, label)=>{
		const {list=[]} = props;
		const index = list.findIndex(s=>s.id==id);
		list[index].label = label;

		// Send the renamed list to parent
		onChange(list);
	}

	const deleteFlow=(id)=>{
		const {list=[]} = props;

		if (id!==null) {
			const index = list.findIndex(s=>s.id===id);
			list.splice(index, 1);
		}
		
		// Send the updated list to parent
		onChange(list);
	}

	useEffect(()=>{
		const {last_id, exclude_focus} = state;
		if ( !last_id || exclude_focus.indexOf( last_id )>-1 ) {
			return;
		}

		const input = document.getElementById('crewhrm-flow-option-'+last_id);
		
		if (input) {
			input.focus();
			input.select();

			setState({
				...state, 
				exclude_focus:[
					...exclude_focus, 
					last_id
				]
			});
		}

	}, [list]);

	return <div className={'list-manager'.classNames(style) + `d-flex row-gap-15 ${is_queue ? 'flex-direction-column' : 'flex-direction-column-reverse'}`.classNames() + className}>
		<SortableList
			onReorder={list=>onChange(list)}
			items={
				list.map(list_item=>{
				return {
					...list_item,
					rendered: <div className={'d-flex align-items-center border-radius-10 border-1-5 b-color-tertiary padding-15'.classNames() + 'single'.classNames(style)}>
						<i className={'ch-icon ch-icon-drag font-size-26 color-text-light'.classNames()}></i>
						<div className={'flex-1'.classNames()}>
							<input 
								id={'crewhrm-flow-option-'+list_item.id}
								type="text" 
								value={list_item.label} 
								onChange={e=>renameStage(list_item.id, e.currentTarget.value)}
								className={'text-field-flat margin-left-5'.classNames()}/>
						</div>
						<i 
							className={'ch-icon ch-icon-trash font-size-24 color-danger margin-left-20 cursor-pointer'.classNames() + 'trash'.classNames(style)}
							onClick={()=>deleteItem ? deleteItem(list_item.id) : deleteFlow(list_item.id)}></i>
					</div>
				}
			})}/>

		<div className={'d-flex align-items-center darken-on-hover'.classNames() + 'add-stage'.classNames(style)} onClick={addStage}>
			<i className={'ch-icon ch-icon-add-circle font-size-24'.classNames()}></i>
			<div className={'flex-1 font-size-15 font-weight-500 margin-left-10'.classNames()}>
				{addText}
			</div>
		</div>
	</div>
}