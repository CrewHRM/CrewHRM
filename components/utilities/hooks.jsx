import React from "react";
import { getRandomString } from "./helpers.jsx";

function enqueueHook(handler, component, priority, pointer) {
	window.CrewHRM[pointer].push({
		key: getRandomString(),
		handler,
		component,
		priority
	});
}

function getHooks(handler, pointer) {
	let hooks = window.CrewHRM[pointer].filter(hook=>hook.handler==handler);

	// Get unique array and Sort by priority
	let priorities = [...new Set( hooks.map(h=>h.priority) )];
	priorities.sort();

	let new_ar = [];
	priorities.forEach(p=>{
		hooks.forEach(h=>{
			if (h.priority==p) {
				new_ar.push(h);
			}
		});
	});

	return new_ar;
}

export function addAction(action, comp, priority=10) {
	enqueueHook(action, comp, priority, 'action_hooks');
}

export function addFilter(action, comp, priority=10) {
	enqueueHook(action, comp, priority, 'filter_hooks');
}

export function DoAction(props, payload={}) {
	let {position, action} = props;
	let handlers = getHooks( action + '_' + position, 'action_hooks' );

	return handlers.map(handler=>{
		let {component: Comp, key} = handler;
		return <Comp key={key} {...payload}/>
	});
}