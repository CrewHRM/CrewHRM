import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const _primary = '_primary_';
export const ContextHistoryFields = createContext();

function addToHistory(obj_value, { index, history }) {
	// Remove nexts from current index just like how code editor keep track of history
	history.splice(index + 1);

	// Copy the last history and merge the changed value with that
	let latest = history[history.length - 1] || {};
	latest = { ...latest, ...obj_value };

	// Put the new entry to the history queue
	history.push(latest);

	return {
		index: history.length - 1,
		history
	};
}

export function UndoRedo({ segment = _primary }) {
	const { onUndoRedo, historyLength: length, index: indexes } = useContext(ContextHistoryFields);
	const historyLength = length[segment];
	const index = indexes[segment];

	const unDoRedo = (shift) => {
		onUndoRedo(shift, segment);
	};

	const detectUndoRedoShortcut = useCallback(
		(event) => {
			if (event.metaKey || event.ctrlKey) {
				if (event.key === 'z' || event.keyCode === 90) {
					unDoRedo(event.shiftKey ? 1 : -1);
					event.preventDefault();
				} else if (event.key === 'y' || event.keyCode === 89) {
					unDoRedo(1);
					event.preventDefault();
				}
			}
		},
		[index]
	);

	useEffect(() => {
		document.addEventListener('keydown', detectUndoRedoShortcut);

		return () => {
			document.removeEventListener('keydown', detectUndoRedoShortcut);
		};
	}, [detectUndoRedoShortcut]);

	const can_undo = index > 0;
	const can_redo = index < historyLength - 1;

	return (
		<div className={'d-flex align-items-center column-gap-30'.classNames()}>
			<i
				className={`ch-icon ch-icon-undo font-size-26 ${
					can_undo ? 'color-text cursor-pointer' : 'color-text-hint'
				}`.classNames()}
				onClick={() => (can_undo ? unDoRedo(-1) : 0)}
			></i>
			<i
				className={`ch-icon ch-icon-redo font-size-26 ${
					can_redo ? 'color-text cursor-pointer' : 'color-text-hint'
				}`.classNames()}
				onClick={() => (can_redo ? unDoRedo(1) : 0)}
			></i>
		</div>
	);
}

export function HistoryFields({ defaultValues = {}, children, segmented = false }) {
	let _history;

	// Prepare segmented
	if (!segmented) {
		_history = {
			[_primary]: {
				index: 0,
				history: [defaultValues]
			}
		};
	} else {
		_history = {};
		for (let k in defaultValues) {
			_history[k] = {
				index: 0,
				history: [defaultValues[k]]
			};
		}
	}

	const [state, setState] = useState(_history);

	const onChange = (name, value, segment = _primary) => {
		const { index = 0, history = [] } = state[segment];
		const obj_value = typeof name === 'object' ? name : { [name]: value };

		// Finally update state
		setState({
			...state,
			[segment]: {
				...state[segment],
				...addToHistory(obj_value, { index, history })
			}
		});
	};

	const onUndoRedo = (shift, segment = _primary) => {
		const { index, history = [] } = state[segment];
		const historyLength = history.length;

		if ((shift === 1 && index >= historyLength - 1) || (shift === -1 && index <= 0)) {
			// Prevent out of boundary
			return;
		}

		setState({
			...state,
			[segment]: {
				...state[segment],
				index: index + shift
			}
		});
	};

	const clearHistory = (segment = _primary) => {
		const { index, history } = state[segment];

		setState({
			...state,
			[segment]: {
				index: 0,
				history: [history[index] || {}]
			}
		});
	};

	// Prepare values to pass to children
	let _values = {};
	let _length = {};
	let _index = {};
	let _go_next = {};
	for (let segment in state) {
		let { history, index } = state[segment];

		_values[segment] = history[index];
		_length[segment] = history.length;
		_index[segment] = index;
		_go_next[segment] = index > 0;
	}

	// Normalize payload if not segmented
	if (!segmented) {
		_values = _values[_primary];
		_go_next = _go_next[_primary];

		// Length and index is not necessary to normalize as it used internally here
	}

	const payload = {
		// These to for child components to store value on change and access them
		onChange,
		clearHistory,
		values: _values,
		can_go_next: _go_next,

		// These three are supposed to be used internally by UndoRedo component
		onUndoRedo,
		index: _index,
		historyLength: _length
	};

	return (
		<ContextHistoryFields.Provider value={payload}>{children}</ContextHistoryFields.Provider>
	);
}
