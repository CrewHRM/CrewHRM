import React from "react";

export function addToHistory(name, value, {index, history}) {

	// Remove nexts from current index just like how code editor keep track of history
	history.splice(index+1);

	// Copy the last history and merge the changed value with that
	let latest = history[history.length-1] || {};
	latest = {...latest, [name]: value};

	// Put the new entry to the history queue
	history.push(latest);

	return {
		index: history.length-1, 
		history
	}
}

export function UndoRedo({onChange, historyLength, index}) {
	const unDoRedo=(shift)=>{
		onChange(index+shift);
	}

	const can_undo = index>0;
	const can_redo = index<historyLength-1;

	return <div className={'d-flex align-items-center column-gap-30'.classNames()}>
		 <i
			className={`ch-icon ch-icon-redo font-size-26 ${can_undo ? 'color-text cursor-pointer' : 'color-text-hint'}`.classNames()}
			onClick={()=>can_undo ? unDoRedo(-1) : 0}
		></i>
		<i
			className={`ch-icon ch-icon-undo font-size-26 ${can_redo ? 'color-text cursor-pointer' : 'color-text-hint'}`.classNames()}
			onClick={()=>can_redo ? unDoRedo(1) : 0}
		></i>
	</div>
}
