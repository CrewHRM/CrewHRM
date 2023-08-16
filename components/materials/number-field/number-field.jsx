import React, { useRef } from "react";

export function NumberField(props) {
	const {onChange, className='', value, max, min} = props;
	const ref = useRef();

	const changeValue=v=>{
		let {value} = ref.current;
		value = parseInt( value ) || 0;

		if( !isNaN(min) && value<min ) {
			value = min;
		}

		if( !isNaN(max) && value>max ) {
			value = max;
		}

		onChange(value);
	}

	return <div className={'d-flex align-items-center'.classNames() + className}>
		<div className={'height-20'.classNames()}>
			<i 
				className={"ch-icon ch-icon-minus-square font-size-20 text-color-secondary cursor-pointer".classNames()}
				onClick={()=>changeValue(-1)}></i>
		</div>
		<div className={'flex-1'.classNames()}>
			<input 
				ref={ref}
				type="text" 
				onChange={e=>onChange(parseInt(e.currentTarget.value) || 0)} 
				value={value}
				className={'text-field-flat text-align-center'.classNames()}/>
		</div>
		<div className={'height-20'.classNames()}>
			<i 
				className={"ch-icon ch-icon-add-square font-size-20 text-color-secondary cursor-pointer".classNames()} 
				onClick={()=>changeValue(1)}></i>
		</div>
	</div>
}

