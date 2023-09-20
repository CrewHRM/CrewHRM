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
		rateLimit=0
	} = props;

	const [text, setText] = useState(value || '');

	const _onChange=e=>{
		setText(e.currentTarget.value);
	}

	useEffect(()=>{
		// No need timer as it is zero delay
		if ( !rateLimit ) {
			onChange(text);
			return;
		}

		const timer = window.setTimeout(()=>{
			onChange(text);
		}, rateLimit);

		return ()=>window.clearInterval(timer);
	}, [text]);

	const attr = {ref, type, onFocus, onBlur, placeholder, pattern}

	return <>
		<Conditional show={type!=='textarea'}>
			<input 
				{...attr}
				value={text} 
				className={className}
				onChange={_onChange}/>
		</Conditional>

		<Conditional show={type==='textarea'}>
			<textarea 
				{...attr}
				value={text}
				className={className}
				onChange={_onChange}></textarea>
		</Conditional>
	</>
});
