import React from 'react';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { FileUpload } from 'crewhrm-materials/file-upload/file-upload.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { DateField } from 'crewhrm-materials/date-time.jsx';
import { ExpandableContent } from 'crewhrm-materials/expandable-content/expandable-content.jsx';
import { TextEditor } from 'crewhrm-materials/text-editor/text-editor.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import { AddressFields } from 'crewhrm-materials/address-fields.jsx';

export function RenderField({ field={}, onChange=()=>{}, values = {}, grouped=false }) {
	if ( Array.isArray(field) ) {
		return <div className={'d-flex align-items-center column-gap-20'.classNames()}>
			{field.map(f=>{
				return <div key={f.name} className={'flex-1'.classNames()}>
					<RenderField {...{field:f, onChange, values}} grouped={true}/>
				</div>
			})}
		</div>
	}

	const {
		name,
		label,
		type,
		placeholder,
		maxlenth,
		maxsize,
		options,
		disclaimer,
		required,
		accept,
		enabled,
		regex
	} = field;

	const dispatchChecks = (e) => {
		const { checked, name, value } = e.currentTarget;

		// If radio button, directly set boolean value
		if (type === 'radio') {
			if (checked) {
				onChange(name, value);
			}
			return;
		}

		// If checkbox, put the value in the array
		const array = Array.isArray(values[name]) ? values[name] : [];
		if (checked) {
			// Store the value in array if not already
			if (array.indexOf(value) === -1) {
				array.push(value);
			}
		} else {
			// Delete the value from the array if exists
			const index = array.findIndex((element) => element === value);
			if (index > -1) {
				array.splice(index, 1);
			}
		}

		onChange(name, array);
	};

	return (
		<Conditional show={enabled}>
			<div data-crewhrm-selector="single-field">
				<Conditional show={disclaimer}>
					<ExpandableContent className={'margin-bottom-30'.classNames()}>
						<span
							className={'d-block font-size-20 font-weight-600 color-text'.classNames()}
						>
							{disclaimer?.heading}
						</span>
						<div
							className={'font-size-15 font-weight-400 line-height-24 letter-spacing--15 color-text'.classNames()}
						>
							{disclaimer?.description}
						</div>
					</ExpandableContent>
				</Conditional>

				<span className={'d-block font-size-15 font-weight-500 margin-bottom-10 color-text'.classNames()}>
					{label}
					<Conditional show={label && required}>
						<span className={'color-error'.classNames()}>*</span>
					</Conditional>
				</span>

				<Conditional show={['text', 'url', 'email'].indexOf(type) > -1}>
					<TextField
						value={values[name] || ''}
						type={type}
						placeholder={placeholder}
						onChange={v => onChange(name, v)}
						regex={regex}
					/>
				</Conditional>

				<Conditional show={type == 'textarea'}>
					<TextField
						type="textarea"
						value={values[name] || ''}
						placeholder={placeholder}
						onChange={v => onChange(name, v)}
					/>
				</Conditional>

				<Conditional show={type == 'textarea_rich'}>
					<TextEditor
						onChange={(v) => onChange(name, v)}
						value={values[name] || ''}
						placeholder={placeholder}
					/>
				</Conditional>

				<Conditional show={type == 'dropdown'}>
					<DropDown
						value={values[name]}
						options={options}
						placeholder={placeholder}
						onChange={(value) => onChange(name, value)}
					/>
				</Conditional>

				<Conditional show={type == 'date'}>
					<DateField
						value={values[name]}
						onChange={(value) => onChange(name, value)}
					/>
				</Conditional>

				<Conditional show={type == 'checkbox' || type == 'radio'}>
					<div className={'d-flex flex-direction-row column-gap-20'.classNames()}>
						{options?.map(({ id: value, label }) => {
							const _value = values[name];
							let checked = false;

							if (type === 'radio') {
								checked = _value === value;
							} else if (Array.isArray(_value)) {
								checked = _value.findIndex((v) => v == value) > -1;
							}

							return (
								<label
									data-crewhrm-selector={'field-' + type}
									key={value}
									className={'d-flex flex-direction-row align-items-center column-gap-7 cursor-pointer'.classNames()}
								>
									<input
										{...{ type, name, value: value || '', checked }}
										onChange={dispatchChecks}
									/>
                                    &nbsp; {label}
								</label>
							);
						})}
					</div>
				</Conditional>

				<Conditional show={type == 'file'}>
					<FileUpload
						value={values[name]}
						textPrimary={placeholder}
						maxlenth={maxlenth}
						maxsize={maxsize}
						accept={accept}
						onChange={(files) => onChange(name, files)}
					/>
				</Conditional>
				
				<Conditional show={type==='address'}>
					<AddressFields 
						values={values} 
						onChange={onChange}/>
				</Conditional>
			</div>
		</Conditional>
	);
}
