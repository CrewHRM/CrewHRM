import React, { useEffect, useState, forwardRef } from "react";
import { Conditional } from "./conditional.jsx";

export const InputDebounce = forwardRef((props, ref) => {
	
	const {
		value, 
		type, 
		onFocus, 
		onBlur, 
		onChange, 
		placeholder, 
		pattern, 
		className, 
		inputDelay
	} = props;

	const [text, setText] = useState(value || '');

	const _onChange=e=>{

		const {value} = e.currentTarget;

		if ( !inputDelay ) {
			onChange(value);

		} else {
			setText(value);
		}

	}

	useEffect(()=>{
		const timer = window.setTimeout(()=>{
			onChange(text);
		}, inputDelay);

		return ()=>window.clearInterval(timer);
	}, [text]);

	const attr = {
		ref, 
		type, 
		onFocus, 
		onBlur, 
		placeholder, 
		pattern,
		value: !inputDelay ? value : text
	}

	return <>
		<Conditional show={type!=='textarea'}>
			<input 
				{...attr}
				className={className}
				onChange={_onChange}/>
		</Conditional>

		<Conditional show={type==='textarea'}>
			<textarea 
				{...attr}
				className={className}
				onChange={_onChange}></textarea>
		</Conditional>
	</>
});
