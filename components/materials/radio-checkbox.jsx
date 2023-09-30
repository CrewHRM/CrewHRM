import React from 'react';

export function checkBoxRadioValue(e, values) {
	const { type, value: _value, checked } = e.currentTarget;

	if (type == 'radio') {
		return _value;
	}

	let _values = Array.isArray(values) ? values : [];
	let index = _values.indexOf(_value);

	if (checked) {
		if (index === -1) {
			_values.push(_value);
		}
	} else if (index >= 0) {
		_values.splice(index, 1);
	}

	return _values;
}

export function RadioCheckbox({
	name,
	value,
	type,
	options = [],
	onChange,
	className,
	spanClassName
}) {
	let check_array = Array.isArray(value) ? value : [];

	return options.map((option) => {
		let { label, id, disabled } = option;
		return (
			<div key={id}>
				<label
					className={`d-inline-flex align-items-center column-gap-10 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`.classNames() + className}
				>
					<input
						type={type}
						name={name}
						value={id}
						disabled={disabled}
						checked={type === 'radio' ? value === id : check_array.indexOf(id) > -1}
						onChange={(e) => onChange(checkBoxRadioValue(e, value))}
					/>
					<span className={spanClassName}>{label}</span>
				</label>
			</div>
		);
	});
}
